// @ts-ignore
import { Platform } from '@react-platform/core';

module.exports = Platform.select({
  native: () => require('react-native').ActivityIndicator,
  web: () => require('react-native-web').ActivityIndicator,
  default: () => require('./core'),
})();
