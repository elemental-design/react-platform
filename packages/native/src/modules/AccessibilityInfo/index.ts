// @ts-ignore
import { Platform } from '@react-platform/core';

const AccessibilityInfo = Platform.select({ // @ts-ignore
  native: () => require('react-native').AccessibilityInfo,
  web: () => require('react-native-web').AccessibilityInfo,
  default: () => require('./core'),
})();

export default AccessibilityInfo;
