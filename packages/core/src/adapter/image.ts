import { createElement } from 'react';
import type { ImageProps } from '../contracts.js';
import { flatten } from '../stylesheet.js';
import { assertHost, hostStyle, metadata } from './shared.js';
export function createImage(value: unknown, target: 'native' | 'figma') {
  assertHost(value, target);
  const host = value;
  return function Image(props: ImageProps) {
    const style = hostStyle(flatten(props.style), target);
    if (style.display === 'none') return null;
    return createElement(host.Image, { ...metadata(props), source: props.source, resizeMode: props.resizeMode ?? 'cover', style: { width: props.source.width, height: props.source.height, ...style } });
  }
}
