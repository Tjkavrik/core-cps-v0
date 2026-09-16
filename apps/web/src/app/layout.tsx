import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CPS V0.1 (Prototype)",
  description:
    "CORE Construction Project Services — discovery prototype. Not for production use.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header
          style={{
            background: "#1f3a5f",
            color: "white",
            padding: "12px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <strong>CPS — Construction Project Services</strong>
          <span style={{ fontSize: 12, opacity: 0.85 }}>V0.1 Prototype · Not for production</span>
        </header>
        <main style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>{children}</main>
      </body>
    </html>
  );
}
