import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { ChatWidget } from "@/components/site/chat-widget";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Developer & Research Portfolio",
    template: "%s | Portfolio"
  },
  description: "Personal portfolio with projects, research, publications, and activity.",
  openGraph: {
    title: "Developer & Research Portfolio",
    description: "Projects, papers, certificates, and technical writing.",
    images: ["/og"]
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main className="min-h-[calc(100vh-160px)]">{children}</main>
        <SiteFooter />
        <ChatWidget />
      </body>
    </html>
  );
}
