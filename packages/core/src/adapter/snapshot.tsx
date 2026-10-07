import { createContext } from 'react';
import type { ReactNode } from 'react';
import type { PressableState } from '../contracts.js';
export const resting: PressableState = Object.freeze({ pressed: false, hovered: false, focused: false, disabled: false });
export const SnapshotContext = /* @__PURE__ */ createContext(resting);
export function SnapshotProvider({ state, children }: { state: Partial<PressableState>; children?: ReactNode }) {
  return <SnapshotContext.Provider value={{ ...resting, ...state }}>{children}</SnapshotContext.Provider>;
}
