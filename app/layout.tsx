import Providers from "@/app/providers";
import type { Metadata } from "next";
import localFont from "next/font/local";
import PlausibleProvider from "next-plausible";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

let title = "Hive Painter - Bulk AI Image Generator";
let description = "Generate images across multiple Together AI models at once.";
let url = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
let ogimage = "/og-image.png";
let sitename = "Hive Painter";
let plausibleDomain =
  process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? "hive-painter";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    images: [ogimage],
    title,
    description,
    url: url,
    siteName: sitename,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [ogimage],
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark h-full ${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <meta name="color-scheme" content="dark" />
        <PlausibleProvider domain={plausibleDomain} />
      </head>
      <body className="h-full min-h-full bg-gray-600 font-sans text-gray-100 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
