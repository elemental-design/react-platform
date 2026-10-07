import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { build } from 'esbuild';
import { compileMDX, parseMDX } from '../dist/index.js';
import { mdx } from '../dist/esbuild.js';
const here = dirname(fileURLToPath(import.meta.url));

test('YAML metadata is typed data and does not impose presentation semantics', async () => {
  const source = '---\ntitle: A document\nnotes: A scalar is valid document metadata\nnested: {enabled: true}\n---\n\n# {frontmatter.title}\n\n---\n\nNext section.';
  const result = await compileMDX(source, { filePath: 'document.mdx' });
  assert.deepEqual(result.frontmatter.nested, { enabled: true });
  assert.match(result.code, /hr/);
  assert.match(result.code, /frontmatter.title/);
  assert.doesNotMatch(result.code, /mdx-slides|react-strict-dom|react-designapp|react-native/);
  const map = JSON.parse(result.map);
  assert.ok(map.mappings.length);
  assert.deepEqual(map.sourcesContent, [source]);
  assert.equal(parseMDX(source).content.split('\n').findIndex(line => line.startsWith('#')), source.split('\n').findIndex(line => line.startsWith('#')));
});

test('invalid YAML and collisions fail, while optional frontmatter can be disabled', async () => {
  await assert.rejects(compileMDX('---\na: [broken\n---\n# Heading'));
  await assert.rejects(compileMDX('---\n- array\n---\n# Heading'), /mapping/);
  await assert.rejects(compileMDX('export const frontmatter = {}\n\n# Heading'), /reserved/);
  const result = await compileMDX('---\n\n# Heading', { frontmatter: false });
  assert.deepEqual(result.frontmatter, {});
  assert.match(result.code, /hr/);
  assert.throws(() => mdx({ jsx: true }), /program output/);
});

test('esbuild preserves relative TSX imports and renders with a chosen component map', async () => {
  const dir = await mkdtemp(join(here, '.fixture-'));
  try {
    await writeFile(join(dir, 'callout.tsx'), 'export function Callout({children}) { return <aside>{children}</aside>; }');
    await writeFile(join(dir, 'document.mdx'), '---\ntitle: Portable content\n---\nimport { Callout } from "./callout.tsx"\n\n# {frontmatter.title}\n\n<Callout>Imported TSX</Callout>\n\n---\n\nLast section.');
    const bundle = await build({ entryPoints: [join(dir, 'document.mdx')], plugins: [mdx()], bundle: true,
      platform: 'node', format: 'esm', jsx: 'automatic', external: ['react', 'react/jsx-runtime'], write: false });
    await writeFile(join(dir, 'document.mjs'), bundle.outputFiles[0].contents);
    const { default: Content, frontmatter } = await import(pathToFileURL(join(dir, 'document.mjs')).href);
    assert.equal(frontmatter.title, 'Portable content');
    const markup = renderToStaticMarkup(React.createElement(Content, { components: { h1: props => React.createElement('h2', props) } }));
    assert.match(markup, /<h2>Portable content<\/h2>/);
    assert.match(markup, /<aside>Imported TSX<\/aside>/);
    assert.match(markup, /<hr\/>/);
  } finally { await rm(dir, { force: true, recursive: true }); }
});
