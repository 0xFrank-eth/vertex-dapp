"use client";

import { useState, useCallback } from "react";
import { useAccount } from "wagmi";
import { getUnifiedBalanceKit, TESTNET_CHAINS } from "@/lib/unifiedBalance";

export interface ChainBalance {
  chain: string;
  confirmedBalance: string;
}

export interface UnifiedBalance {
  totalConfirmed: string;
  breakdown: ChainBalance[];
}

export function useUnifiedBalance() {
  const { address } = useAccount();
  const [balance, setBalance] = useState<UnifiedBalance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    setError(null);
    try {
      const kit = getUnifiedBalanceKit();
      const result = await kit.getBalances({
        token: "USDC",
        sources: {
          address,
          chains: [...TESTNET_CHAINS],
        },
        networkType: "testnet",
      });

      const entry = result.breakdown?.[0];
      setBalance({
        totalConfirmed: result.totalConfirmedBalance ?? "0.0000",
        breakdown: (entry?.breakdown ?? []).map((b) => ({
          chain: String(b.chain),
          confirmedBalance: b.confirmedBalance,
        })),
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Balance fetch failed");
    } finally {
      setLoading(false);
    }
  }, [address]);

  return { balance, loading, error, fetch };
}
