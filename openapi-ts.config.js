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
  // input: './wechat-qy.openapi.json',
  output: './src/api/heyapi',
  // output: {
  //   format: 'prettier',
  //   lint: 'eslint',
  //   path: './src/api/heyapi',
  // },
  plugins: [
    ...defaultPlugins,
    customClientPlugin(),
    // '@hey-api/client-fetch',
    '@hey-api/schemas',
    '@tanstack/vue-query',
    {
      enums: 'javascript',
      name: '@hey-api/typescript',
    },
    // {
    //   dates: true,
    //   name: '@hey-api/transformers',
    // },
    // {
    //   name: '@hey-api/sdk',
    //   transformer: true,
    // },
  ],
})
