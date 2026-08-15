import { isCockpitTierAllowed } from '@libs/cockpit/domain/tier-policy';
import { SubscriptionStatus } from '@libs/ee/license/interfaces/license.interface';

/**
 * Authoritative access rule for the cockpit (both UI shell and HTTP
 * endpoints). The matrix below locks the intent documented in the PR:
 *
 *   - Cloud paid: Teams + Enterprise allowed, Free BYOK blocked.
 *   - Licensed self-hosted: Enterprise-only (Teams is cloud-only).
 *   - Unlicensed self-hosted: never.
 *   - Trial: always (treated as Teams-cloud equivalent).
 *   - Invalid / expired / canceled: never.
 */

const planVariants = {
    teams: [
        'teams_byok',
        'teams_byok_annual',
        'teams_managed',
        'teams_managed_annual',
        'teams_managed_legacy',
    ],
    enterprise: [
        'enterprise_byok',
        'enterprise_byok_annual',
        'enterprise_managed',
        'enterprise_managed_annual',
        'enterprise',
    ],
} as const;

describe('isCockpitTierAllowed', () => {
    it('allows all active paid Teams plans on cloud', () => {
        for (const plan of planVariants.teams) {
            expect(
                isCockpitTierAllowed({
                    valid: true,
                    subscriptionStatus: SubscriptionStatus.ACTIVE,
                    planType: plan,
                }),
            ).toBe(true);
        }
    });

    it('allows all active paid Enterprise plans on cloud', () => {
        for (const plan of planVariants.enterprise) {
            expect(
                isCockpitTierAllowed({
                    valid: true,
                    subscriptionStatus: SubscriptionStatus.ACTIVE,
                    planType: plan,
                }),
            ).toBe(true);
        }
    });

    // piku-cat personal-use fork divergence: isCockpitTierAllowed delegates to
    // isTeamsOrEnterpriseTierAllowed, which this fork unlocks unconditionally —
    // see libs/ee/license/tier/teams-or-enterprise-tier-policy.ts.
    it('piku-cat fork: free_byok on active cloud is unlocked', () => {
        expect(
            isCockpitTierAllowed({
                valid: true,
                subscriptionStatus: SubscriptionStatus.ACTIVE,
                planType: 'free_byok',
            }),
        ).toBe(true);
    });

    it('allows Enterprise plans on licensed self-hosted', () => {
        for (const plan of planVariants.enterprise) {
            expect(
                isCockpitTierAllowed({
                    valid: true,
                    subscriptionStatus: SubscriptionStatus.LICENSED_SELF_HOSTED,
                    planType: plan,
                }),
            ).toBe(true);
        }
    });

    // piku-cat personal-use fork divergence: Teams-on-self-hosted is unlocked.
    it('piku-cat fork: Teams plans on licensed self-hosted are unlocked', () => {
        for (const plan of planVariants.teams) {
            expect(
                isCockpitTierAllowed({
                    valid: true,
                    subscriptionStatus: SubscriptionStatus.LICENSED_SELF_HOSTED,
                    planType: plan,
                }),
            ).toBe(true);
        }
    });

    // piku-cat personal-use fork divergence: unlicensed (CE) self-hosted gets
    // the cockpit.
    it('piku-cat fork: unlicensed self-hosted is unlocked', () => {
        expect(
            isCockpitTierAllowed({
                valid: true,
                subscriptionStatus: SubscriptionStatus.SELF_HOSTED,
            }),
        ).toBe(true);
    });

    it('allows trial as Teams-cloud equivalent (plan optional)', () => {
        expect(
            isCockpitTierAllowed({
                valid: true,
                subscriptionStatus: SubscriptionStatus.TRIAL,
            }),
        ).toBe(true);
    });

    // piku-cat personal-use fork divergence: a lapsed license no longer blocks
    // the cockpit — the fork unlocks before the license is inspected.
    it.each([
        SubscriptionStatus.PAYMENT_FAILED,
        SubscriptionStatus.CANCELED,
        SubscriptionStatus.EXPIRED,
    ])('piku-cat fork: status %s is unlocked regardless of plan', (status) => {
        expect(
            isCockpitTierAllowed({
                valid: false,
                subscriptionStatus: status,
                planType: 'enterprise_managed',
            }),
        ).toBe(true);
    });

    // piku-cat personal-use fork divergence: null/undefined no longer blocks.
    it('piku-cat fork: null / undefined licenses are unlocked', () => {
        expect(isCockpitTierAllowed(null)).toBe(true);
        expect(isCockpitTierAllowed(undefined)).toBe(true);
    });

    // piku-cat personal-use fork divergence: a missing planType no longer
    // blocks. (Case not listed in the review's blocker set — caught here.)
    it('piku-cat fork: active with missing planType is unlocked', () => {
        expect(
            isCockpitTierAllowed({
                valid: true,
                subscriptionStatus: SubscriptionStatus.ACTIVE,
            }),
        ).toBe(true);
    });
});
