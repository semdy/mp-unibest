import {
  defineConfig,
  defaultPlugins,
  clientDefaultConfig,
  clientPluginHandler,
} from '@hey-api/openapi-ts'

const defaultConfig = {
  ...clientDefaultConfig,
  _handler: clientPluginHandler,
  _handlerLegacy: () => {},
  name: '@/http/client-mp',
}

const customClientPlugin = config => ({
  ...defaultConfig,
  ...config,
})

export default defineConfig({
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
})
