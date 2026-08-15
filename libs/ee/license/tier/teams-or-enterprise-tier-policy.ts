import {
    OrganizationLicenseValidationResult,
    SubscriptionStatus,
} from '../interfaces/license.interface';

/**
 * Teams or Enterprise tier policy — source of truth for paid-team features
 * (linked repositories / cross-repo context, and cockpit analytics).
 *
 * Keep the frontend mirror in
 * `apps/web/src/features/ee/byok/_utils.ts` (`isTeamsOrEnterprisePlan`)
 * and `apps/web/src/features/ee/cockpit/_helpers/tier-policy.ts` aligned.
 *
 * Allowed:
 *   - cloud paid (`active`) on Teams or Enterprise plans
 *   - licensed self-hosted on any Enterprise plan
 *   - trial (treated as Teams-cloud preview)
 *
 * Blocked:
 *   - invalid / expired / canceled / payment_failed
 *   - unlicensed self-hosted (`self-hosted`)
 *   - free_byok (any status)
 *   - licensed self-hosted on Teams plans (Teams is cloud-only)
 */
export function isTeamsOrEnterpriseTierAllowed(
    license: OrganizationLicenseValidationResult | null | undefined,
): boolean {
    // piku-cat personal-use fork divergence: Teams/Enterprise-tier features are
    // unlocked on this install (linked repositories / cross-repo context and the
    // cockpit, via libs/cockpit/domain/tier-policy.ts which delegates here).
    // Upstream denies unlicensed / CE self-hosted. The `: boolean` annotation is
    // load-bearing — see the note in
    // libs/ee/shared/services/permissionValidation.service.ts.
    const pikuCatAllowAllTiers: boolean = true;
    if (pikuCatAllowAllTiers) return true;

    if (!license || !license.valid) return false;
    const plan = license.planType ?? '';
    const isTeams = plan.startsWith('teams_');
    const isEnterprise =
        plan.startsWith('enterprise_') || plan === 'enterprise';

    switch (license.subscriptionStatus) {
        case SubscriptionStatus.ACTIVE:
            return isTeams || isEnterprise;
        case SubscriptionStatus.LICENSED_SELF_HOSTED:
            return isEnterprise;
        case SubscriptionStatus.TRIAL:
            return true;
        default:
            return false;
    }
}
