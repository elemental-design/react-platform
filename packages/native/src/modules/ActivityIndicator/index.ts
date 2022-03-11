// @ts-ignore
import { Platform } from '@react-platform/core';

const ActivityIndicator = Platform.select({ // @ts-ignore
  native: () => require('react-native').ActivityIndicator,
  web: () => require('react-native-web').ActivityIndicator,
  default: () => require('./core'),
})();

export default ActivityIndicator;
