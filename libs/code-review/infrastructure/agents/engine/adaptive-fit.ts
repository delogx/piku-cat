/**
 * Resolves an "adaptive fit profile" — a set of flags that downstream
 * code (prompt builder, agent loop, orchestrator) consults to decide
 * whether to drop fidelity in order to fit a small model context window.
 *
 * PR1 ships the *plumbing only*: every profile returns full-fidelity
 * flags, so behavior is byte-identical to today. PR2/PR3 will flip flags
 * per-profile so the strategies actually fire. Splitting this way keeps
 * the wiring change reviewable on its own and lets us run a baseline
 * benchmark before changing any review output.
 *
 * Thresholds are educated guesses (8K / 16K / 32K / 64K). Once the
 * profile is in use we'll log which one each run picks and revisit.
 */

export type AdaptiveProfileKind =
    | 'full'
    | 'light'
    | 'compact'
    | 'minimal'
    | 'unviable';

export interface AdaptiveProfile {
    kind: AdaptiveProfileKind;
    contextWindowTokens: number;
    /** Render compact system prompt (skip workflow + most rules). */
    compactPrompt: boolean;
    /** Don't append callGraph to the user prompt. */
    dropCallGraph: boolean;
    /** Force every file's tier to 'optional' (hunk-headers-only diffs). */
    allOptional: boolean;
    /** Truncate individual file diffs to this many chars; undefined = no cap. */
    maxDiffChars: number | undefined;
    /** Disable verifier / second-chance / coverage-recovery / synthesis-rescue. */
    skipHeavyPasses: boolean;
    /** Apply low-signal file filter (tests/md/css) even in deep mode. */
    lowSignalFilterUnconditional: boolean;
}

const FULL_THRESHOLD = 64_000;
const LIGHT_THRESHOLD = 32_000;
const COMPACT_THRESHOLD = 16_000;
const MINIMAL_THRESHOLD = 8_000;

/**
 * piku-cat fork addition: what the run actually needs, so the profile can
 * escalate on DEMAND rather than only on window size.
 *
 * Upstream classifies purely by `contextWindowTokens`, so any window >= 64K
 * resolves to `full`, which switches every mitigation OFF ("`full` because it
 * doesn't need them"). That assumption breaks on a big model reviewing a big
 * PR: the non-diff overhead is dominated by `callGraph`, which scales with the
 * repo, not the window. A 500-file PR can need ~930K chars (~230K tokens) of
 * call graph alone — so the preflight throws AgentContextWindowTooSmallError
 * while `dropCallGraph`, the one lever that would have rescued it, stays false
 * because it only fires under 32K. Chunking cannot help either: it splits
 * diffs, and this is the non-diff part.
 *
 * `estimatedPromptTokens` is the caller's estimate for the FULL profile (see
 * estimatePromptTokens). When it exceeds the usable budget we walk the bands
 * down one at a time — the same bands, same flags, just reached for a
 * different reason — and stop as soon as the estimate fits. Small-window
 * behaviour is untouched: without `demand` this is byte-identical to upstream.
 */
export interface AdaptiveDemand {
    /** Estimated full-fidelity prompt size, in tokens. */
    estimatedPromptTokens: number;
    /** Fraction of the window usable by the prompt (PROMPT_BUDGET_RATIO). */
    promptBudgetRatio: number;
    /** Tokens saved by dropping the call graph, if known. */
    callGraphTokens?: number;
}

const ESCALATION_ORDER: AdaptiveProfileKind[] = [
    'full',
    'light',
    'compact',
    'minimal',
];

function escalateForDemand(
    kind: AdaptiveProfileKind,
    contextWindowTokens: number,
    demand?: AdaptiveDemand,
): AdaptiveProfileKind {
    if (!demand || kind === 'unviable') return kind;
    if (!Number.isFinite(contextWindowTokens) || contextWindowTokens <= 0) {
        return kind;
    }

    const budget = Math.floor(contextWindowTokens * demand.promptBudgetRatio);
    if (budget <= 0) return kind;

    let need = demand.estimatedPromptTokens;
    if (need <= budget) return kind;

    let idx = ESCALATION_ORDER.indexOf(kind);
    if (idx < 0) return kind;

    // light+ drops the call graph, which is the single biggest non-diff term.
    // Subtract it once, when we first cross into light or beyond.
    while (need > budget && idx < ESCALATION_ORDER.length - 1) {
        idx += 1;
        if (ESCALATION_ORDER[idx] === 'light' && demand.callGraphTokens) {
            need -= demand.callGraphTokens;
        }
    }

    return ESCALATION_ORDER[idx];
}

function classify(contextWindowTokens: number): AdaptiveProfileKind {
    if (!Number.isFinite(contextWindowTokens)) return 'full';
    if (contextWindowTokens <= 0) return 'unviable';
    if (contextWindowTokens >= FULL_THRESHOLD) return 'full';
    if (contextWindowTokens >= LIGHT_THRESHOLD) return 'light';
    if (contextWindowTokens >= COMPACT_THRESHOLD) return 'compact';
    if (contextWindowTokens >= MINIMAL_THRESHOLD) return 'minimal';
    return 'unviable';
}

/**
 * Per-file diff cap used by the `minimal` profile. 4K chars ≈ 1K tokens
 * per file is enough for ~20 hunks of context; long files get a
 * truncation marker. Tied to the profile so callers don't have to pick
 * the constant themselves.
 */
const MINIMAL_PROFILE_MAX_DIFF_CHARS = 4_000;

/**
 * Resolve the profile for a given context window. Each band cumulatively
 * activates strategies (light ⊂ compact ⊂ minimal). `full` and
 * `unviable` keep every flag off — `full` because it doesn't need them,
 * `unviable` because the preflight will throw before strategies could
 * help and we don't want to silently emit "fidelity reduced" warnings
 * for a doomed run.
 *
 * The flags are read by `BaseCodeReviewAgentProvider.execute`,
 * `agent-review.stage.ts`, and `agent-loop.ts` to gate their behavior.
 */
export function resolveAdaptiveProfile(
    contextWindowTokens: number,
    demand?: AdaptiveDemand,
): AdaptiveProfile {
    const kind = escalateForDemand(
        classify(contextWindowTokens),
        contextWindowTokens,
        demand,
    );
    return buildProfile(kind, contextWindowTokens);
}

/**
 * piku-cat fork addition: escalate an ALREADY-RESOLVED profile against demand.
 *
 * Needed because the two resolution sites know different things. The stage
 * (agent-review.stage.ts) resolves the profile BEFORE the call graph exists —
 * it has to, since `dropCallGraph` is what decides whether to build it — so it
 * cannot measure the dominant term. The provider receives `input.callGraph` and
 * therefore knows the real cost, but upstream it just accepts the stage's
 * profile verbatim (`input.adaptiveProfile ?? resolve(...)`), so a `full`
 * profile from the stage can never be reconsidered no matter how big the graph
 * turned out to be. Dropping it from the prompt at that point still saves every
 * one of its tokens.
 *
 * Returns the input profile unchanged when it already fits, when no demand is
 * supplied, or when the run is `unviable` — so behaviour only changes for runs
 * that would otherwise have hard-failed the preflight.
 */
export function escalateAdaptiveProfileForDemand(
    profile: AdaptiveProfile,
    demand?: AdaptiveDemand,
): AdaptiveProfile {
    const kind = escalateForDemand(
        profile.kind,
        profile.contextWindowTokens,
        demand,
    );
    if (kind === profile.kind) return profile;
    return buildProfile(kind, profile.contextWindowTokens);
}

function buildProfile(
    kind: AdaptiveProfileKind,
    contextWindowTokens: number,
): AdaptiveProfile {
    const resolvedWindow = Number.isFinite(contextWindowTokens)
        ? contextWindowTokens
        : 0;

    // Cumulative flag activation per band:
    const light = kind === 'light' || kind === 'compact' || kind === 'minimal';
    const compact = kind === 'compact' || kind === 'minimal';
    const minimal = kind === 'minimal';

    return {
        kind,
        contextWindowTokens: resolvedWindow,
        // light+: cheap wins — fewer tokens out, fewer follow-up calls.
        dropCallGraph: light,
        skipHeavyPasses: light,
        // compact+: trim the prompt itself and drop low-signal files
        // unconditionally (no longer gated on review mode).
        compactPrompt: compact,
        lowSignalFilterUnconditional: compact,
        // minimal: last resort. All files become hunk-headers-only and
        // long diffs get truncated to MINIMAL_PROFILE_MAX_DIFF_CHARS.
        // Quality drops noticeably here — only fires below 16K.
        allOptional: minimal,
        maxDiffChars: minimal ? MINIMAL_PROFILE_MAX_DIFF_CHARS : undefined,
    };
}
