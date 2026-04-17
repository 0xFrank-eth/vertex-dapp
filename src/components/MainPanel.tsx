"use client";

import { useState } from "react";
import { BridgePanel } from "./BridgePanel";
import { SwapPanel }   from "./SwapPanel";
import { SendPanel }   from "./SendPanel";

type Tab = "bridge" | "swap" | "send";

const TABS: { id: Tab; label: string }[] = [
  { id: "bridge", label: "Bridge" },
  { id: "swap",   label: "Swap"   },
  { id: "send",   label: "Send"   },
];

export function MainPanel() {
  const [tab, setTab] = useState<Tab>("bridge");

  return (
    <div className="card overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-arc-border">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              tab === t.id
                ? "text-arc-green border-arc-green"
                : "text-arc-muted border-transparent hover:text-arc-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-5 animate-fade-in">
        {tab === "bridge" && <BridgePanel />}
        {tab === "swap"   && <SwapPanel   />}
        {tab === "send"   && <SendPanel   />}
      </div>
    </div>
  );
}
