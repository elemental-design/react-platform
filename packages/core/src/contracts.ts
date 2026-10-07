import type { ReactNode } from 'react';

export interface ViewStyle {
  display?: 'flex' | 'none';
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  flexWrap?: 'nowrap' | 'wrap';
  alignItems?: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline';
  alignSelf?: 'auto' | 'stretch' | 'flex-start' | 'flex-end' | 'center';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
  flex?: number; flexGrow?: number; flexShrink?: number; flexBasis?: number;
  width?: number; height?: number; minWidth?: number; minHeight?: number;
  maxWidth?: number; maxHeight?: number;
  padding?: number; paddingHorizontal?: number; paddingVertical?: number;
  paddingTop?: number; paddingRight?: number; paddingBottom?: number; paddingLeft?: number;
  margin?: number; marginHorizontal?: number; marginVertical?: number;
  marginTop?: number; marginRight?: number; marginBottom?: number; marginLeft?: number;
  gap?: number; rowGap?: number; columnGap?: number;
  backgroundColor?: string; opacity?: number;
  borderWidth?: number; borderColor?: string; borderRadius?: number;
  overflow?: 'visible' | 'hidden'; position?: 'relative' | 'absolute';
  top?: number; right?: number; bottom?: number; left?: number; zIndex?: number;
}
export interface TextStyle extends ViewStyle {
  color?: string; fontFamily?: string; fontSize?: number;
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  fontStyle?: 'normal' | 'italic'; lineHeight?: number; letterSpacing?: number;
  textAlign?: 'left' | 'right' | 'center'; textDecorationLine?: 'none' | 'underline' | 'line-through';
}
export type Style = TextStyle;
export type StyleProp<T extends Style = Style> = T | false | null | undefined | readonly StyleProp<T>[];
export interface BaseProps {
  children?: ReactNode;
  name?: string;
  testID?: string;
  accessibilityLabel?: string;
}
export interface ViewProps extends BaseProps {
  style?: StyleProp<ViewStyle>;
  accessibilityRole?: 'none';
}
export interface TextProps extends BaseProps {
  style?: StyleProp<TextStyle>;
  accessibilityRole?: 'text' | 'heading';
}
export interface ImageSource { uri: string; width?: number; height?: number }
export interface ImageProps extends Omit<BaseProps, 'children'> {
  source: ImageSource;
  style?: StyleProp<ViewStyle>;
  resizeMode?: 'cover' | 'contain' | 'stretch';
}
export interface PressableState {
  pressed: boolean; hovered: boolean; focused: boolean; disabled: boolean;
}
export interface PressEvent { nativeEvent: unknown }
export interface PressableProps extends BaseProps {
  disabled?: boolean;
  onPress?: (event: PressEvent) => void;
  style?: StyleProp<ViewStyle> | ((state: PressableState) => StyleProp<ViewStyle>);
}
export type Target = 'web' | 'native' | 'figma';
export interface PlatformInfo {
  readonly OS: string;
  readonly target: Target;
  select<T>(values: Readonly<Partial<Record<Target | 'ios' | 'android', T>> & { default?: T }>): T | undefined;
}
export type DiagnosticCode = 'RP001' | 'RP002' | 'RP005';
export class PlatformError extends Error {
  constructor(readonly code: DiagnosticCode, readonly target: Target, message: string) {
    super(`${code} <${target}> ${message}`);
    this.name = 'PlatformError';
  }
}
export function createPlatform(target: Target, os: string = target): PlatformInfo {
  return Object.freeze({
    OS: os, target,
    select<T>(values: Readonly<Partial<Record<Target | 'ios' | 'android', T>> & { default?: T }>): T | undefined {
      for (const key of [os, target, 'default']) {
        if (Object.prototype.hasOwnProperty.call(values, key)) return values[key as keyof typeof values];
      }
      return undefined;
    },
  });
}
