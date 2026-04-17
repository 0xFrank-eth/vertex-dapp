"use client";

import { useBlockNumber } from "wagmi";
import { arcTestnet } from "@/config/chains";

export function StatsBar() {
  const { data: block } = useBlockNumber({ chainId: arcTestnet.id, watch: true });

  const stats = [
    { label: "Network",  value: "Arc Testnet", green: true },
    { label: "Block",    value: block ? `#${block.toLocaleString()}` : "—" },
    { label: "Finality", value: "< 1s",  green: true },
    { label: "Gas",      value: "USDC",  green: true },
    { label: "EVM",      value: "Compatible" },
  ];

  return (
    <div className="border-b border-arc-border bg-arc-surface/60">
      <div className="max-w-5xl mx-auto px-5">
        <div className="flex items-center gap-0 overflow-x-auto py-2 no-scrollbar">
          <div className="flex items-center gap-1.5 pr-4 mr-2 border-r border-arc-border flex-shrink-0">
            <span className="dot-live" />
            <span className="text-xs text-arc-green font-medium">Live</span>
          </div>
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex items-center gap-1.5 px-3 flex-shrink-0 ${
                i < stats.length - 1 ? "border-r border-arc-border" : ""
              }`}
            >
              <span className="text-xs text-arc-muted">{s.label}</span>
              <span className={`text-xs font-mono font-medium ${s.green ? "text-arc-green" : "text-arc-white"}`}>
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
