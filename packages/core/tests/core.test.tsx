import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { View, Text, Pressable, Image, StyleSheet, Platform } from '../src/web/index.js';
import { createPlatform } from '../src/contracts.js';
import { createPrimitives, SnapshotProvider } from '../src/adapter.js';
import { toCSS } from '../src/web/style.js';
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
afterEach(() => { document.body.innerHTML = ''; });

describe('portable contracts', () => {
  it('flattens nested arrays without mutating inputs and freezes definitions', () => {
    const first = { padding: 4 }; const sheet = StyleSheet.create({ first });
    first.padding = 20;
    expect(sheet.first.padding).toBe(4);
    expect(Object.isFrozen(sheet.first)).toBe(true);
    expect(StyleSheet.flatten([sheet.first, null, [false, { padding: 8 }]])).toEqual({ padding: 8 });
    expect(StyleSheet.flatten(StyleSheet.compose(sheet.first, { padding: 9 }))).toEqual({ padding: 9 });
    expect(sheet.first.padding).toBe(4);
  });
  it('selects explicit undefined without falling through and isolates targets', () => {
    expect(Platform.select({ web: undefined, default: 'wrong' })).toBeUndefined();
    expect(createPlatform('native', 'ios').select({ ios: 'ios', native: 'native' })).toBe('ios');
    expect(Platform.target).toBe('web'); expect(Object.isFrozen(Platform)).toBe(true);
  });
  it('maps numeric line heights and deterministic shorthand precedence', () => {
    expect(toCSS({ paddingLeft: 2, paddingHorizontal: 8, padding: 12, lineHeight: 20 })).toMatchObject({ padding: 12, paddingRight: 8, paddingLeft: 2, lineHeight: '20px' });
    expect(toCSS({ flexGrow: 3, flex: 1 })).toMatchObject({ flexGrow: 3, flexShrink: 0, flexBasis: 0 });
  });
});

describe('web semantics', () => {
  it('renders semantic HTML and image sizing on the server', () => {
    const markup = renderToStaticMarkup(<View><Text accessibilityRole="heading">Hello</Text><Image source={{ uri: 'data:image/png;base64,AA==', width: 10, height: 20 }} accessibilityLabel="Logo" /></View>);
    expect(markup).toContain('flex-direction:column'); expect(markup).toContain('role="heading"'); expect(markup).toContain('alt="Logo"'); expect(markup).toContain('height:20px');
  });
  it('activates once, prevents disabled activation and resolves keyboard state', async () => {
    const container = document.createElement('div'); document.body.append(container); const root = createRoot(container); const onPress = vi.fn();
    const button = (disabled = false) => <Pressable disabled={disabled} onPress={onPress} style={state => ({ opacity: state.pressed ? .5 : 1 })}><Text>Continue</Text></Pressable>;
    await act(() => root.render(button()));
    const element = container.querySelector('button')!;
    expect(element.type).toBe('button');
    await act(() => element.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true })));
    expect(element.style.opacity).toBe('0.5');
    await act(() => element.click()); expect(onPress).toHaveBeenCalledTimes(1);
    await act(() => root.render(button(true))); expect(element.disabled).toBe(true); expect(element.style.opacity).toBe('1');
    await act(() => element.click()); expect(onPress).toHaveBeenCalledTimes(1);
    await act(() => root.render(button(false))); expect(element.style.opacity).toBe('1');
    await act(() => root.unmount());
  });
});

describe('host boundaries', () => {
  const host = { View: (props: Record<string, unknown>) => createElement('div', { 'data-style': JSON.stringify(props.style) }, props.children as never), Text: (props: Record<string, unknown>) => createElement('span', {}, props.children as never), Image: () => null };
  it('projects selected state without invoking actions', () => {
    const primitives = createPrimitives(host, 'figma'); const action = vi.fn();
    const output = renderToStaticMarkup(<SnapshotProvider state={{ pressed: true }}><primitives.Pressable onPress={action} style={state => ({ opacity: state.pressed ? .5 : 1 })}>Hello</primitives.Pressable></SnapshotProvider>);
    expect(output).toContain('0.5'); expect(action).not.toHaveBeenCalled();
  });
  it('rejects unsupported styles and invalid hosts', () => {
    const primitives = createPrimitives(host, 'figma');
    expect(() => renderToStaticMarkup(<primitives.View style={{ gap: 4 }} />)).toThrow('RP002');
    expect(() => renderToStaticMarkup(<primitives.View style={{ transform: 'none' } as never} />)).toThrow('RP001');
    expect(() => renderToStaticMarkup(<primitives.View style={{ width: '50%' } as never} />)).toThrow('RP001');
    expect(() => createPrimitives({}, 'native')).toThrow('RP005');
  });
  it('forwards native activation and normalizes disabled state', () => {
    let captured: Record<string, unknown> = {};
    const primitives = createPrimitives({ ...host, Pressable: (props: Record<string, unknown>) => { captured = props; return null; } }, 'native');
    const action = vi.fn(); renderToStaticMarkup(<primitives.Pressable disabled onPress={action} />);
    (captured.onPress as (event: unknown) => void)({ nativeEvent: {} }); expect(action).not.toHaveBeenCalled();
    expect(captured.accessibilityRole).toBe('button');
  });
});
