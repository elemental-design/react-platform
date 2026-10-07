import { readFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { Plugin } from 'esbuild';
import { compileMDX, type MDXCompileOptions } from './index.js';

/** Build-time only. Host aliases and TSX transformation remain the bundler's job. */
export function mdx(options: MDXCompileOptions = {}): Plugin {
  if (options.jsx || options.outputFormat === 'function-body') {
    throw new Error('The bundler requires program output with the automatic JSX runtime');
  }
  return {
    name: 'react-platform-mdx',
    setup(api) {
      api.onLoad({ filter: /\.mdx?$/ }, async args => {
        const result = await compileMDX(await readFile(args.path, 'utf8'), {
          ...options, filePath: args.path, format: args.path.endsWith('.md') ? 'md' : 'mdx',
        });
        const sourceMap = result.map ? `\n//# sourceMappingURL=data:application/json;base64,${Buffer.from(result.map).toString('base64')}` : '';
        return { contents: result.code + sourceMap, loader: 'js', resolveDir: dirname(args.path), watchFiles: [args.path] };
      });
    },
  };
}
