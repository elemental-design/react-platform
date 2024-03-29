let ReactPrimitives: {
  StyleSheet: any,
  View: any,
  Text: any,
  Image: any,
  Touchable: any,
  Easing: any,
  Animated: any,
  Dimensions: any,
  PixelRatio: any,
  Platform: any,
  inject: (_: any) => void,
};

try {
  // @ts-ignore
  ReactPrimitives = require('react-primitives');
} catch (err) {
  // FIXME: Clean-up experimental stub if react-primitives isn't installed.
  // @ts-ignore
  ReactPrimitives = require('./Core');
}

export = ReactPrimitives;