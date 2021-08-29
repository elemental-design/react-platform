// @ts-ignore
import { Platform } from '@react-platform/core';

module.exports = Platform.select({
  native: () => require('react-native').FlatList,
  web: () => require('react-native-web').FlatList,
  default: () => require('./core'),
})();
