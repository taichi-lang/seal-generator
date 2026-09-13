/** テストから `src/` の TypeScript をそのまま読むための最小フック。
 *
 * 2つだけ面倒を見る。どちらも tsconfig / バンドラが本来やっていることで、
 * Node だけが知らない対応表である:
 *   1. `@/x`  →  `src/x`(tsconfig の paths)
 *   2. 拡張子の省略(`./seal` → `./seal.ts`)
 *
 * テストのためだけにバンドラやテスト用の依存を足さないために置いている。
 * 本番のビルド(next build)はこのファイルを一切通らない。
 */
import { registerHooks } from "node:module";
import { pathToFileURL, fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import path from "node:path";

const SRC = path.resolve(import.meta.dirname, "..", "src");
const EXTS = [".ts", ".tsx", ".mts", ".js"];

/** 拡張子を省いた指定を、実在するファイルに合わせて補う。無ければ null。 */
function withExtension(filePath) {
  if (existsSync(filePath) && path.extname(filePath)) return filePath;
  for (const ext of EXTS) {
    if (existsSync(filePath + ext)) return filePath + ext;
    const index = path.join(filePath, `index${ext}`);
    if (existsSync(index)) return index;
  }
  return null;
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    // 1. paths の `@/`
    if (specifier.startsWith("@/")) {
      const resolved = withExtension(path.join(SRC, specifier.slice(2)));
      if (resolved) return { url: pathToFileURL(resolved).href, shortCircuit: true };
    }

    // 2. 拡張子を省いた相対指定。まず素の解決を試し、駄目なときだけ補う
    try {
      return nextResolve(specifier, context);
    } catch (err) {
      if (!specifier.startsWith(".") || !context.parentURL) throw err;
      const base = path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier);
      const resolved = withExtension(base);
      if (!resolved) throw err;
      return { url: pathToFileURL(resolved).href, shortCircuit: true };
    }
  },
});
