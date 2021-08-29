// @ts-ignore
import { Platform } from '@react-platform/core';

module.exports = Platform.select({
  native: () => require('react-native').Button,
  web: () => require('react-native-web').Button,
  default: () => require('./core'),
})();
