import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Proteomics Research Portal",
  description: "Search and explore proteomics association and MR causal relationship analysis results",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
