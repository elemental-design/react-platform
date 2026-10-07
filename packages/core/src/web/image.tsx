import type { ImageProps } from '../contracts.js';
import { boxDefaults, toCSS } from './style.js';
export function Image({ source, resizeMode = 'cover', style, accessibilityLabel, testID, name }: ImageProps) {
  return <img src={source.uri} alt={accessibilityLabel ?? ''} data-testid={testID} data-name={name} style={{ ...boxDefaults, display: 'block', width: source.width, height: source.height, objectFit: resizeMode === 'stretch' ? 'fill' : resizeMode, ...toCSS(style) }} />;
}
