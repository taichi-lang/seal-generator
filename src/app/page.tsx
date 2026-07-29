import Link from "next/link";
import SealGenerator from "@/components/SealGenerator";
import { GUIDES } from "@/lib/guides";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black py-10 px-4">
      <header className="max-w-5xl mx-auto mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          会社印ジェネレーター
        </h1>
        <p className="mt-2 text-sm md:text-base text-zinc-600 dark:text-zinc-400">
          会社名を入力するだけで、見積書・請求書に使える角印・丸印を即生成
        </p>
      </header>
      <SealGenerator />

      <section className="max-w-5xl mx-auto mt-10 px-6">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          会社印の解説
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          どの印鑑がいつ必要になるのか、実物を注文する前に知っておきたいことをまとめました。
        </p>
        <ul className="mt-4 space-y-2">
          {GUIDES.map((guide) => (
            <li key={guide.slug}>
              <Link
                href={`/guide/${guide.slug}`}
                className="text-sm underline text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                {guide.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
