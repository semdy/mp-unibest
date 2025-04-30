import {
  type Client,
  clientDefaultConfig,
  clientPluginHandler,
  type Plugin,
} from '@hey-api/openapi-ts';

export interface Config extends Client.Config {
  /**
   * Plugin name. Must be unique.
   */
  name: '@/http/client-mp';
}

export const defaultConfig: Plugin.Config<Config> = {
  ...clientDefaultConfig,
  _handler: clientPluginHandler,
  _handlerLegacy: () => {},
  name: '@/http/client-mp',
};

/**
 * Type helper for `@/http/client-mp` plugin, returns {@link Plugin.Config} object
 */
export const customClientPlugin: Plugin.DefineConfig<Config> = (config) => ({
  ...defaultConfig,
  ...config,
});
