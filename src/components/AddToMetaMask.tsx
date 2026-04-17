"use client";

export function AddToMetaMask() {
  function add() {
    if (typeof window === "undefined" || !window.ethereum) return;
    window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [{
        chainId: "0x4CC8D2",
        chainName: "Arc Testnet",
        nativeCurrency: { name: "USD Coin", symbol: "USDC", decimals: 6 },
        rpcUrls: ["https://rpc.testnet.arc.network"],
        blockExplorerUrls: ["https://testnet.arcscan.app"],
      }],
    });
  }

  return (
    <button onClick={add}
      className="w-full py-2 text-xs font-medium text-arc-muted border border-arc-border rounded-lg hover:border-arc-green hover:text-arc-green transition-colors">
      + Add Arc to MetaMask
    </button>
  );
}
