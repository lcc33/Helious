import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Helious",
  description: "Understand and audit Ethereum smart contracts with AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "'EB Garamond', Georgia, serif" }}>{children}</body>
    </html>
  );
}