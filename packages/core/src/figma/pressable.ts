import host from './host.js';
import { createPressable } from '../adapter/pressable.js';
export const Pressable = /* @__PURE__ */ createPressable(host, 'figma');
/** @deprecated Use Pressable. */
export const Touchable = Pressable;
