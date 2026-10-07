import type { ComponentType, ReactNode } from 'react';
import type { PressableProps, TextProps, PressableState } from '../../src/contracts.js';

export const tokens = {
  light: { accent: '#1b6b50', accentPressed: '#14523e', foreground: '#ffffff', neutral: '#e8eeeb', neutralPressed: '#d8e2dc', neutralForeground: '#173f35', disabled: '#e8eeeb', disabledForeground: '#64736a' },
  dark: { accent: '#74d9ad', accentPressed: '#54ba91', foreground: '#123b2c', neutral: '#243e32', neutralPressed: '#315340', neutralForeground: '#e7f5ed', disabled: '#243e32', disabledForeground: '#93a69b' },
} as const;
export interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md';
  mode?: 'light' | 'dark';
  disabled?: boolean;
  onPress?: PressableProps['onPress'];
}
export interface ButtonHost {
  Pressable: ComponentType<PressableProps>;
  Text: ComponentType<TextProps>;
}
// The recipe consumes only portable primitives. A fixture can bind any supported host.
export function createButton({ Pressable, Text }: ButtonHost) {
  return function Button({ label, variant = 'primary', size = 'md', mode = 'light', disabled = false, onPress }: ButtonProps): ReactNode {
    const theme = tokens[mode];
    return <Pressable name={`Button ${variant}`} accessibilityLabel={label} disabled={disabled} onPress={onPress}
      style={({ pressed }) => ({
        paddingHorizontal: size === 'sm' ? 12 : 16, paddingVertical: size === 'sm' ? 6 : 10,
        borderRadius: 8, alignItems: 'center', justifyContent: 'center',
        backgroundColor: disabled ? theme.disabled : variant === 'primary' ? (pressed ? theme.accentPressed : theme.accent) : (pressed ? theme.neutralPressed : theme.neutral),
      })}>
      <Text style={{ fontFamily: 'Arial', fontSize: size === 'sm' ? 14 : 16, lineHeight: size === 'sm' ? 20 : 24, fontWeight: '600', color: disabled ? theme.disabledForeground : variant === 'primary' ? theme.foreground : theme.neutralForeground }}>{label}</Text>
    </Pressable>;
  };
}

export const buttonManifest = {
  schemaVersion: 1,
  id: 'react-platform.example.button',
  version: '0.1.0',
  description: 'Astryx-inspired portable button recipe; not an Astryx implementation.',
  parameters: {
    label: { type: 'string', required: true, description: 'Visible and accessible label.' },
    variant: { type: 'enum', values: ['primary', 'secondary'], default: 'primary' },
    size: { type: 'enum', values: ['sm', 'md'], default: 'md' },
    mode: { type: 'enum', values: ['light', 'dark'], default: 'light' },
    disabled: { type: 'boolean', default: false },
    onPress: { type: 'action', projection: 'omitted-in-figma' },
  },
  tokens,
  targets: { web: 'interactive', native: 'adapter-contract', figma: 'snapshot' },
  constraints: ['No arbitrary CSS or DOM refs.', 'Figma callbacks are never invoked.', 'Native device behavior requires device validation.'],
  fixtures: [
    { id: 'primary-light', props: { label: 'Continue' }, state: { pressed: false } },
    { id: 'primary-pressed', props: { label: 'Continue' }, state: { pressed: true } },
    { id: 'secondary-dark', props: { label: 'Cancel', variant: 'secondary', mode: 'dark' }, state: { pressed: false } },
    { id: 'disabled', props: { label: 'Continue', disabled: true }, state: { pressed: true } },
  ],
} as const satisfies { fixtures: readonly { id: string; props: ButtonProps; state: Partial<PressableState> }[] } & Record<string, unknown>;
