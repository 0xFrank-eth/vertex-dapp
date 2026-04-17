import { Header }       from "@/components/Header";
import { StatsBar }     from "@/components/StatsBar";
import { HeroSection }  from "@/components/HeroSection";
import { MainPanel }    from "@/components/MainPanel";
import { BalanceCard }  from "@/components/BalanceCard";
import { AddToMetaMask } from "@/components/AddToMetaMask";
import { Footer }       from "@/components/Footer";

const CONTRACTS = [
  { symbol: "USDC", short: "0x3600…0000", full: "0x3600000000000000000000000000000000000000" },
  { symbol: "EURC", short: "0x89B5…72a",  full: "0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a" },
  { symbol: "USYC", short: "0xe918…86C",  full: "0xe9185F0c5F296Ed1797AaE4238D26CCaBEadb86C" },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-arc-bg">
      <Header />
      <StatsBar />

      <main className="flex-1">
        <HeroSection />

        <div className="max-w-5xl mx-auto px-5 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Main panel */}
            <div className="lg:col-span-2">
              <MainPanel />
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-4">
              <BalanceCard />

              {/* Network info */}
              <div className="card p-4 flex flex-col gap-3">
                <p className="text-sm font-semibold text-arc-white">Network</p>
                {[
                  { k: "Chain ID",  v: "5042002" },
                  { k: "RPC",       v: "rpc.testnet.arc.network" },
                  { k: "Gas token", v: "USDC", green: true },
                ].map(row => (
                  <div key={row.k} className="flex justify-between items-center">
                    <span className="text-xs text-arc-muted">{row.k}</span>
                    <span className={`text-xs font-mono ${row.green ? "text-arc-green" : "text-arc-white"}`}>{row.v}</span>
                  </div>
                ))}
                <a href="https://testnet.arcscan.app" target="_blank" rel="noopener noreferrer"
                  className="flex justify-between items-center">
                  <span className="text-xs text-arc-muted">Explorer</span>
                  <span className="text-xs font-mono text-arc-green hover:underline">arcscan.app ↗</span>
                </a>
                <AddToMetaMask />
              </div>

              {/* Contracts */}
              <div className="card p-4 flex flex-col gap-3">
                <p className="text-sm font-semibold text-arc-white">Token Contracts</p>
                {CONTRACTS.map(c => (
                  <div key={c.symbol} className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-arc-green">{c.symbol}</span>
                    <a href={`https://testnet.arcscan.app/address/${c.full}`} target="_blank" rel="noopener noreferrer"
                      className="text-xs font-mono text-arc-muted hover:text-arc-green transition-colors">
                      {c.short}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
