import { expect, it } from 'vitest';
import { renderToJSON } from 'react-designapp/figma';
import { View, Text, Pressable, SnapshotProvider } from '../src/figma/index.js';
it('renders core primitives through the real React Designapp Figma serializer with React 19', () => {
  const file = renderToJSON(<SnapshotProvider state={{ pressed: true }}><View name="Fixture" style={{ width: 240, padding: 8 }}><Pressable name="Continue" style={state => ({ padding: 12, backgroundColor: state.pressed ? '#173f35' : '#226644' })}><Text style={{ fontFamily: 'Arial', fontSize: 16, color: '#ffffff' }}>Continue</Text></Pressable></View></SnapshotProvider>, { autoLayout: true });
  const serialized = JSON.stringify(file);
  expect(serialized).toContain('Continue'); expect(serialized).toContain('TEXT'); expect(serialized).toContain('FRAME'); expect(serialized).toContain('VERTICAL');
  const root = file.document.children[0].children[0];
  expect(root.absoluteBoundingBox.width).toBe(240);
  expect(root.absoluteBoundingBox.height).toBeGreaterThan(0);
  expect(root.layoutMode).toBe('VERTICAL');
});
