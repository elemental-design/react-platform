import type { CSSProperties } from 'react';
import type { Style, StyleProp } from '../contracts.js';
import { flatten } from '../stylesheet.js';

export const boxDefaults: CSSProperties = {
  boxSizing: 'border-box', display: 'flex', flexDirection: 'column',
  position: 'relative', flexShrink: 0, minWidth: 0, margin: 0, padding: 0,
  borderWidth: 0, borderStyle: 'solid',
};
export function toCSS(style: StyleProp): CSSProperties {
  const result: Record<string, string | number | undefined> = {};
  const value = flatten(style);
  const axes: Record<string, string[]> = {
    paddingHorizontal: ['paddingLeft', 'paddingRight'], paddingVertical: ['paddingTop', 'paddingBottom'],
    marginHorizontal: ['marginLeft', 'marginRight'], marginVertical: ['marginTop', 'marginBottom'],
  };
  // Shorthands are applied before axis values and explicit edges, independent of object insertion order.
  for (const [key, item] of Object.entries(value)) {
    if (key in axes || /^(padding|margin)(Top|Right|Bottom|Left)$/.test(key)) continue;
    if (key === 'lineHeight' && typeof item === 'number') result[key] = `${item}px`;
    else if (key === 'textDecorationLine') result.textDecorationLine = item;
    else if (key === 'flex' && typeof item === 'number') {
      result.flexGrow = item > 0 ? item : 0; result.flexShrink = item < 0 ? 1 : 0; result.flexBasis = item > 0 ? 0 : 'auto';
    } else result[key] = item;
  }
  for (const [key, edges] of Object.entries(axes)) {
    const item = value[key as keyof Style];
    if (item !== undefined) for (const edge of edges) result[edge] = item;
  }
  for (const [key, item] of Object.entries(value)) {
    if (/^(padding|margin)(Top|Right|Bottom|Left)$/.test(key)) result[key] = item;
  }
  for (const key of ['flexGrow', 'flexShrink', 'flexBasis'] as const) {
    if (value[key] !== undefined) result[key] = value[key];
  }
  return result as CSSProperties;
}
