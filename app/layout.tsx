import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
        <ProviderWrapper>
          <Header />
          {children}
          <Footer />
        </ProviderWrapper>
      </body>
    </html>
  );
}
