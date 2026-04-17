import type { Metadata } from "next";
import { Providers } from "@/providers/Providers";
import { FetchInterceptor } from "@/components/FetchInterceptor";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vertex | Testnet",
  description:
    "Vertex — Bridge, Swap, and Send stablecoins on the Arc L1 blockchain.",
  keywords: ["Vertex", "Arc", "L1", "blockchain", "USDC", "bridge", "swap", "DeFi"],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Vertex | Testnet",
    description: "Bridge, Swap, and Send stablecoins on Vertex Testnet",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <FetchInterceptor />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
