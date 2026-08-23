import type { Metadata } from "next";
import { Geist } from "next/font/google";
import SiteAnalytics from "@/components/SiteAnalytics";
import SiteFooter from "@/components/SiteFooter";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // 各ページの canonical・OGP を相対パスで書けるようにする土台。
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "会社印ジェネレーター",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
  },
  // カード画像は app/opengraph-image.png(1200x630)のファイル規約で配信される。
  // og:image / twitter:image のタグは Next.js が自動で出力する。
  twitter: { card: "summary_large_image" },
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
        <SiteAnalytics />
      </body>
    </html>
  );
}
