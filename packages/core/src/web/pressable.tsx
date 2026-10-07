import { useEffect, useState } from 'react';
import type { PressableProps, PressableState } from '../contracts.js';
import { boxDefaults, toCSS } from './style.js';
export function Pressable({ children, disabled = false, onPress, style, accessibilityLabel, testID, name }: PressableProps) {
  const [state, setState] = useState({ pressed: false, hovered: false, focused: false });
  useEffect(() => {
    if (disabled) setState({ pressed: false, hovered: false, focused: false });
  }, [disabled]);
  const update = (patch: Partial<PressableState>) => setState(value => ({ ...value, ...patch }));
  const resolved = typeof style === 'function' ? style({ ...state, pressed: !disabled && state.pressed, hovered: !disabled && state.hovered, disabled }) : style;
  return <button type="button" disabled={disabled} aria-label={accessibilityLabel} data-testid={testID} data-name={name}
    style={{ ...boxDefaults, appearance: 'none', backgroundColor: 'transparent', color: 'inherit', font: 'inherit', textAlign: 'inherit', ...toCSS(resolved) }}
    onClick={event => { if (!disabled) onPress?.({ nativeEvent: event.nativeEvent }); }}
    onPointerDown={event => { if (!disabled) { event.currentTarget.setPointerCapture?.(event.pointerId); update({ pressed: true }); } }}
    onLostPointerCapture={() => update({ pressed: false })}
    onPointerUp={() => update({ pressed: false })} onPointerCancel={() => update({ pressed: false })}
    onPointerEnter={() => update({ hovered: true })} onPointerLeave={() => update({ hovered: false, pressed: false })}
    onFocus={() => update({ focused: true })} onBlur={() => update({ focused: false, pressed: false })}
    onKeyDown={event => { if (!disabled && (event.key === ' ' || event.key === 'Enter')) update({ pressed: true }); }}
    onKeyUp={() => update({ pressed: false })}>{children}</button>;
}
/** @deprecated Use Pressable. */
export const Touchable = Pressable;
