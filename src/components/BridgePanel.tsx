"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { getAppKit, createAdapter, INITIAL_TX_STATE, type TxState } from "@/lib/appkit";
import { TransactionStatus } from "./TransactionStatus";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { BridgeResult } from "@circle-fin/app-kit";

const CHAINS = [
  { id: "Arc_Testnet",       label: "Arc Testnet",       short: "Arc"      },
  { id: "Ethereum_Sepolia",  label: "Ethereum Sepolia",  short: "Sepolia"  },
  { id: "Base_Sepolia",      label: "Base Sepolia",      short: "Base"     },
  { id: "Optimism_Sepolia",  label: "Optimism Sepolia",  short: "OP"       },
  { id: "Arbitrum_Sepolia",  label: "Arbitrum Sepolia",  short: "Arb"      },
];

type BridgeChainId =
  | "Arc_Testnet"
  | "Ethereum_Sepolia"
  | "Base_Sepolia"
  | "Optimism_Sepolia"
  | "Arbitrum_Sepolia";

export function BridgePanel() {
  const { isConnected } = useAccount();
  const [from, setFrom] = useState<BridgeChainId>("Ethereum_Sepolia");
  const [to, setTo]     = useState<BridgeChainId>("Arc_Testnet");
  const [amount, setAmount] = useState("");
  const [tx, setTx] = useState<TxState>(INITIAL_TX_STATE);

  const busy = tx.status !== "idle" && tx.status !== "success" && tx.status !== "error";

  function flip() { setFrom(to); setTo(from); }

  async function submit() {
    if (!amount) return;
    const kit = getAppKit();

    const onApprove     = () => setTx({ status: "approving",  message: "Approving USDC transfer…" });
    const onBurn        = () => setTx({ status: "processing", message: "Burning on source chain…" });
    const onAttestation = () => setTx({ status: "processing", message: "Waiting for Circle attestation…" });
    const onMint        = () => setTx({ status: "processing", message: "Minting on destination chain…" });

    kit.on("bridge.approve",          onApprove);
    kit.on("bridge.burn",             onBurn);
    kit.on("bridge.fetchAttestation", onAttestation);
    kit.on("bridge.mint",             onMint);

    try {
      setTx({ status: "pending", message: "Confirm in your wallet…" });

      const adapter = await createAdapter();

      const result: BridgeResult = await kit.bridge({
        from: { adapter, chain: from },
        to:   { adapter, chain: to   },
        amount,
      });

      const last = result.steps?.[result.steps.length - 1];
      setTx({
        status: "success",
        message: `Bridged ${amount} USDC successfully`,
        txHash: last?.txHash,
        explorerUrl: last?.explorerUrl,
      });
      setAmount("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setTx({ status: "error", message: "Bridge failed", error: msg.slice(0, 150) });
    } finally {
      kit.off("bridge.approve",          onApprove);
      kit.off("bridge.burn",             onBurn);
      kit.off("bridge.fetchAttestation", onAttestation);
      kit.off("bridge.mint",             onMint);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-arc-muted">
        Cross-chain USDC transfers via{" "}
        <span className="text-arc-green">Circle CCTP v2</span>
      </p>

      {/* From / To */}
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <label className="text-xs text-arc-muted mb-1.5 block">From</label>
          <select value={from} onChange={e => setFrom(e.target.value)} disabled={busy} className="arc-input text-sm">
            {CHAINS.map(c => <option key={c.id} value={c.id} style={{ background: "#0f0f0f" }}>{c.label}</option>)}
          </select>
        </div>
        <button onClick={flip} disabled={busy} className="btn-ghost flex-shrink-0 px-3 py-2.5 mb-0">⇄</button>
        <div className="flex-1">
          <label className="text-xs text-arc-muted mb-1.5 block">To</label>
          <select value={to} onChange={e => setTo(e.target.value)} disabled={busy} className="arc-input text-sm">
            {CHAINS.map(c => <option key={c.id} value={c.id} style={{ background: "#0f0f0f" }}>{c.label}</option>)}
          </select>
        </div>
      </div>

      {/* Amount */}
      <div>
        <label className="text-xs text-arc-muted mb-1.5 flex justify-between">
          <span>Amount</span>
          <span className="text-arc-green">USDC</span>
        </label>
        <div className="relative">
          <input
            type="number" value={amount} onChange={e => setAmount(e.target.value)}
            placeholder="0.00" min="0" step="0.01" disabled={busy}
            className="arc-input pr-16 text-xl font-semibold font-mono"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 token-tag">USDC</span>
        </div>
        <div className="flex gap-1.5 mt-2">
          {["1","5","10","50"].map(v => (
            <button key={v} onClick={() => setAmount(v)} disabled={busy}
              className="flex-1 py-1.5 text-xs text-arc-muted border border-arc-border rounded-md hover:border-arc-green hover:text-arc-green transition-colors disabled:opacity-40">
              ${v}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      {amount && +amount > 0 && (
        <div className="rounded-lg border border-arc-border bg-arc-surface p-3 text-xs flex flex-col gap-1.5 animate-fade-in">
          <Row label="Route"    value={`${CHAINS.find(c=>c.id===from)?.label} → ${CHAINS.find(c=>c.id===to)?.label}`} />
          <Row label="Protocol" value="Circle CCTP v2" green />
          <Row label="Receive"  value={`~${amount} USDC`} green />
        </div>
      )}

      <TransactionStatus tx={tx} onClose={() => setTx(INITIAL_TX_STATE)} />

      {!isConnected ? (
        <ConnectButton label="Connect Wallet" />
      ) : (
        <button onClick={submit} disabled={busy || !amount || +amount <= 0} className="btn-primary">
          {busy ? "Bridging…" : `Bridge ${amount ? amount + " " : ""}USDC`}
        </button>
      )}
    </div>
  );
}

function Row({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-arc-muted">{label}</span>
      <span className={`font-medium ${green ? "text-arc-green" : "text-arc-white"}`}>{value}</span>
    </div>
  );
}
