"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { arcTestnet } from "@/config/chains";
import { VertexLogo } from "./VertexLogo";

export function Header() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const wrongNetwork = isConnected && chainId !== arcTestnet.id;

  return (
    <header className="sticky top-0 z-50 border-b border-arc-border bg-arc-bg/95 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <VertexLogo size={28} />
          <span className="font-bold text-arc-white tracking-tight text-base">Vertex</span>
          <span className="text-xs text-arc-muted border border-arc-border rounded px-1.5 py-0.5">
            Testnet
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {wrongNetwork && (
            <button
              onClick={() => switchChain({ chainId: arcTestnet.id })}
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-arc-warning border border-arc-warning/30 bg-arc-warning/5 rounded-md px-3 py-1.5 hover:bg-arc-warning/10 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-arc-warning" />
              Switch to Vertex
            </button>
          )}
          <ConnectButton
            label="Connect Wallet"
            showBalance={false}
            chainStatus="none"
            accountStatus="address"
          />
        </div>
      </div>
    </header>
  );
}
