# React Platform Core

Experimental replacement for react-primitives. This package owns View, Text, Image, Pressable, StyleSheet and Platform with React 19, strict shared types and built ESM. There is no global injection or react-primitives dependency.

```tsx
import { View, Text, Pressable, StyleSheet } from '@react-platform/core';
const styles = StyleSheet.create({ panel: { padding: 16 }, label: { fontSize: 16 } });
<View style={styles.panel}>
  <Pressable onPress={() => console.log('Continue')}>
    <Text style={styles.label}>Continue</Text>
  </Pressable>
</View>;
```

## Target resolution

The root entry defaults to web. `react-native` selects native and a custom `figma` condition selects Figma. Explicit `/web`, `/native` and `/figma` entries avoid ambiguous tooling configuration. Component subpaths (`/text`, `/view`, `/image`, `/pressable`, `/platform`) use the same conditions. `/stylesheet` and `/contracts` import no host. `/adapter` exports a scoped `createPrimitives(host, target)` factory for custom native-shaped or static hosts.

Install React as a peer; native consumers additionally install React Native, and design consumers install React Designapp. Figma is a headless snapshot, not a live document renderer. To use `/figma`, build the sibling React Designapp package so its `figma` export exists. The integration tests consume the local package through a `file:` development dependency, without altering that repository. Build React Designapp before installing this workspace if its built files are absent.

Publish built files with `pnpm build`. Root and component modules are synchronous and tree-shakable by a supporting bundler. Load export tooling or routes with dynamic imports. ESM alone is not a promise that every bundler removes unused code; bundle tests verify the current build. No CommonJS distribution is included in this experimental release.

## Supported first slice

- Web renders View as a flex-column div, Text as a span, Image as an img, and Pressable as a real button with disabled and keyboard state handling. Default focus outline remains visible.
- Native wraps host View/Text/Image/Pressable. A typed host contract and stub-host tests validate translation; real-device interaction and Metro builds remain release gates.
- Figma wraps React Designapp primitives, resolves a selected snapshot state and never invokes actions. Unknown styles fail with RP001; gap fails with RP002 because Yoga 1 cannot implement it accurately. Use child margins explicitly.
- StyleSheet definitions are copied/frozen. Nested style arrays and falsy entries flatten in order without mutation. Style values are a small RN-shaped vocabulary with numeric lengths; CSS selectors, arbitrary units and compiled StyleX artifacts are outside this slice.
- Platform is immutable and supports OS → target → default selection. There are no measurement/focus refs yet. Touchable is a deprecated Pressable alias, without legacy responder compatibility.

The built-in snapshot state is resting. Wrap design fixtures in `SnapshotProvider state={{ pressed: true }}` from `/figma` for a chosen visual state; `disabled` remains controlled by the component prop.

## Validation and examples

From the repository root run `pnpm install` and `pnpm check`. Checks cover shared types, SSR, web interactions, styles, optional host boundaries, React 19 Figma serialization, ESM condition resolution, tree shaking and dynamic-import splitting.

The [Astryx-inspired Button recipe](./examples/astryx-inspired/README.md) includes a serializable parameter/token/fixture manifest as a first agent interface. Loom should eventually generate that interface from its IR rather than require duplicate hand-maintained specifications.

Upstream React Strict DOM continues to own web/native. Its Figma polyfill stays in React Designapp. Legacy service packages, including expo-notifications, are outside the active workspace and unchanged.


The active workspace also includes the independent [`@react-platform/mdx`](../mdx/README.md) compiler. Core does not import it or own Markdown rendering; the new package shares build-time MDX compilation with mdx-slides and the React Designapp document example.
