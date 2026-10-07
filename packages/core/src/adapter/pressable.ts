import { createElement, useContext, useState } from 'react';
import type { PressableProps, PressableState, PressEvent } from '../contracts.js';
import { flatten } from '../stylesheet.js';
import { assertHost, hostStyle, metadata } from './shared.js';
import { SnapshotContext, resting } from './snapshot.js';
export function createPressable(value: unknown, target: 'native' | 'figma') {
  assertHost(value, target);
  const host = value;
  return function Pressable(props: PressableProps) {
    const snapshot = useContext(SnapshotContext);
    const [interaction, setInteraction] = useState({ hovered: false, focused: false });
    const disabled = props.disabled ?? false;
    const resolve = (state: Partial<PressableState>) => hostStyle(flatten(typeof props.style === 'function' ? props.style({ ...resting, ...interaction, ...state, hovered: !disabled && (state.hovered ?? interaction.hovered), disabled, pressed: !disabled && (state.pressed ?? false) }) : props.style), target);
    if (target === 'figma') {
      const style = resolve(snapshot);
      if (style.display === 'none') return null;
      return createElement(host.View, { ...metadata(props), style: { flexDirection: 'column', flexShrink: 0, ...style } }, props.children);
    }
    return createElement(host.Pressable!, {
      ...metadata(props), accessibilityRole: 'button', disabled,
      onHoverIn: () => setInteraction(state => ({ ...state, hovered: true })),
      onHoverOut: () => setInteraction(state => ({ ...state, hovered: false })),
      onFocus: () => setInteraction(state => ({ ...state, focused: true })),
      onBlur: () => setInteraction(state => ({ ...state, focused: false })),
      onPress: (event: PressEvent) => { if (!disabled) props.onPress?.({ nativeEvent: event.nativeEvent }); },
      style: (state: Partial<PressableState>) => ({ flexDirection: 'column', flexShrink: 0, ...resolve(state) }),
    }, props.children);
  }
}
