// @ts-ignore
import { Platform } from '@react-platform/core';

const Button = Platform.select({ // @ts-ignore
  native: () => require('react-native').Button,
  web: () => require('react-native-web').Button,
  default: () => require('./core'),
})();

export default Button;