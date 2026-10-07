import { createView } from './adapter/view.js';
import { createText } from './adapter/text.js';
import { createImage } from './adapter/image.js';
import { createPressable } from './adapter/pressable.js';
export { SnapshotProvider } from './adapter/snapshot.js';
export { assertHost } from './adapter/shared.js';
export type { Host } from './adapter/shared.js';
export function createPrimitives(value: unknown, target: 'native' | 'figma') {
  const Pressable = createPressable(value, target);
  return { View: createView(value, target), Text: createText(value, target), Image: createImage(value, target), Pressable, Touchable: Pressable };
}
