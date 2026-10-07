import host from './host.js';
import { createPlatform } from '../contracts.js';
export const Platform = createPlatform('native', host.Platform.OS);
