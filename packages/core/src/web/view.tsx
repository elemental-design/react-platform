import type { ViewProps } from '../contracts.js';
import { boxDefaults, toCSS } from './style.js';
export function View({ children, style, accessibilityRole, accessibilityLabel, testID, name }: ViewProps) {
  return <div role={accessibilityRole} aria-label={accessibilityLabel} data-testid={testID} data-name={name} style={{ ...boxDefaults, ...toCSS(style) }}>{children}</div>;
}
