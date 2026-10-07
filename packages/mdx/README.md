# @react-platform/mdx

Build-time MDX 3 compilation for renderer-independent React documents. This package owns YAML frontmatter, named metadata exports, source maps, and an optional esbuild integration. It does not own a player, slide separators, speaker notes, UI components, or any design renderer.

```ts
import { compileMDX } from '@react-platform/mdx';
const result = await compileMDX(source, { filePath: 'article.mdx' });
// result.code: an ESM module exporting the React component and frontmatter
// result.map: a JSON source map string
// result.frontmatter: parsed, JSON-serializable YAML metadata
```

Leading YAML is parsed with gray-matter and yaml. Nested mappings, arrays, numbers and booleans are supported; malformed YAML and non-mapping metadata fail. `frontmatter` is a reserved named export and available in authored expressions. `frontmatter: false` preserves a leading Markdown rule and exports empty metadata. `parseMDX` returns metadata plus content padded with blank lines to preserve source line numbers.

```mdx
---
title: Portable documents
---

# {frontmatter.title}

A **shared** document.

---

This is a horizontal rule, not a new slide.
```

The output uses the automatic React JSX runtime and accepts an MDX `components` map. Native and design consumers map Markdown tags to their own primitives; imported custom components must use the selected host too. Explicit lowercase JSX bypasses the map. The compiler runs on Node at build time; bundle or precompile its output before loading it on React Native. It does not ship a runtime evaluator or a Metro transformer. Rendering authored MDX executes its expressions and imports, so use trusted source.

## Bundling

```ts
import { build } from 'esbuild';
import { mdx } from '@react-platform/mdx/esbuild';
await build({ entryPoints: ['article.mdx'], bundle: true, plugins: [mdx()] });
```

The optional `/esbuild` entry loads `.md` and `.mdx`, passes through source maps, watches source files, and preserves relative import resolution. The root compiler does not import esbuild, React, DOM/native APIs or design libraries. Install esbuild only if using that entry. The host controls TSX, dependency resolution and target aliases; program output with the automatic JSX runtime is required by the bundler plugin.

`MDXCompileOptions` extends MDX's `CompileOptions`: remark/rehype plugins, JSX import source, development output and other upstream options pass through. Metadata injection runs after the caller's remark plugins. A final rehype pass removes whitespace-only block children that otherwise become unintended text nodes on native/design hosts; code and inline spaces are preserved.

## Ownership and validation

`mdx-slides` retains top-level thematic-break splitting, shared deck imports, slide IDs/titles, notes, presentation themes/players and PDF output. Its compiler delegates document compilation to this package. React Designapp's `examples/mdx-figma` demonstrates a single MDX document using the existing `react-strict-dom-figma` host. Frame-per-slide Figma export remains a future mdx-slides feature.

Run `pnpm check` from React Platform, or build/test this package with `pnpm --filter @react-platform/mdx build` and `pnpm --filter @react-platform/mdx test`. Tests exercise YAML validation, source positions/maps, component mapping, relative TSX imports and ordinary horizontal rules. These are compiler/bundler checks, not native-device validation.

The sibling consumers use local `link:` dependencies while the package is unpublished. Build this package before invoking consumers; their provided scripts do so. A release should replace local links with matching published version ranges.
