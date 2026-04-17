"use client";

import type { TxState } from "@/lib/appkit";

interface Props {
  tx: TxState;
  onClose?: () => void;
}

const config: Record<string, { label: string; color: string; bg: string }> = {
  estimating: { label: "Estimating fees…",    color: "text-arc-green",   bg: "bg-arc-green/5 border-arc-green/20" },
  pending:    { label: "Waiting for wallet…", color: "text-arc-green",   bg: "bg-arc-green/5 border-arc-green/20" },
  approving:  { label: "Approving token…",    color: "text-arc-warning", bg: "bg-arc-warning/5 border-arc-warning/20" },
  processing: { label: "Processing…",         color: "text-arc-green",   bg: "bg-arc-green/5 border-arc-green/20" },
  success:    { label: "Transaction sent",    color: "text-arc-green",   bg: "bg-arc-green/5 border-arc-green/20" },
  error:      { label: "Failed",              color: "text-arc-error",   bg: "bg-arc-error/5 border-arc-error/20" },
};

const Spinner = () => (
  <svg className="w-4 h-4 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
    <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z" />
  </svg>
);

export function TransactionStatus({ tx, onClose }: Props) {
  if (tx.status === "idle") return null;
  const c = config[tx.status];
  if (!c) return null;

  const isDone = tx.status === "success" || tx.status === "error";
  const isSpinning = !isDone;

  return (
    <div className={`animate-slide-up flex items-start gap-3 p-3.5 rounded-lg border text-sm ${c.bg}`}>
      <span className={c.color}>
        {isSpinning ? (
          <Spinner />
        ) : tx.status === "success" ? (
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </span>

      <div className="flex-1 min-w-0">
        <p className={`font-semibold ${c.color}`}>{c.label}</p>
        {tx.message && (
          <p className="text-arc-muted text-xs mt-0.5">{tx.message}</p>
        )}
        {tx.txHash && (
          <a
            href={tx.explorerUrl ?? `https://testnet.arcscan.app/tx/${tx.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-arc-green hover:underline mt-1 inline-block"
          >
            {tx.txHash.slice(0, 10)}…{tx.txHash.slice(-8)} ↗
          </a>
        )}
        {tx.error && (
          <p className="text-xs text-arc-error mt-1 font-mono break-all">{tx.error}</p>
        )}
      </div>

      {isDone && onClose && (
        <button onClick={onClose} className="text-arc-muted hover:text-arc-white flex-shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
