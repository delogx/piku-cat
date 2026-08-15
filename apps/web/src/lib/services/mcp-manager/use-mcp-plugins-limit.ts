"use client";

import { useMemo } from "react";
import { useSubscriptionStatus } from "src/features/ee/subscription/_hooks/use-subscription-status";

// Upstream free/CE cap on simultaneously-running MCP plugins.
// piku-cat personal-use fork divergence: no longer enforced — kept only so the
// export (and its upstream meaning) survives a future rebase. The backend
// mirror in libs/mcp-server/services/mcp-manager.service.ts is also unlimited.
export const MCP_PLUGINS_FREE_LIMIT = 3;

export const useMCPPluginsLimit = (installedCount: number) => {
    const subscription = useSubscriptionStatus();

    return useMemo(() => {
        const total = installedCount;

        if (!subscription.valid)
            return {
                total,
                canInstallMore: false,
                limit: Number.POSITIVE_INFINITY,
                limited: false,
                plan: subscription.status,
            };

        // piku-cat personal-use fork divergence: no free/CE cap on MCP plugins.
        // Upstream capped `free` and `self-hosted` at MCP_PLUGINS_FREE_LIMIT (3)
        // here — `self-hosted` was listed explicitly, so this fork hit it
        // unconditionally ("3 of 3 used" in the plugins grid, install button
        // swapped for a limit popover). Removing the branch falls through to the
        // unlimited return below. Mirrors the backend change in
        // libs/mcp-server/services/mcp-manager.service.ts.

        return {
            total,
            canInstallMore: true,
            limit: Number.POSITIVE_INFINITY,
            limited: false,
            plan: subscription.status,
        };
    }, [subscription, installedCount]);
};
