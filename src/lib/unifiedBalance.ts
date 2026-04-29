import { UnifiedBalanceKit } from "@circle-fin/unified-balance-kit";

let kitInstance: UnifiedBalanceKit | null = null;

export function getUnifiedBalanceKit(): UnifiedBalanceKit {
  if (!kitInstance) {
    kitInstance = new UnifiedBalanceKit();
  }
  return kitInstance;
}

export const TESTNET_CHAINS = [
  "Arc_Testnet",
  "Base_Sepolia",
  "Arbitrum_Sepolia",
  "Optimism_Sepolia",
  "Ethereum_Sepolia",
] as const;

export type TestnetChain = (typeof TESTNET_CHAINS)[number];

export const CHAIN_LABELS: Record<TestnetChain, string> = {
  Arc_Testnet:       "Arc Testnet",
  Base_Sepolia:      "Base Sepolia",
  Arbitrum_Sepolia:  "Arbitrum Sepolia",
  Optimism_Sepolia:  "Optimism Sepolia",
  Ethereum_Sepolia:  "Ethereum Sepolia",
};
