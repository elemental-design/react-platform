import { compile, createProcessor, type CompileOptions } from '@mdx-js/mdx';
import matter from 'gray-matter';
import { parseDocument } from 'yaml';
import { SourceMapGenerator } from 'source-map';
import type { Root } from 'mdast';
import type { Root as HastRoot, Element, RootContent } from 'hast';
import type { Plugin } from 'unified';

export type Metadata = Record<string, unknown>;
export interface MDXCompileOptions extends CompileOptions {
  /** Parse leading YAML and inject a named frontmatter export. Default true. */
  frontmatter?: boolean;
  filePath?: string;
}
export interface ParsedMDX { content: string; frontmatter: Metadata }
export interface CompiledMDX { code: string; map?: string; frontmatter: Metadata }

export function parseMDX(source: string, options: Pick<MDXCompileOptions, 'frontmatter'> = {}): ParsedMDX {
  const parsed = options.frontmatter === false ? { content: source, data: {} } : matter(source, {
    engines: { yaml: (value: string) => {
      const document = parseDocument(value, { schema: 'core', uniqueKeys: true });
      if (document.errors.length) throw document.errors[0];
      return document.toJS({ maxAliasCount: 100 });
    } },
  });
  if (parsed.data === null || typeof parsed.data !== 'object' || Array.isArray(parsed.data)) {
    throw new TypeError('MDX frontmatter must be a YAML mapping');
  }
  const frontmatter: Metadata = JSON.parse(JSON.stringify(parsed.data));
  const removed = source.slice(0, source.length - parsed.content.length);
  return { frontmatter, content: '\n'.repeat((removed.match(/\n/g) || []).length) + parsed.content };
}

/** Compile a document to React JSX-runtime code without selecting a renderer. */
export async function compileMDX(source: string, options: MDXCompileOptions = {}): Promise<CompiledMDX> {
  const { filePath = 'document.mdx', frontmatter = true, remarkPlugins = [], rehypePlugins = [], ...rest } = options;
  const parsed = parseMDX(source, { frontmatter });
  const metadataNode = createProcessor().parse(`export const frontmatter = JSON.parse(${JSON.stringify(JSON.stringify(parsed.frontmatter))})`).children[0]!;
  const injectMetadata: Plugin<[], Root> = () => root => {
    if (root.children.some(node => node.type === 'mdxjsEsm' && /\bfrontmatter\b/.test(node.value))) {
      throw new Error('The frontmatter binding is reserved; use a different name in MDX imports/exports');
    }
    root.children.unshift(structuredClone(metadataNode));
  };
  const file = await compile({ value: parsed.content, path: filePath }, {
    ...rest, SourceMapGenerator,
    remarkPlugins: [...(remarkPlugins ?? []), injectMetadata],
    rehypePlugins: [...(rehypePlugins ?? []), removeBlockWhitespace],
  });
  if (file.map) file.map.sourcesContent = [source];
  return { code: String(file), map: file.map ? JSON.stringify(file.map) : undefined, frontmatter: parsed.frontmatter };
}

// Whitespace between block nodes becomes unwanted Text children on native/design hosts.
const removeBlockWhitespace: Plugin<[], HastRoot> = () => root => {
  function visit(node: HastRoot | RootContent): void {
    if (node.type === 'root' || (node.type === 'element' && ['ul', 'ol', 'blockquote'].includes(node.tagName))) {
      node.children = node.children.filter(child => child.type !== 'text' || child.value.trim());
    }
    if ('children' in node && (node as Element).tagName !== 'pre') node.children.forEach(visit);
  }
  visit(root);
};
