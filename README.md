# @react-platform

Cross-platform React interoperability APIs, component wrappers and polyfills for all React (Native) platforms.

## Modern core implementation

See [the architecture proposal](./docs/architecture.md) for an independent ESM primitive core, upstream Strict DOM with a Figma polyfill in `react-designapp`, static Figma exports through `react-designapp`, Loom integration, and an optional Astryx integration. The first core slice is implemented; the older packages below remain legacy experiments.

Run `pnpm install` then `pnpm check`. See [Core usage and implementation limits](./packages/core/README.md), [the Astryx-inspired recipe and agent manifest](./packages/core/examples/astryx-inspired/README.md), and [repository guidance](./AGENTS.md). Core and the shared MDX compiler are in the active workspace; service integrations such as expo-notifications are deferred.

This exists primarily as an **experimental** and **unofficial** community-led project to explore and help push forward standards and progress for **React as a platform**.

The project is inspired by and builds on top of Leland’s [`react-primitives`](https://github.com/lelandrichardson/react-primitives) project and Nicolas’s [`react-native-web`](https://github.com/necolas/react-native-web). While not integrated with, this may pull ideas/research from [`reactxp`](https://github.com/microsoft/reactxp).

Please feel free to post any questions or proposals in issues, or feel free to contact me (via issues/Twitter).

## What is `@react-platform`?

`@react-platform` is an `npm` package ecosystem of primitive components and APIs that can be used for cross-platform React codebases/libraries, with polyfills/fallbacks for platforms that don't have appropriate native/JS equivalents. 

As an example, `@react-platform/native` exports React Native components like `<ScrollView>` and `<SafeAreaView>` that fallback to `<View>` on unsupported platforms.

As this is in **alpha**, all versions are `0.x.x` and packages may be deprecated or change in the future. Where possible, we will try our best to follow semantic versioning and issue deprecation notices.

## Supported Platforms

- [`react-dom`](https://github.com/facebook/react/tree/master/packages/react-dom) – React Web
- [`react-native`](https://github.com/facebook/react-native) – React Native – iOS/Android
- [`react-native-web`](https://github.com/necolas/react-native-web) – React Native Web
- [`react-sketchapp`](https://github.com/airbnb/react-sketchapp) – React Sketch.app
- [`react-figma`](https://github.com/react-figma/react-figma) – React Figma
- [`react-native-windows`](https://github.com/microsoft/react-native-windows) – React Native Windows
- [`react-native-macos`](https://github.com/microsoft/react-native-macos) – React Native macOS (no primitives support yet)

## Planned Platforms

- [`react-native-desktop-qt`](https://github.com/status-im/react-native-desktop-qt) – React Native Qt port (Linux/macOS/Windows)

## Getting Started

Example of `@react-platform/native`, a React Native interoperability layer with polyfills and primitive fallbacks:

```sh
npm install --save @react-platform/native
```

On a React web, React Native or React Sketch.app project:

```js
import { Text, View } from 'react-primitives';
import { ScrollView, SafeAreaView, TextInput } from '@react-platform/native';

export default function HomeScreen() {
  return (
    <ScrollView style={{ flex: 1 }}>
      <SafeAreaView style={{ height: 64 }}>
        <Text>
          Header Here
        </Text>
      </SafeAreaView>
      <View>
        <TextInput initialValue="Hello World" onChangeText={(value) => console.log(value)}>
      </View>
    </ScrollView>
  )
}
```

## Terminology

### Bridge

Messaging tunnel between native code and JavaScript/React runtime.

### Layout

Yoga layout (native Flexbox port).

### Threads

Communication between threads is asynchronous.

#### UI Thread (Platform UI)

Bridge to layout thread with `view.appendChild(RCTView)`

#### Layout Thread (Shadow Tree)

React reconciliation tree.

Bridge to JavaScript thread with `[..., createView(id, RCTView, ...)]`

#### JavaScript Thread (React Runtime)

## Reading

**Talks**

- [React as a Platform: A path towards a truly cross-platform UI - Leland Richardson](https://www.youtube.com/watch?v=hNwQPJy-XZY)
- [React Native's New Architecture - Parashuram N](https://www.youtube.com/watch?v=UcqRXTriUVI)


## Contributing

Open to contributions :)

## License

[MIT](./LICENSE.md)

## Shared MDX compiler

[`@react-platform/mdx`](./packages/mdx/README.md) compiles general MDX documents with YAML metadata and source maps. It exposes an optional esbuild plugin and has no renderer dependency. `mdx-slides` owns the presentation layer; React Designapp contains a document-to-Figma example using its existing Strict DOM host. The compiler is independent of primitive core.
