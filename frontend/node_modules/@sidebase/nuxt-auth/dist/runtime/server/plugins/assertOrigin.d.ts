/**
 * Due to an upstream bug in Nuxt 3 we need to stub the plugin here, track: https://github.com/nuxt/nuxt/issues/18556
 */
import type { NitroApp } from 'nitropack/types';
type NitroAppPlugin = (nitro: NitroApp) => void;
declare const _default: NitroAppPlugin;
export default _default;
