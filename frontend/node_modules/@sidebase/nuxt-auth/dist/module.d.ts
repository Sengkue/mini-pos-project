import { NuxtModule } from 'nuxt/schema';
import { ModuleOptionsNormalized, ModuleOptions } from '../dist/runtime/types.js';
export { ModuleOptions, RefreshHandler } from '../dist/runtime/types.js';

declare const _default: NuxtModule<ModuleOptions, ModuleOptions, false>;

interface ModulePublicRuntimeConfig {
    auth: ModuleOptionsNormalized;
}
declare module '@nuxt/schema' {
    interface PublicRuntimeConfig {
        auth: ModuleOptionsNormalized;
    }
}

export { type ModulePublicRuntimeConfig, _default as default };
