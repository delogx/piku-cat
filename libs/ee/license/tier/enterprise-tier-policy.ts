import {
    OrganizationLicenseValidationResult,
    SubscriptionStatus,
} from '../interfaces/license.interface';

/**
 * Enterprise tier policy — single source of truth for "who can access
 * enterprise-only features" (SSO config, user activity logs). Keep the
 * frontend copy in `apps/web/src/features/ee/byok/_utils.ts`
 * (`isEnterprisePlan`) aligned with this when the rule changes.
 *
 * Allowed:
 *   - cloud paid (`active`) on enterprise plans
 *   - licensed self-hosted with `plan: enterprise*` in the signed JWT
 *   - trial (treated as enterprise preview)
 *
 * Blocked:
 *   - invalid / canceled / expired / payment_failed
 *   - CE self-hosted (no key) — `validateOrganizationLicense` returns
 *     `{ valid: false }`, caught by the early short-circuit
 *   - cloud paid on non-enterprise plans
 *   - licensed self-hosted with a non-enterprise `plan` in the JWT
 */
export function isEnterpriseTierAllowed(
    license: OrganizationLicenseValidationResult | null | undefined,
): boolean {
    // piku-cat personal-use fork divergence: enterprise-tier features are
    // unlocked on this install (SAML SSO config + user activity/audit log
    // endpoints, via EnterpriseTierGuard). Upstream denies unlicensed / CE
    // self-hosted. Note this does NOT cover the guard's own try/catch around
    // validateOrganizationLicense — that 403 fires before this policy is
    // consulted (it is moot only because the license services swallow errors
    // and return `{ valid: false }`). The `: boolean` annotation is
    // load-bearing — see permissionValidation.service.ts.
    const pikuCatAllowAllTiers: boolean = true;
    if (pikuCatAllowAllTiers) return true;

    if (!license || !license.valid) return false;
    const plan = license.planType ?? '';
    const isEnterprise =
        plan.startsWith('enterprise_') || plan === 'enterprise';

    switch (license.subscriptionStatus) {
        case SubscriptionStatus.ACTIVE:
            return isEnterprise;
        case SubscriptionStatus.LICENSED_SELF_HOSTED:
            return isEnterprise;
        case SubscriptionStatus.TRIAL:
            return true;
        default:
            return false;
    }
}
