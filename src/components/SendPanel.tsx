"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { isAddress } from "viem";
import { getAppKit, createAdapter, INITIAL_TX_STATE, type TxState } from "@/lib/appkit";
import { TOKEN_ADDRESSES } from "@/config/chains";
import { TransactionStatus } from "./TransactionStatus";
import { ConnectButton } from "@rainbow-me/rainbowkit";

// USDC uses the "USDC" alias; EURC needs the contract address on Arc Testnet
const TOKEN_CONFIG: Record<string, { label: string; sendAs: string }> = {
  USDC: { label: "USD Coin",  sendAs: "USDC" },
  EURC: { label: "Euro Coin", sendAs: TOKEN_ADDRESSES.arcTestnet.EURC },
};

export function SendPanel() {
  const { isConnected, address } = useAccount();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount]       = useState("");
  const [token, setToken]         = useState("USDC");
  const [tx, setTx] = useState<TxState>(INITIAL_TX_STATE);

  const busy   = tx.status !== "idle" && tx.status !== "success" && tx.status !== "error";
  const valid  = recipient.startsWith("0x") && isAddress(recipient);
  const isSelf = !!address && address.toLowerCase() === recipient.toLowerCase();

  async function submit() {
    if (!amount || !valid) return;
    try {
      setTx({ status: "pending", message: "Confirm in your wallet…" });

      const adapter = await createAdapter();
      const result  = await getAppKit().send({
        from:  { adapter, chain: "Arc_Testnet" },
        to:    recipient,
        amount,
        token: TOKEN_CONFIG[token].sendAs as "USDC",
      });

      setTx({
        status: "success",
        message: `Sent ${amount} ${token} to ${recipient.slice(0,6)}…${recipient.slice(-4)}`,
        txHash: result.txHash,
        explorerUrl: result.explorerUrl,
      });
      setAmount("");
      setRecipient("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setTx({ status: "error", message: "Transfer failed", error: msg.slice(0, 150) });
    }
  }

  const addrState = !recipient ? "empty"
    : !valid  ? "invalid"
    : isSelf  ? "self"
    : "ok";

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-arc-muted">
        Send stablecoins to any wallet on{" "}
        <span className="text-arc-green">Arc Testnet</span>
      </p>

      {/* Token selector */}
      <div>
        <label className="text-xs text-arc-muted mb-1.5 block">Token</label>
        <div className="flex gap-2">
          {Object.keys(TOKEN_CONFIG).map(t => (
            <button key={t} onClick={() => setToken(t)} disabled={busy}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg border transition-colors disabled:opacity-40 ${
                token === t
                  ? "border-arc-green text-arc-green bg-arc-green-glow"
                  : "border-arc-border text-arc-muted hover:border-arc-dim"
              }`}>
              {t}
              <span className="block text-xs font-normal text-arc-muted mt-0.5">
                {TOKEN_CONFIG[t].label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Recipient */}
      <div>
        <label className="text-xs mb-1.5 flex justify-between">
          <span className="text-arc-muted">Recipient address</span>
          {addrState === "invalid" && <span className="text-arc-error">Invalid address</span>}
          {addrState === "self"    && <span className="text-arc-warning">Your own address</span>}
          {addrState === "ok"      && <span className="text-arc-green">Valid ✓</span>}
        </label>
        <div className="relative">
          <input
            type="text" value={recipient} onChange={e => setRecipient(e.target.value)}
            placeholder="0x…" disabled={busy}
            className={`arc-input font-mono text-sm pr-8 ${
              addrState === "invalid" ? "border-arc-error/50"
              : addrState === "ok"   ? "border-arc-green/30"
              : ""
            }`}
          />
          {recipient && (
            <button onClick={() => setRecipient("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-arc-muted hover:text-arc-white text-sm">
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Amount */}
      <div>
        <label className="text-xs text-arc-muted mb-1.5 flex justify-between">
          <span>Amount</span>
          <span className="text-arc-green">{token}</span>
        </label>
        <div className="relative">
          <input
            type="number" value={amount} onChange={e => setAmount(e.target.value)}
            placeholder="0.00" min="0" step="0.01" disabled={busy}
            className="arc-input pr-16 text-xl font-semibold font-mono"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 token-tag">{token}</span>
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

      {/* Preview */}
      {addrState === "ok" && amount && +amount > 0 && (
        <div className="rounded-lg border border-arc-border bg-arc-surface p-3 text-xs flex flex-col gap-1.5 animate-fade-in">
          <div className="flex justify-between">
            <span className="text-arc-muted">From</span>
            <span className="font-mono text-arc-white">{address?.slice(0,8)}…{address?.slice(-6)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-arc-muted">To</span>
            <span className="font-mono text-arc-white">{recipient.slice(0,8)}…{recipient.slice(-6)}</span>
          </div>
          <div className="flex justify-between border-t border-arc-border pt-1.5 mt-0.5">
            <span className="text-arc-muted">Total</span>
            <span className="text-arc-green font-semibold font-mono">{amount} {token}</span>
          </div>
        </div>
      )}

      <TransactionStatus tx={tx} onClose={() => setTx(INITIAL_TX_STATE)} />

      {!isConnected ? (
        <ConnectButton label="Connect Wallet" />
      ) : (
        <button onClick={submit}
          disabled={busy || !amount || +amount <= 0 || addrState !== "ok"}
          className="btn-primary">
          {busy ? "Sending…" : `Send ${amount ? amount + " " : ""}${token}`}
        </button>
      )}
    </div>
  );
}
