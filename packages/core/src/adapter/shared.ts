import type { ComponentType } from 'react';
import type { Target, Style } from '../contracts.js';
import { PlatformError } from '../contracts.js';
// Unknown runtime props are contained at the optional host boundary, not in public primitive props.
export interface Host {
  View: ComponentType<Record<string, unknown>>;
  Text: ComponentType<Record<string, unknown>>;
  Image: ComponentType<Record<string, unknown>>;
  Pressable?: ComponentType<Record<string, unknown>>;
}
export function assertHost(value: unknown, target: Target): asserts value is Host {
  const host = value as Partial<Host> | null;
  for (const key of ['View', 'Text', 'Image', ...(target === 'native' ? ['Pressable'] : [])]) {
    const item = host?.[key as keyof Host];
    if (typeof item !== 'function' && !(typeof item === 'object' && item !== null && '$$typeof' in item)) {
      throw new PlatformError('RP005', target, `Host must export ${key}.`);
    }
  }
}
const supported = new Set('display flexDirection flexWrap alignItems alignSelf justifyContent flex flexGrow flexShrink flexBasis width height minWidth minHeight maxWidth maxHeight padding paddingHorizontal paddingVertical paddingTop paddingRight paddingBottom paddingLeft margin marginHorizontal marginVertical marginTop marginRight marginBottom marginLeft backgroundColor opacity borderWidth borderColor borderRadius overflow position top right bottom left zIndex color fontFamily fontSize fontWeight fontStyle lineHeight letterSpacing textAlign textDecorationLine'.split(' '));
const stringValues: Record<string, readonly string[] | null> = {
  display: ['flex', 'none'], flexDirection: ['row', 'column', 'row-reverse', 'column-reverse'],
  flexWrap: ['nowrap', 'wrap'], alignItems: ['stretch', 'flex-start', 'flex-end', 'center', 'baseline'],
  alignSelf: ['auto', 'stretch', 'flex-start', 'flex-end', 'center'],
  justifyContent: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around'],
  overflow: ['visible', 'hidden'], position: ['relative', 'absolute'],
  backgroundColor: null, borderColor: null, color: null, fontFamily: null,
  fontWeight: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  fontStyle: ['normal', 'italic'], textAlign: ['left', 'right', 'center'],
  textDecorationLine: ['none', 'underline', 'line-through'],
};
export function hostStyle(style: Style, target: Target): Style {
  if (target !== 'figma') return style;
  for (const [key, value] of Object.entries(style)) {
    if (value === undefined) continue;
    if (['gap', 'rowGap', 'columnGap'].includes(key)) throw new PlatformError('RP002', target, `${key} needs a real layout implementation; use explicit child margins for this release.`);
    if (!supported.has(key)) throw new PlatformError('RP001', target, `Unsupported style ${key}.`);
    const valid = key in stringValues
      ? typeof value === 'string' && (stringValues[key] === null || stringValues[key].includes(value))
      : typeof value === 'number' && Number.isFinite(value);
    if (!valid) throw new PlatformError('RP001', target, `Invalid value for ${key}; use the portable style contract.`);
  }
  const { textDecorationLine, ...rest } = style;
  return textDecorationLine === undefined ? rest : { ...rest, textDecoration: textDecorationLine } as Style;
}
export function metadata(props: { name?: string; testID?: string; accessibilityLabel?: string }) {
  return { name: props.name ?? props.accessibilityLabel ?? props.testID, testID: props.testID, accessibilityLabel: props.accessibilityLabel };
}
