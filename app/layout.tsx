import type { ReactNode } from "react";
import "./globals.css";
import ClientProviders from "../src/i18n/ClientProviders";

export const metadata = {
  title: "SWING BUDDY",
  description: "Standalone Next.js Frontend",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
