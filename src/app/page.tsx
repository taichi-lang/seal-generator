import SealGenerator from "@/components/SealGenerator";

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
    </main>
  );
}
