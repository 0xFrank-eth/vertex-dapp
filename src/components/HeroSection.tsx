"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function HeroSection() {
  const { isConnected } = useAccount();

  return (
    <div className="max-w-5xl mx-auto px-5 pt-12 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <p className="text-xs font-mono text-arc-green mb-2 tracking-widest uppercase">
            Vertex · Testnet
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-arc-white leading-tight">
            Programmable Money
            <br />
            <span className="text-arc-green">Infrastructure</span>
          </h1>
          <p className="mt-3 text-sm text-arc-muted max-w-md leading-relaxed">
            Bridge, swap, and send stablecoins on Vertex — a Layer 1 blockchain
            built for USDC-native transactions with sub-second finality.
          </p>
        </div>

        {!isConnected && (
          <div className="flex-shrink-0">
            <ConnectButton label="Connect Wallet" />
          </div>
        )}
      </div>
    </div>
  );
}
