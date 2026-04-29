"use client";

import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { useArcBalances } from "@/hooks/useArcBalances";
import { useUnifiedBalance } from "@/hooks/useUnifiedBalance";
import { arcTestnet } from "@/config/chains";

const TOKENS = [
  { symbol: "USDC", color: "text-arc-green" },
  { symbol: "EURC", color: "text-arc-white" },
  { symbol: "USYC", color: "text-arc-muted" },
];

export function BalanceCard() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { usdcBalance, eurcBalance, usycBalance, refetch } = useArcBalances();
  const { balance: unified, fetch: fetchUnified } = useUnifiedBalance();

  function refetchAll() { refetch(); fetchUnified(); }

  const balances: Record<string, string> = {
    USDC: usdcBalance,
    EURC: eurcBalance,
    USYC: usycBalance,
  };

  const onArc = chainId === arcTestnet.id;

  return (
    <div className="card p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-arc-white">Balances</span>
        {isConnected && (
          <button onClick={refetchAll} className="text-arc-muted hover:text-arc-green transition-colors text-xs">
            ↻ Refresh
          </button>
        )}
      </div>

      {!isConnected ? (
        <p className="text-xs text-arc-muted text-center py-4">
          Connect wallet to view balances
        </p>
      ) : !onArc ? (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-arc-muted text-center">Switch to Arc Testnet</p>
          <button onClick={() => switchChain({ chainId: arcTestnet.id })}
            className="btn-primary py-2 text-xs">
            Switch Network
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {unified && (
            <div className="flex items-center justify-between py-2 border-b border-arc-border">
              <span className="text-xs text-arc-muted font-mono">USDC (Unified)</span>
              <span className="text-sm font-semibold font-mono text-arc-green">
                {parseFloat(unified.totalConfirmed).toFixed(4)}
              </span>
            </div>
          )}
          {TOKENS.map(t => (
            <div key={t.symbol} className="flex items-center justify-between py-2 border-b border-arc-border last:border-0">
              <span className="text-xs text-arc-muted font-mono">{t.symbol}</span>
              <span className={`text-sm font-semibold font-mono ${t.color}`}>
                {balances[t.symbol]}
              </span>
            </div>
          ))}
        </div>
      )}

      {isConnected && address && (
        <div className="pt-1 border-t border-arc-border">
          <p className="text-xs text-arc-muted mb-1">Address</p>
          <a href={`https://testnet.arcscan.app/address/${address}`} target="_blank" rel="noopener noreferrer"
            className="text-xs font-mono text-arc-green hover:underline break-all">
            {address.slice(0,10)}…{address.slice(-8)}
          </a>
        </div>
      )}

      <a href="https://faucet.circle.com/" target="_blank" rel="noopener noreferrer"
        className="text-center text-xs text-arc-muted border border-arc-border rounded-lg py-2 hover:border-arc-green hover:text-arc-green transition-colors">
        Get Testnet Tokens →
      </a>
    </div>
  );
}
