const { hasOwnProperty } = Object.prototype;

const Platform = {
  OS: 'unknown',
  Version: 0,
  select: (obj: any) => {
    if (hasOwnProperty.call(obj, Platform.OS)) {
      return obj[Platform.OS];
    }
    return obj.default;
  },
  inject: (platform: any) => {
    // Use bracket accessor notation as workaround for
    // https://github.com/facebook/metro-bundler/issues/27
    Platform['OS'] = platform.OS; // eslint-disable-line dot-notation
    Platform['Version'] = platform.Version; // eslint-disable-line dot-notation
  },
};

export { Platform };
export default Platform;
