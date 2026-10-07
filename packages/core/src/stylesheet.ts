import type { Style, StyleProp } from './contracts.js';

export function flatten<T extends Style>(style: StyleProp<T>): T {
  const result = {} as T;
  const visit = (value: StyleProp<T>): void => {
    if (!value) return;
    if (Array.isArray(value)) { for (const child of value) visit(child); return; }
    Object.assign(result, value);
  };
  visit(style);
  return result;
}
export const StyleSheet = /* @__PURE__ */ Object.freeze({
  create<T extends Record<string, Style>>(styles: T & { [K in keyof T]: Record<Exclude<keyof T[K], keyof Style>, never> }): { readonly [K in keyof T]: Readonly<T[K]> } {
    return Object.freeze(Object.fromEntries(Object.entries(styles).map(([key, value]) => [key, Object.freeze({ ...value })]))) as unknown as { readonly [K in keyof T]: Readonly<T[K]> };
  },
  flatten,
  compose<T extends Style>(first: StyleProp<T>, second: StyleProp<T>): StyleProp<T> {
    return !first ? second : !second ? first : [first, second];
  },
});
