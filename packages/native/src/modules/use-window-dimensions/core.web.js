import { useState, useEffect } from 'react';

const DEFAULTS = {
  width: undefined,
  height: undefined,
};

/* code from https://usehooks.com/useWindowSize/ */
export default function useWindowSize() {
  const isClient = typeof window === 'object';

  function getSize() {
    return {
      width: isClient
        ? window.screen.width < window.innerWidth ? window.screen.height : window.innerWidth
        : DEFAULTS.width,
      height: isClient
        ? window.screen.height < window.innerHeight ? window.screen.height : window.innerHeight
        : DEFAULTS.height,
      };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) {
      return false;
    }

    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
}
