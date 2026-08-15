import { isCockpitTierAllowed } from "./tier-policy";

import type { OrganizationLicense } from "../../subscription/_services/billing/types";

// Mirrors test/unit/cockpit/tier-policy.spec.ts. Kept here too because
// the navbar reads this helper directly — a regression in the gate would
// re-introduce the customer-reported "Cockpit icon missing on Enterprise
// self-hosted" bug. The two files MUST stay in sync.

const teamsPlans = [
    "teams_byok",
    "teams_byok_annual",
    "teams_managed",
    "teams_managed_annual",
    "teams_managed_legacy",
] as const;

const enterprisePlans = [
    "enterprise_byok",
    "enterprise_byok_annual",
    "enterprise_managed",
    "enterprise_managed_annual",
    "enterprise",
] as const;

describe("isCockpitTierAllowed (web mirror)", () => {
    it("cloud active + Teams → allowed", () => {
        for (const plan of teamsPlans) {
            expect(
                isCockpitTierAllowed({
                    valid: true,
                    subscriptionStatus: "active",
                    numberOfLicenses: 5,
                    planType: plan,
                } satisfies OrganizationLicense),
            ).toBe(true);
        }
    });

    it("cloud active + Enterprise → allowed", () => {
        for (const plan of enterprisePlans) {
            expect(
                isCockpitTierAllowed({
                    valid: true,
                    subscriptionStatus: "active",
                    numberOfLicenses: 5,
                    planType: plan,
                } satisfies OrganizationLicense),
            ).toBe(true);
        }
    });

    // piku-cat personal-use fork divergence: upstream blocks free_byok. This
    // fork unlocks the cockpit for every tier — see ./tier-policy.ts.
    it("piku-cat fork: cloud active + free_byok → unlocked", () => {
        expect(
            isCockpitTierAllowed({
                valid: true,
                subscriptionStatus: "active",
                numberOfLicenses: 0,
                planType: "free_byok",
            } satisfies OrganizationLicense),
        ).toBe(true);
    });

    it("licensed self-hosted + Enterprise → allowed (Dmitry case)", () => {
        for (const plan of enterprisePlans) {
            expect(
                isCockpitTierAllowed({
                    valid: true,
                    subscriptionStatus: "licensed-self-hosted",
                    planType: plan,
                    numberOfLicenses: 50,
                } satisfies OrganizationLicense),
            ).toBe(true);
        }
    });

    // piku-cat personal-use fork divergence: Teams-on-self-hosted is unlocked.
    it("piku-cat fork: licensed self-hosted + Teams → unlocked", () => {
        for (const plan of teamsPlans) {
            expect(
                isCockpitTierAllowed({
                    valid: true,
                    subscriptionStatus: "licensed-self-hosted",
                    planType: plan,
                    numberOfLicenses: 50,
                } satisfies OrganizationLicense),
            ).toBe(true);
        }
    });

    // piku-cat personal-use fork divergence: unlicensed (CE) self-hosted gets
    // the cockpit — that is the whole point of the fork.
    it("piku-cat fork: unlicensed self-hosted → unlocked", () => {
        expect(
            isCockpitTierAllowed({
                valid: true,
                subscriptionStatus: "self-hosted",
            } satisfies OrganizationLicense),
        ).toBe(true);
    });

    it("trial → allowed", () => {
        expect(
            isCockpitTierAllowed({
                valid: true,
                subscriptionStatus: "trial",
                trialEnd: "2026-12-31",
            } satisfies OrganizationLicense),
        ).toBe(true);
    });

    // piku-cat personal-use fork divergence: a lapsed/invalid license no longer
    // blocks — the fork unlocks before the license is inspected.
    it("piku-cat fork: invalid / expired / canceled → unlocked", () => {
        for (const status of [
            "payment_failed",
            "canceled",
            "expired",
            "inactive",
        ] as const) {
            expect(
                isCockpitTierAllowed({
                    valid: false,
                    subscriptionStatus: status,
                    numberOfLicenses: 0,
                } satisfies OrganizationLicense),
            ).toBe(true);
        }
    });

    // piku-cat personal-use fork divergence: null/undefined no longer blocks.
    it("piku-cat fork: null / undefined → unlocked", () => {
        expect(isCockpitTierAllowed(null)).toBe(true);
        expect(isCockpitTierAllowed(undefined)).toBe(true);
    });
});
