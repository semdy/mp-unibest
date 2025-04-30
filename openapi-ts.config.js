import { defaultPlugins } from '@hey-api/openapi-ts'

import { clientDefaultConfig, clientPluginHandler } from '@hey-api/openapi-ts'

export const defaultConfig = {
  ...clientDefaultConfig,
  _handler: clientPluginHandler,
  _handlerLegacy: () => {},
  name: '@/http/client-mp',
}

/**
 * Type helper for `@hey-api/client-custom` plugin, returns {@link Plugin.Config} object
 */
export const customClientPlugin = config => ({
  ...defaultConfig,
  ...config,
})

export default {
  input: 'http://petstore.swagger.io/v2/swagger.json',
  // input: 'https://get.heyapi.dev/hey-api/backend',
  // input: './wechat-qy.openapi.json',
  output: 'src/api/heyapi',
  plugins: [
    ...defaultPlugins,
    customClientPlugin(),
    // '@hey-api/client-fetch',
    '@tanstack/vue-query',
    {
      enums: 'javascript',
      name: '@hey-api/typescript',
    },
  ],
}
