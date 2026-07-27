import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const satoshi = localFont({
  src: "./fonts/Satoshi-Variable.woff2",
  variable: "--font-satoshi",
  weight: "300 900",
  display: "swap",
});

const SITE_URL = "https://personal-site-omega-neon.vercel.app";
const SITE_DESCRIPTION =
  "Building AI-powered lead, content, and automation systems. Work less, enjoy more.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Gourav Boruah",
    template: "%s — Gourav Boruah",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "Gourav Boruah",
    title: "Gourav Boruah",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [{ url: "/gourav.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gourav Boruah",
    description: SITE_DESCRIPTION,
    images: ["/gourav.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={satoshi.variable}>
      <head>
        {/* If JS is disabled, reveal animations can't run — show content anyway */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important;}`}</style>
        </noscript>
      </head>
      <body className="bg-black font-sans text-muted antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
