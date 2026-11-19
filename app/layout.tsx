
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ProviderWrapper from "./components/ProviderWrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Vido",
  description: "Upload, share, and watch videos.",
  verification: {
    google: "tRjrFAT8T2NPSLZ_U6kOfaYn1zL6Zw6nps1YQrSY_c"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body
        className={`${inter.variable} font-sans antialiased bg-[#fafafa] text-[#111]`}
      >
        <Script
          src="https://pixel-pin.vercel.app/widget.js"
          data-project="8ma4hCtMnR"
          strategy="afterInteractive"
          data-api="https://pixelpin.onrender.com/api"
        />

        <ProviderWrapper>
          <Header />
          {children}
          <Footer />
        </ProviderWrapper>
      </body>
    </html>
  );
}
