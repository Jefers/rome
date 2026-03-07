import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rome Itinerary - 5-Day Leisurely Sightseeing Adventure",
  description: "Your comprehensive 5-day Rome travel guide with iconic fountains, ancient ruins, Vatican treasures, and bohemian neighborhoods. Explore the Eternal City at your own pace.",
  keywords: ["Rome", "Italy", "Travel", "Itinerary", "Sightseeing", "Colosseum", "Vatican", "Spanish Steps", "Trevi Fountain"],
  authors: [{ name: "Rome Trip Planner" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
  openGraph: {
    title: "Rome Itinerary - 5-Day Adventure",
    description: "Explore Rome with this comprehensive 5-day leisurely sightseeing guide",
    url: "/",
    siteName: "Rome Trip",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rome Itinerary - 5-Day Adventure",
    description: "Explore Rome with this comprehensive 5-day leisurely sightseeing guide",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Rome Trip",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
