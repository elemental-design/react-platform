// We're assuming that the web module/main entrypoint will be resolved by the web build system
// To fall back to the (previously in) react-native-web polyfill implementation
const AsyncStorage = require('@react-native-community/async-storage');

module.exports = AsyncStorage;
