import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arcTestnet, SUPPORTED_CHAINS } from "./chains";
import { sepolia } from "wagmi/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "Arc DApp",
  projectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "arc-dapp-dev",
  chains: SUPPORTED_CHAINS,
  ssr: true,
});

export { arcTestnet, sepolia };
