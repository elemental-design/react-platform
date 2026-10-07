import type { TextProps } from '../contracts.js';
import { toCSS } from './style.js';
export function Text({ children, style, accessibilityRole, accessibilityLabel, testID, name }: TextProps) {
  return <span role={accessibilityRole === 'heading' ? 'heading' : undefined} aria-level={accessibilityRole === 'heading' ? 2 : undefined} aria-label={accessibilityLabel} data-testid={testID} data-name={name} style={{ boxSizing: 'border-box', flexShrink: 0, margin: 0, whiteSpace: 'pre-wrap', ...toCSS(style) }}>{children}</span>;
}
