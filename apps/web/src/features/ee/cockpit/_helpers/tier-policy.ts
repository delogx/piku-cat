import type { OrganizationLicense } from "../../subscription/_services/billing/types";

/**
 * Cockpit tier policy — MUST stay aligned with
 * `libs/cockpit/domain/tier-policy.ts` on the backend. Duplicated here
 * because apps/web doesn't import from libs/*.
 *
 * Allowed:
 *   - cloud paid (subscriptionStatus=active) on Teams or Enterprise plans
 *   - licensed self-hosted on any Enterprise plan
 *   - trial (treated as Teams-cloud equivalent)
 */
export function isCockpitTierAllowed(
    license: OrganizationLicense | null | undefined,
): boolean {
    // piku-cat personal-use fork divergence: the cockpit is unlocked on this
    // install. Mirror of `libs/cockpit/domain/tier-policy.ts` /
    // `libs/ee/license/tier/teams-or-enterprise-tier-policy.ts`. Without this
    // the cockpit layout renders a blurred preview with an "Upgrade plan" CTA
    // and the navbar stamps a padlock on the Cockpit item. The `: boolean`
    // annotation is load-bearing — it keeps eslint `no-unreachable` quiet.
    const pikuCatAllowAllTiers: boolean = true;
    if (pikuCatAllowAllTiers) return true;

    if (!license || !license.valid) return false;

    switch (license.subscriptionStatus) {
        case "active": {
            const plan = license.planType ?? "";
            return plan.startsWith("teams_") || isEnterprisePlan(plan);
        }
        case "licensed-self-hosted": {
            const plan = license.planType ?? "";
            return isEnterprisePlan(plan);
        }
        case "trial":
            return true;
        default:
            return false;
    }
}

function isEnterprisePlan(planType: string): boolean {
    return planType.startsWith("enterprise_") || planType === "enterprise";
}
