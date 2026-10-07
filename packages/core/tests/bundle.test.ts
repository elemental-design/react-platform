// @vitest-environment node
import { expect, it } from 'vitest';
import { build } from 'esbuild';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const cwd = fileURLToPath(new URL('..', import.meta.url));
it('tree shakes a Text-only production import and isolates optional hosts', async () => {
  const result = await build({ stdin: { contents: "import { Text } from '@react-platform/core'; console.log(Text)", resolveDir: cwd }, bundle: true, write: false, metafile: true, minify: true, external: ['react', 'react/jsx-runtime'], format: 'esm' });
  const output = result.outputFiles[0].text;
  expect(output).not.toMatch(/react-native|react-designapp|react-primitives|Pressable|objectFit/);
});
it('splits the optional target behind a dynamic import', async () => {
  const result = await build({ stdin: { contents: "export const load = () => import('@react-platform/core/figma')", resolveDir: cwd }, bundle: true, write: false, splitting: true, outdir: 'unused', format: 'esm', external: ['react', 'react/jsx-runtime', 'react-designapp/figma'] });
  expect(result.outputFiles.length).toBeGreaterThan(1);
  expect(result.outputFiles.find(file => file.path.endsWith('stdin.js'))!.text).not.toContain('react-designapp');
});
it('resolves conditional exports and imports contracts without a host', () => {
  for (const [condition, target] of [['', 'web'], ['figma', 'figma'], ['react-native', 'native']]) {
    const result = spawnSync(process.execPath, [...(condition ? [`--conditions=${condition}`] : []), '--input-type=module', '-e', "console.log(import.meta.resolve('@react-platform/core'))"], { cwd, encoding: 'utf8' });
    expect(result.status).toBe(0); expect(result.stdout).toContain(`/dist/${target}/index.js`);
  }
  const contracts = spawnSync(process.execPath, ['--input-type=module', '-e', "import { createPlatform } from '@react-platform/core/contracts'; console.log(createPlatform('figma').target)"], { cwd, encoding: 'utf8' });
  expect(contracts.status).toBe(0); expect(contracts.stdout.trim()).toBe('figma');
});

it('tree shakes native Text without retaining interaction or snapshot code', async () => {
  const result = await build({ stdin: { contents: "import { Text } from '@react-platform/core'; console.log(Text)", resolveDir: cwd }, conditions: ['react-native'], bundle: true, write: false, minify: true, format: 'esm', external: ['react', 'react/jsx-runtime', 'react-native'] });
  expect(result.outputFiles[0].text).not.toMatch(/useState|createContext|onHoverIn|onPress|source.width/);
});
