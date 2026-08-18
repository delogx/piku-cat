/**
 * Signatures Piku injects at the end (or, on bitbucket, the start) of
 * every comment it posts. Used by:
 *
 *   - Per-provider comment emitters
 *     (`github.service.ts`, `gitlab.service.ts`, `azureRepos.service.ts`,
 *      `forgejo.service.ts`, `bitbucket.service.ts`,
 *      `chatWithKodyFromGit.use-case.ts`, `commentManager.service.ts`)
 *     append the right marker to each Piku comment.
 *
 *   - Read-side filters that need to recognize "this comment was
 *     written by Piku, don't treat it as human signal":
 *     `commentAnalysis.service.ts` (rule-generator input filter),
 *     `validate-prerequisites.stage.ts` (skip re-review on standing
 *     PRs), etc.
 *
 * Two distinct values because bitbucket cloud's Atlassian Markdown
 * escapes raw HTML (it would render `<!-- kody-codereview -->` as
 * visible text), so the HTML-comment marker the other providers
 * suffix to each comment is unusable on bitbucket. Bitbucket gets a
 * visible chip at the start of each comment instead.
 */
export const KODY_IDENTIFIERS = {
    // piku-cat fork: `piku` first (our bot logs in as `piku-cat[bot]`);
    // `kody`/`kodus` stay so comments posted before the rename are still
    // recognised as bot-authored and not fed back in as human signal.
    LOGIN_KEYWORDS: ['piku', 'kody', 'kodus'],
    // Deliberately NOT rebranded: these strings are embedded in every
    // comment already posted, and they are how the bot finds its own
    // comments to edit. Renaming them would duplicate comments instead.
    MARKDOWN_IDENTIFIERS: {
        DEFAULT: 'kody-codereview',
        BITBUCKET: 'kody|code-review',
    },
} as const;

/**
 * True when the given comment body looks like one Piku itself
 * authored. Checks BOTH provider signatures so callers don't have to
 * special-case bitbucket. Case-insensitive on the body to match what
 * the existing filter sites have always done.
 */
export function isKodyAuthoredBody(body: string | undefined | null): boolean {
    const lower = (body ?? '').toLowerCase();
    return (
        lower.includes(KODY_IDENTIFIERS.MARKDOWN_IDENTIFIERS.DEFAULT) ||
        lower.includes(KODY_IDENTIFIERS.MARKDOWN_IDENTIFIERS.BITBUCKET)
    );
}
