// @ts-ignore
import { Platform } from '@react-platform/core';

const FlatList = Platform.select({ // @ts-ignore
  native: () => require('react-native').FlatList,
  web: () => require('react-native-web').FlatList,
  default: () => require('./core'),
})();

export default FlatList;
