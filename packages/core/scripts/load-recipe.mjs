import { build } from 'esbuild';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
export async function withRecipe(callback) {
  const result = await build({ entryPoints: [new URL('../examples/astryx-inspired/button.tsx', import.meta.url).pathname], bundle: true, write: false, platform: 'node', format: 'esm', packages: 'external' });
  const directory = await mkdtemp(new URL('../.recipe-', import.meta.url).pathname);
  try {
    const path = `${directory}/recipe.mjs`;
    await writeFile(path, result.outputFiles[0].text);
    return await callback(await import(pathToFileURL(path).href));
  } finally { await rm(directory, { recursive: true, force: true }); }
}
