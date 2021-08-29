// @ts-ignore
import { Platform } from '@react-platform/core';

export default Platform.select({
  native: () => require('react-native').PixelRatio,
  web: () => require('react-native-web').PixelRatio,
  default: () => require('./core'),
})();
