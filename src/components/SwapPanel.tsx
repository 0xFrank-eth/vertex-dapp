"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { getAppKit, createAdapter, KIT_KEY, INITIAL_TX_STATE, type TxState } from "@/lib/appkit";
import { TransactionStatus } from "./TransactionStatus";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const TOKENS = ["USDC", "EURC"];

export function SwapPanel() {
  const { isConnected } = useAccount();
  const [tokenIn,  setTokenIn]  = useState("USDC");
  const [tokenOut, setTokenOut] = useState("EURC");
  const [amountIn, setAmountIn] = useState("");
  const [estimated, setEstimated] = useState<string | null>(null);
  const [estimating, setEstimating] = useState(false);
  const [tx, setTx] = useState<TxState>(INITIAL_TX_STATE);

  const busy = tx.status !== "idle" && tx.status !== "success" && tx.status !== "error";

  function flip() {
    setTokenIn(tokenOut);
    setTokenOut(tokenIn);
    setEstimated(null);
  }

  async function estimate() {
    if (!amountIn || +amountIn <= 0) return;
    setEstimating(true);
    try {
      const adapter = await createAdapter();
      const est = await getAppKit().estimateSwap({
        from: { adapter, chain: "Arc_Testnet" },
        tokenIn:  tokenIn  as "USDC" | "EURC",
        tokenOut: tokenOut as "USDC" | "EURC",
        amountIn,
        config: { kitKey: KIT_KEY, slippageBps: 300 },
      });
      setEstimated(est.estimatedOutput?.amount ?? null);
    } catch {
      setEstimated(null);
    } finally {
      setEstimating(false);
    }
  }

  async function submit() {
    if (!amountIn) return;
    try {
      setTx({ status: "estimating", message: "Getting quote…" });
      const adapter = await createAdapter();
      setTx({ status: "pending", message: "Confirm in your wallet…" });

      const result = await getAppKit().swap({
        from: { adapter, chain: "Arc_Testnet" },
        tokenIn:  tokenIn  as "USDC" | "EURC",
        tokenOut: tokenOut as "USDC" | "EURC",
        amountIn,
        config: { kitKey: KIT_KEY, slippageBps: 300 },
      });

      setTx({
        status: "success",
        message: `Swapped ${amountIn} ${tokenIn} → ${tokenOut}`,
        txHash: result.txHash,
        explorerUrl: result.explorerUrl,
      });
      setAmountIn("");
      setEstimated(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setTx({ status: "error", message: "Swap failed", error: msg.slice(0, 150) });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-arc-muted">
        Same-chain token swaps on{" "}
        <span className="text-arc-green">Arc Testnet</span>
        {!KIT_KEY && (
          <span className="text-arc-warning ml-1">
            · Set NEXT_PUBLIC_KIT_KEY for swap quotes
          </span>
        )}
      </p>

      {/* Pay */}
      <div>
        <label className="text-xs text-arc-muted mb-1.5 block">You pay</label>
        <div className="relative">
          <input
            type="number" value={amountIn}
            onChange={e => { setAmountIn(e.target.value); setEstimated(null); }}
            onBlur={estimate}
            placeholder="0.00" min="0" step="0.01" disabled={busy}
            className="arc-input pr-24 text-xl font-semibold font-mono"
          />
          <select value={tokenIn}
            onChange={e => { setTokenIn(e.target.value); setEstimated(null); }}
            disabled={busy}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-arc-card border border-arc-border text-arc-green text-sm font-semibold rounded-md px-2 py-1 cursor-pointer">
            {TOKENS.map(t => <option key={t} value={t} style={{ background: "#141414" }}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Flip */}
      <div className="flex justify-center">
        <button onClick={flip} disabled={busy} className="btn-ghost px-5">↕ Flip</button>
      </div>

      {/* Receive */}
      <div>
        <label className="text-xs text-arc-muted mb-1.5 block">You receive</label>
        <div className="relative">
          <input readOnly
            value={estimating ? "Estimating…" : estimated ? `~${(+estimated).toFixed(4)}` : ""}
            placeholder="0.00"
            className="arc-input pr-24 text-xl font-semibold font-mono text-arc-green"
          />
          <select value={tokenOut}
            onChange={e => { setTokenOut(e.target.value); setEstimated(null); }}
            disabled={busy}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-arc-card border border-arc-border text-arc-green text-sm font-semibold rounded-md px-2 py-1 cursor-pointer">
            {TOKENS.map(t => <option key={t} value={t} style={{ background: "#141414" }}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Quick amounts */}
      <div className="flex gap-1.5">
        {["1","5","10","50"].map(v => (
          <button key={v} onClick={() => { setAmountIn(v); setEstimated(null); }} disabled={busy}
            className="flex-1 py-1.5 text-xs text-arc-muted border border-arc-border rounded-md hover:border-arc-green hover:text-arc-green transition-colors disabled:opacity-40">
            {v}
          </button>
        ))}
      </div>

      {amountIn && +amountIn > 0 && (
        <div className="rounded-lg border border-arc-border bg-arc-surface p-3 text-xs flex flex-col gap-1.5 animate-fade-in">
          <div className="flex justify-between">
            <span className="text-arc-muted">Slippage</span>
            <span className="text-arc-white">0.3%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-arc-muted">Network</span>
            <span className="text-arc-green">Arc Testnet</span>
          </div>
        </div>
      )}

      <TransactionStatus tx={tx} onClose={() => setTx(INITIAL_TX_STATE)} />

      {!isConnected ? (
        <ConnectButton label="Connect Wallet" />
      ) : (
        <button onClick={submit}
          disabled={busy || !amountIn || +amountIn <= 0 || tokenIn === tokenOut}
          className="btn-primary">
          {busy ? "Swapping…" : `Swap ${tokenIn} → ${tokenOut}`}
        </button>
      )}
    </div>
  );
}
