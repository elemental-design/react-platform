import { createElement } from 'react';
import { renderToJSON } from 'react-designapp/figma';
import * as primitives from '../dist/figma/index.js';
import { withRecipe } from './load-recipe.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
const output = resolve(process.argv[2] ?? 'examples/astryx-inspired/button-gallery.figma.json');
await withRecipe(async ({ createButton, buttonManifest }) => {
  const Button = createButton(primitives);
  const fixtures = buttonManifest.fixtures.map((fixture, index) => createElement(primitives.View, { key: fixture.id, name: fixture.id, style: { marginTop: index ? 16 : 0 } }, createElement(primitives.SnapshotProvider, { state: fixture.state }, createElement(Button, fixture.props))));
  const file = renderToJSON(createElement(primitives.View, { name: 'Portable Button Gallery', style: { width: 320, padding: 24 } }, fixtures), { name: 'React Platform Button Gallery', autoLayout: true, lastModified: '2026-10-06T00:00:00.000Z', version: '1' });
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, JSON.stringify(file, null, 2) + '\n');
  process.stdout.write(output + '\n');
});
