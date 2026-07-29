import type { Metadata } from "next";
import UnlockPanel from "@/components/UnlockPanel";

export const metadata: Metadata = {
  title: "ダウンロード | 会社印ジェネレーター",
  // 決済後の個別ページなので検索結果には載せない
  robots: { index: false, follow: false },
};

export default async function UnlockPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4">
      <UnlockPanel sessionId={sessionId ?? ""} />
    </main>
  );
}
