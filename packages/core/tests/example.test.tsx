import { expect, it } from 'vitest';
import savedManifest from '../examples/astryx-inspired/button.manifest.json';
import { renderToStaticMarkup } from 'react-dom/server';
import { renderToJSON } from 'react-designapp/figma';
import * as web from '../src/web/index.js';
import * as figma from '../src/figma/index.js';
import { createButton, buttonManifest, tokens } from '../examples/astryx-inspired/button.js';
it('renders the portable recipe and every declared fixture in Figma', () => {
  const WebButton = createButton(web); const FigmaButton = createButton(figma);
  expect(renderToStaticMarkup(<WebButton label="Continue" />)).toContain('<button');
  for (const fixture of buttonManifest.fixtures) {
    const file = renderToJSON(<figma.SnapshotProvider state={fixture.state}><FigmaButton {...fixture.props} /></figma.SnapshotProvider>, { autoLayout: true, lastModified: '2026-10-06T00:00:00.000Z' });
    expect(JSON.stringify(file)).toContain(fixture.props.label);
    const props = fixture.props as { mode?: 'light' | 'dark'; variant?: 'primary' | 'secondary'; disabled?: boolean };
    const theme = tokens[props.mode ?? 'light'];
    const color = props.disabled ? theme.disabled : props.variant === 'secondary' ? theme.neutral : fixture.state.pressed ? theme.accentPressed : theme.accent;
    const root = file.document.children[0].children[0];
    expect(root.absoluteBoundingBox.height).toBe(44);
    expect(root.fills[0].color.r).toBeCloseTo(parseInt(color.slice(1, 3), 16) / 255);
    expect(root.children[0].style.lineHeightPx).toBe(24);
  }
  expect(JSON.parse(JSON.stringify(buttonManifest)).parameters.variant.values).toEqual(['primary', 'secondary']);
});

it('exports the same snapshot twice with fixed inputs', () => {
  const Button = createButton(figma);
  const render = () => renderToJSON(<Button label="Continue" />, { autoLayout: true, name: 'Fixture', lastModified: '2026-10-06T00:00:00.000Z', version: '1' });
  expect(render()).toEqual(render());
});

it('keeps the generated agent manifest in sync with the recipe', () => {
  expect(savedManifest).toEqual(buttonManifest);
});
