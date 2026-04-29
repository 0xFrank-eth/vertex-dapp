"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { createAdapter, INITIAL_TX_STATE, type TxState } from "@/lib/appkit";
import { getUnifiedBalanceKit, TESTNET_CHAINS, CHAIN_LABELS, type TestnetChain } from "@/lib/unifiedBalance";
import { useUnifiedBalance } from "@/hooks/useUnifiedBalance";
import { TransactionStatus } from "./TransactionStatus";

type Mode = "deposit" | "spend";

export function UnifiedPanel() {
  const { isConnected, address } = useAccount();
  const [mode, setMode] = useState<Mode>("deposit");

  const [sourceChain, setSourceChain] = useState<TestnetChain>("Base_Sepolia");
  const [destChain, setDestChain]     = useState<TestnetChain>("Arc_Testnet");
  const [amount, setAmount]           = useState("");
  const [recipient, setRecipient]     = useState("");
  const [tx, setTx] = useState<TxState>(INITIAL_TX_STATE);

  const { balance, loading, fetch } = useUnifiedBalance();
  const busy = tx.status !== "idle" && tx.status !== "success" && tx.status !== "error";

  async function handleDeposit() {
    if (!amount) return;
    try {
      setTx({ status: "pending", message: "Confirm in your wallet…" });
      const adapter = await createAdapter();
      const kit = getUnifiedBalanceKit();

      kit.on("*" as never, (p: { tags?: { opName?: string } }) => {
        const op = p?.tags?.opName ?? "";
        if (op.includes("approve"))   setTx({ status: "approving",  message: "Approving USDC…" });
        if (op.includes("deposit"))   setTx({ status: "processing", message: "Depositing to Circle Gateway…" });
      });

      await kit.deposit({
        from: { adapter, chain: sourceChain },
        amount,
        token: "USDC",
      });

      setTx({ status: "success", message: `Deposited ${amount} USDC to Unified Balance` });
      setAmount("");
      fetch();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setTx({ status: "error", message: "Deposit failed", error: msg.slice(0, 150) });
    }
  }

  async function handleSpend() {
    if (!amount) return;
    const to = recipient || address;
    if (!to) return;
    try {
      setTx({ status: "pending", message: "Confirm in your wallet…" });
      const adapter = await createAdapter();
      const kit = getUnifiedBalanceKit();

      kit.on("*" as never, (p: { tags?: { opName?: string } }) => {
        const op = p?.tags?.opName ?? "";
        if (op.includes("sign"))        setTx({ status: "approving",  message: "Signing burn intents…" });
        if (op.includes("attestation")) setTx({ status: "processing", message: "Awaiting Circle attestation…" });
        if (op.includes("mint"))        setTx({ status: "processing", message: "Minting on destination…" });
      });

      await kit.spend({
        from: { adapter },
        to: { chain: destChain, recipientAddress: to, useForwarder: true },
        amount,
        token: "USDC",
      });

      setTx({ status: "success", message: `Spent ${amount} USDC → ${CHAIN_LABELS[destChain]}` });
      setAmount("");
      setRecipient("");
      fetch();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setTx({ status: "error", message: "Spend failed", error: msg.slice(0, 150) });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Unified balance summary */}
      <div className="rounded-lg border border-arc-border bg-arc-surface p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-arc-muted font-semibold">Unified USDC Balance</span>
          <button
            onClick={fetch}
            disabled={!isConnected || loading}
            className="text-xs text-arc-muted hover:text-arc-green transition-colors disabled:opacity-40"
          >
            {loading ? "Loading…" : "↻ Refresh"}
          </button>
        </div>

        {!isConnected ? (
          <p className="text-xs text-arc-muted text-center py-2">Connect wallet to view</p>
        ) : balance ? (
          <>
            <p className="text-2xl font-bold font-mono text-arc-green mb-3">
              {parseFloat(balance.totalConfirmed).toFixed(4)}{" "}
              <span className="text-sm text-arc-muted font-normal">USDC</span>
            </p>
            {balance.breakdown.filter(b => parseFloat(b.confirmedBalance) > 0).length > 0 && (
              <div className="flex flex-col gap-1">
                {balance.breakdown
                  .filter(b => parseFloat(b.confirmedBalance) > 0)
                  .map(b => (
                    <div key={b.chain} className="flex justify-between text-xs">
                      <span className="text-arc-muted">{CHAIN_LABELS[b.chain as TestnetChain] ?? b.chain}</span>
                      <span className="font-mono text-arc-white">{parseFloat(b.confirmedBalance).toFixed(4)}</span>
                    </div>
                  ))}
              </div>
            )}
          </>
        ) : (
          <button
            onClick={fetch}
            disabled={!isConnected}
            className="w-full text-xs text-arc-muted border border-arc-border rounded-md py-2 hover:border-arc-green hover:text-arc-green transition-colors"
          >
            Load balance
          </button>
        )}
      </div>

      {/* Mode toggle */}
      <div className="flex rounded-lg border border-arc-border overflow-hidden">
        {(["deposit", "spend"] as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setTx(INITIAL_TX_STATE); setAmount(""); }}
            className={`flex-1 py-2 text-sm font-semibold transition-colors ${
              mode === m
                ? "bg-arc-green text-black"
                : "text-arc-muted hover:text-arc-white"
            }`}
          >
            {m === "deposit" ? "Deposit" : "Spend"}
          </button>
        ))}
      </div>

      {/* Description */}
      <p className="text-xs text-arc-muted">
        {mode === "deposit"
          ? <>Deposit USDC from any chain into your <span className="text-arc-green">Circle Gateway</span> unified balance.</>
          : <>Spend your unified USDC balance on any supported chain via <span className="text-arc-green">Circle Gateway</span>.</>
        }
      </p>

      {/* Chain selector */}
      {mode === "deposit" ? (
        <div>
          <label className="text-xs text-arc-muted mb-1.5 block">Source chain</label>
          <select
            value={sourceChain}
            onChange={e => setSourceChain(e.target.value as TestnetChain)}
            disabled={busy}
            className="arc-input text-sm"
          >
            {TESTNET_CHAINS.map(c => (
              <option key={c} value={c} style={{ background: "#0f0f0f" }}>
                {CHAIN_LABELS[c]}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div>
          <label className="text-xs text-arc-muted mb-1.5 block">Destination chain</label>
          <select
            value={destChain}
            onChange={e => setDestChain(e.target.value as TestnetChain)}
            disabled={busy}
            className="arc-input text-sm"
          >
            {TESTNET_CHAINS.map(c => (
              <option key={c} value={c} style={{ background: "#0f0f0f" }}>
                {CHAIN_LABELS[c]}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Recipient (spend only) */}
      {mode === "spend" && (
        <div>
          <label className="text-xs mb-1.5 flex justify-between">
            <span className="text-arc-muted">Recipient</span>
            <button
              onClick={() => setRecipient(address ?? "")}
              className="text-arc-green hover:underline"
            >
              Use my address
            </button>
          </label>
          <input
            type="text"
            value={recipient}
            onChange={e => setRecipient(e.target.value)}
            placeholder={address ?? "0x…"}
            disabled={busy}
            className="arc-input font-mono text-sm"
          />
        </div>
      )}

      {/* Amount */}
      <div>
        <label className="text-xs text-arc-muted mb-1.5 flex justify-between">
          <span>Amount</span>
          <span className="text-arc-green">USDC</span>
        </label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            disabled={busy}
            className="arc-input pr-16 text-xl font-semibold font-mono"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 token-tag">USDC</span>
        </div>
        <div className="flex gap-1.5 mt-2">
          {["1", "5", "10", "50"].map(v => (
            <button
              key={v}
              onClick={() => setAmount(v)}
              disabled={busy}
              className="flex-1 py-1.5 text-xs text-arc-muted border border-arc-border rounded-md hover:border-arc-green hover:text-arc-green transition-colors disabled:opacity-40"
            >
              ${v}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      {amount && +amount > 0 && (
        <div className="rounded-lg border border-arc-border bg-arc-surface p-3 text-xs flex flex-col gap-1.5 animate-fade-in">
          {mode === "deposit" ? (
            <>
              <Row label="From"     value={CHAIN_LABELS[sourceChain]} />
              <Row label="Protocol" value="Circle Gateway" green />
              <Row label="Credited" value={`~${amount} USDC`} green />
            </>
          ) : (
            <>
              <Row label="From"      value="Unified Balance" />
              <Row label="To chain"  value={CHAIN_LABELS[destChain]} green />
              <Row label="Recipient" value={recipient ? `${recipient.slice(0,8)}…${recipient.slice(-6)}` : "Your address"} />
              <Row label="Receive"   value={`~${amount} USDC`} green />
            </>
          )}
        </div>
      )}

      <TransactionStatus tx={tx} onClose={() => setTx(INITIAL_TX_STATE)} />

      {!isConnected ? (
        <ConnectButton label="Connect Wallet" />
      ) : (
        <button
          onClick={mode === "deposit" ? handleDeposit : handleSpend}
          disabled={busy || !amount || +amount <= 0}
          className="btn-primary"
        >
          {busy
            ? mode === "deposit" ? "Depositing…" : "Spending…"
            : mode === "deposit"
              ? `Deposit ${amount ? amount + " " : ""}USDC`
              : `Spend ${amount ? amount + " " : ""}USDC`
          }
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
