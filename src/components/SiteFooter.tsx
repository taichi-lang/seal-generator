import Link from "next/link";
import { SERVICE_NAME } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="mt-auto py-8 px-4 text-center text-xs text-zinc-500 dark:text-zinc-400 space-y-2">
      <p>
        <Link href="/legal" className="underline hover:text-zinc-700 dark:hover:text-zinc-200">
          特定商取引法に基づく表記・プライバシーポリシー
        </Link>
      </p>
      <p>&copy; 2026 {SERVICE_NAME}</p>
    </footer>
  );
}
