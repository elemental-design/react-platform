import { createElement } from 'react';
import type { TextProps } from '../contracts.js';
import { flatten } from '../stylesheet.js';
import { assertHost, hostStyle, metadata } from './shared.js';
export function createText(value: unknown, target: 'native' | 'figma') {
  assertHost(value, target);
  const host = value;
  return function Text(props: TextProps) {
    const style = hostStyle(flatten(props.style), target);
    if (style.display === 'none') return null;
    return createElement(host.Text, { ...metadata(props), accessibilityRole: props.accessibilityRole === 'heading' && target === 'native' ? 'header' : props.accessibilityRole, style }, props.children);
  }
}
