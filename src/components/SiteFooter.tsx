import Link from "next/link";
import { SERVICE_NAME } from "@/lib/site";
import { RELATED_SITES } from "@/lib/relatedSites";

export default function SiteFooter() {
  return (
    <footer className="mt-auto py-8 px-4 text-center text-xs text-zinc-500 dark:text-zinc-400 space-y-2">
      <p className="space-x-4">
        <Link href="/guide" className="underline hover:text-zinc-700 dark:hover:text-zinc-200">
          会社印の解説
        </Link>
        <Link href="/legal" className="underline hover:text-zinc-700 dark:hover:text-zinc-200">
          特定商取引法に基づく表記・プライバシーポリシー
        </Link>
      </p>
      {/* 同じ運営者の他サイト。広告ではないので「広告」表記は付けない
          (景表法のステマ規制が対象にするのは、対価を受け取っている表示)。
          誤解を避けるため「運営者の他のサイト」と見出しで明示する。 */}
      <nav aria-label="運営者の他のサイト" className="space-y-1">
        <p className="text-zinc-400 dark:text-zinc-500">運営者の他のサイト</p>
        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          {RELATED_SITES.map((site) => (
            <li key={site.href}>
              <a
                href={site.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                {site.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <p>&copy; 2026 {SERVICE_NAME}</p>
    </footer>
  );
}
