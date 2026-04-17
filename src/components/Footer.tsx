import { VertexLogo } from "./VertexLogo";

export function Footer() {
  return (
    <footer className="border-t border-arc-border mt-12">
      <div className="max-w-5xl mx-auto px-5 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <VertexLogo size={20} />
          <span className="text-sm text-arc-muted">Vertex · Testnet only</span>
        </div>

        <div className="flex items-center gap-4 text-xs text-arc-muted">
          <a href="https://docs.arc.network" target="_blank" rel="noopener noreferrer" className="hover:text-arc-green transition-colors">Docs</a>
          <a href="https://testnet.arcscan.app" target="_blank" rel="noopener noreferrer" className="hover:text-arc-green transition-colors">Explorer</a>
          <a href="https://docs.arc.network/app-kit" target="_blank" rel="noopener noreferrer" className="hover:text-arc-green transition-colors">App Kit</a>
          <span className="text-arc-border">Chain ID: 5042002</span>
        </div>
      </div>
    </footer>
  );
}
