import { createElement } from 'react';
import type { ViewProps } from '../contracts.js';
import { flatten } from '../stylesheet.js';
import { assertHost, hostStyle, metadata } from './shared.js';
export function createView(value: unknown, target: 'native' | 'figma') {
  assertHost(value, target);
  const host = value;
  return function View(props: ViewProps) {
    const style = hostStyle(flatten(props.style), target);
    if (style.display === 'none') return null;
    return createElement(host.View, { ...metadata(props), accessibilityRole: props.accessibilityRole, style: { flexDirection: 'column', flexShrink: 0, ...style } }, props.children);
  }
}
