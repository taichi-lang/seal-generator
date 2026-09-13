import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/guides";
import { STARTER_TOOLS_HUB } from "@/lib/relatedSites";
import { OG_IMAGE_PATH, SERVICE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `会社印の解説 | ${SERVICE_NAME}`,
  description:
    "会社設立で必要な印鑑の種類、合同会社の代表社員印、開業届と屋号印、角印の押し方、電子印鑑の作り方をまとめた解説記事の一覧です。",
  alternates: { canonical: "/guide" },
  // 継承したままだとトップの URL が入ってしまうので、このページ自身を指す。
  openGraph: {
    url: "/guide",
    title: `会社印の解説 | ${SERVICE_NAME}`,
    images: [OG_IMAGE_PATH],
  },
};

export default function GuideIndexPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            会社印の解説
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            会社を立ち上げるときの印鑑まわりを、手続きの順にそって整理しました。
            制度に関わる部分は、法令・官公庁の資料の出典を記事内に示しています。
          </p>
        </header>

        <ul className="space-y-4">
          {GUIDES.map((guide) => (
            <li key={guide.slug}>
              <Link
                href={`/guide/${guide.slug}`}
                className="block bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 hover:border-red-700 dark:hover:border-red-500 transition"
              >
                <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
                  {guide.title}
                </h2>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {guide.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <p>
          <Link href="/" className="underline text-sm text-zinc-700 dark:text-zinc-300">
            印影を作る（無料）へ戻る
          </Link>
        </p>

        {/* 印鑑の解説を読み終えた人の次の疑問は「で、どの書類をいつ出すのか」である。
            その答えは姉妹サイトの母屋にまとまっているので、末尾で1本だけ渡す。 */}
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          印鑑の次に必要になるのは書類です。見積書・納品書・請求書・領収書を出す順番は、
          姉妹サイトの
          <a
            href={STARTER_TOOLS_HUB.href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            {STARTER_TOOLS_HUB.label}
          </a>
          にまとめてあります。
        </p>
      </div>
    </main>
  );
}
