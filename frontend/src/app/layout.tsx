'use client';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import { initFlow } from "@/config/flow.config";
import { useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Note: Metadata can't be used in client components, move to separate server component if needed
// export const metadata: Metadata = {
//   title: "Tunnel - Prediction Market",
//   description: "Your prediction market platform",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // Initialize Flow configuration on app startup
    initFlow();
  }, []);

  return (
    <html lang="en">
      <head>
        <title>Tunnel - No-Loss Staking Platform</title>
        <meta name="description" content="Gamified staking on Flow blockchain with knowledge challenges" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white min-h-screen`}
        suppressHydrationWarning={true}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}