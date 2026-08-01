import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { otherGuides, type GuideMeta } from "@/lib/guides";
import { SITE_URL } from "@/lib/site";

/** 解説記事の共通ガワ。見出し・本文の体裁と、記事末尾の導線をここで統一する。 */
export default function GuideArticle({
  guide,
  children,
}: {
  guide: GuideMeta;
  children: React.ReactNode;
}) {
  const related = otherGuides(guide.slug);

  // 検索結果に「トップ > 解説 > 記事名」の階層を出すためのもの。
  // 画面上のパンくずと同じ内容を、機械が読める形で並べているだけ。
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "会社印ジェネレーター", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "会社印の解説", item: `${SITE_URL}/guide` },
      {
        "@type": "ListItem",
        position: 3,
        name: guide.title,
        item: `${SITE_URL}/guide/${guide.slug}`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4">
      <JsonLd data={breadcrumb} />
      <div className="max-w-3xl mx-auto space-y-8">
        <nav className="text-xs text-zinc-500 dark:text-zinc-400">
          <Link href="/" className="underline hover:text-zinc-700 dark:hover:text-zinc-200">
            会社印ジェネレーター
          </Link>
          <span className="mx-1">/</span>
          <Link
            href="/guide"
            className="underline hover:text-zinc-700 dark:hover:text-zinc-200"
          >
            解説
          </Link>
        </nav>

        <header className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
            {guide.title}
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {guide.description}
          </p>
        </header>

        <article className="bg-white dark:bg-zinc-900 rounded-2xl p-6 md:p-8 border border-zinc-200 dark:border-zinc-800 space-y-6">
          {children}
        </article>

        <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            角印・丸印のデザインを無料で試す
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            会社名を入れるだけで、角印（社印）と丸印（代表者印）の印影をその場で作れます。
            透過 PNG を無料でダウンロードでき、透かしは入りません。
          </p>
          <Link
            href="/"
            className="mt-4 inline-block px-5 py-2.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-sm font-semibold transition"
          >
            印影を作ってみる（無料）
          </Link>
        </section>

        {related.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              あわせて読みたい
            </h2>
            <ul className="space-y-2">
              {related.map((g) => (
                <li key={g.slug}>
                  <Link
                    href={`/guide/${g.slug}`}
                    className="text-sm underline text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100"
                  >
                    {g.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}

/** 記事内の見出し。 */
export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 pt-2">
      {children}
    </h2>
  );
}

/** 記事内の本文段落。 */
export function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm md:text-base text-zinc-800 dark:text-zinc-200 leading-7">
      {children}
    </p>
  );
}

/** 記事の途中に置く、別サイトの道具への案内。
 *
 * 当サイトは「印鑑を作る側」、リンク先は「書類を作る側」で役割が分かれている。
 * 読者は請求書を作る流れの中で角印を探しに来るので、両方を行き来できるようにする。 */
export function ExternalTool({
  href,
  title,
  children,
}: {
  href: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <aside className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 p-4">
      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</p>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 leading-6">{children}</p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block text-sm underline text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 break-all"
      >
        {href}
      </a>
    </aside>
  );
}

/** 制度の根拠を示す注記。 */
export function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-6 border-l-2 border-zinc-300 dark:border-zinc-700 pl-3">
      {children}
    </p>
  );
}
