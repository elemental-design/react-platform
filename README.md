# @react-platform

Build cross-platform React apps. Common primitives for all React platforms: React Native, React web, React Sketch.app, React Figma, React 360, React Native Windows, React Native macOS, etc.

This is an **experimental** project and has no relation to Facebook. This project is inspired by Leland Richardson’s [`react-primitives`](https://github.com/lelandrichardson/react-primitives) project.

Please feel free to post any questions or proposals to issues, or feel free to contact me (via issues/Twitter).

## What is `@react-platform`?

`@react-platform` is a set of primitive components and APIs that can be used across React platforms.

As an example, `@react-platform` exports React Native components like `<ScrollView>` and `<SafeAreaView>`, with polyfills for cross-platform fallbacks that don't support the native APIs for React Sketch.app, etc.

## Getting Started

As an example:

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


## Contributing

Open to contributions :)

## License


