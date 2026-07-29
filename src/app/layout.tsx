import type { Metadata } from "next";
import { Geist } from "next/font/google";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "会社印ジェネレーター",
  description: "会社名を入力するだけで角印・丸印を自動生成",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@700;900&family=Shippori+Mincho+B1:wght@700;800&family=Kaisei+Decol:wght@700&family=Yuji+Syuku&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-black">
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
