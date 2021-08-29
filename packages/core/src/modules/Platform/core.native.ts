// @ts-ignore
import { Platform as PlatformSketch } from 'react-native';

import Platform from './Platform';

Platform.inject({
  OS: PlatformSketch.OS,
  Version: PlatformSketch.Version,
});

export default Platform;
