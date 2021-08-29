// @ts-ignore
import { Platform } from '@react-platform/core';

module.exports = Platform.select({
  native: () => require('react-native').AccessibilityInfo,
  web: () => require('react-native-web').AccessibilityInfo,
  default: () => require('./core'),
})();
