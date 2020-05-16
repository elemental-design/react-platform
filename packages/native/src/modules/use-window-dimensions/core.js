let useWindowDimensions;

const DEFAULTS = {
  width: undefined,
  height: undefined,
}

if (typeof window !== 'undefined') {
  useWindowDimensions = require('./core.web');
} else {
  // Stub for hook
  useWindowDimensions = () => ({ width: DEFAULTS.width, height: DEFAULTS.height });
};

module.exports = useWindowDimensions;

