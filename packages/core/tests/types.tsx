import { View, Text, Pressable, Image, StyleSheet } from '../src/web/index.js';
import type { ViewProps } from '../src/contracts.js';
const styles = StyleSheet.create({ label: { color: 'red', fontWeight: 'bold' }, root: { padding: 8 } });
<View style={styles.root}><Text style={styles.label}>Hello</Text></View>;
<Pressable style={({ pressed }) => ({ opacity: pressed ? .5 : 1 })} onPress={event => void event.nativeEvent} />;
<Image source={{ uri: 'data:image/png;base64,AA==' }} />;
// @ts-expect-error Core does not accept arbitrary CSS.
<View style={{ gridTemplateColumns: '1fr' }} />;
// @ts-expect-error Text style belongs on Text.
const wrong: ViewProps = { style: { color: 'red' } };
// @ts-expect-error Styles cannot be mutated.
styles.label.color = 'blue';
// @ts-expect-error Platform refs are not part of the portable surface yet.
<View ref={() => {}} />;
// @ts-expect-error Primitive events use onPress, not web events.
<Pressable onClick={() => {}} />;
void wrong;

// @ts-expect-error Unknown keys are rejected even alongside valid style keys.
StyleSheet.create({ root: { padding: 8, gridTemplateColumns: '1fr' } });
