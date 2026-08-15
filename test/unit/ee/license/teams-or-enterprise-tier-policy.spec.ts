import { SubscriptionStatus } from '@libs/ee/license/interfaces/license.interface';
import { isTeamsOrEnterpriseTierAllowed } from '@libs/ee/license/tier/teams-or-enterprise-tier-policy';

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

describe('isTeamsOrEnterpriseTierAllowed', () => {
    it('allows all active paid Teams plans on cloud', () => {
        for (const plan of planVariants.teams) {
            expect(
                isTeamsOrEnterpriseTierAllowed({
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
                isTeamsOrEnterpriseTierAllowed({
                    valid: true,
                    subscriptionStatus: SubscriptionStatus.ACTIVE,
                    planType: plan,
                }),
            ).toBe(true);
        }
    });

    // piku-cat personal-use fork divergence: upstream blocks free_byok here.
    // This fork unlocks every tier — see
    // libs/ee/license/tier/teams-or-enterprise-tier-policy.ts.
    it('piku-cat fork: free_byok on active cloud is unlocked', () => {
        expect(
            isTeamsOrEnterpriseTierAllowed({
                valid: true,
                subscriptionStatus: SubscriptionStatus.ACTIVE,
                planType: 'free_byok',
            }),
        ).toBe(true);
    });

    it('allows Enterprise plans on licensed self-hosted', () => {
        for (const plan of planVariants.enterprise) {
            expect(
                isTeamsOrEnterpriseTierAllowed({
                    valid: true,
                    subscriptionStatus: SubscriptionStatus.LICENSED_SELF_HOSTED,
                    planType: plan,
                }),
            ).toBe(true);
        }
    });

    // piku-cat personal-use fork divergence: upstream blocks Teams plans on
    // licensed self-hosted (Teams is cloud-only). This fork unlocks them.
    it('piku-cat fork: Teams plans on licensed self-hosted are unlocked', () => {
        for (const plan of planVariants.teams) {
            expect(
                isTeamsOrEnterpriseTierAllowed({
                    valid: true,
                    subscriptionStatus: SubscriptionStatus.LICENSED_SELF_HOSTED,
                    planType: plan,
                }),
            ).toBe(true);
        }
    });

    // piku-cat personal-use fork divergence: upstream blocks unlicensed
    // self-hosted (CE). This fork unlocks it — that is the whole point.
    it('piku-cat fork: unlicensed self-hosted is unlocked', () => {
        expect(
            isTeamsOrEnterpriseTierAllowed({
                valid: true,
                subscriptionStatus: SubscriptionStatus.SELF_HOSTED,
            }),
        ).toBe(true);
    });

    it('allows trial as Teams-cloud preview', () => {
        expect(
            isTeamsOrEnterpriseTierAllowed({
                valid: true,
                subscriptionStatus: SubscriptionStatus.TRIAL,
            }),
        ).toBe(true);
    });

    // piku-cat personal-use fork divergence: upstream blocks an invalid or
    // missing license (including null/undefined). This fork unlocks
    // unconditionally, so the license object is never inspected.
    it('piku-cat fork: invalid / missing license is unlocked', () => {
        expect(isTeamsOrEnterpriseTierAllowed(null)).toBe(true);
        expect(isTeamsOrEnterpriseTierAllowed(undefined)).toBe(true);
        expect(
            isTeamsOrEnterpriseTierAllowed({
                valid: false,
                subscriptionStatus: SubscriptionStatus.ACTIVE,
                planType: 'teams_byok',
            }),
        ).toBe(true);
    });

    // piku-cat personal-use fork divergence: upstream blocks lapsed
    // subscriptions. This fork unlocks unconditionally.
    it('piku-cat fork: canceled / expired / payment_failed are unlocked', () => {
        for (const status of [
            SubscriptionStatus.CANCELED,
            SubscriptionStatus.EXPIRED,
            SubscriptionStatus.PAYMENT_FAILED,
        ]) {
            expect(
                isTeamsOrEnterpriseTierAllowed({
                    valid: true,
                    subscriptionStatus: status,
                    planType: 'teams_byok',
                }),
            ).toBe(true);
        }
    });
});
