import {
  type Client,
  type DefinePlugin,
  definePluginConfig,
  clientDefaultConfig,
  clientDefaultMeta,
  clientPluginHandler,
  defaultPlugins,
  defineConfig
} from '@hey-api/openapi-ts'

export type Config = Client.Config & {
  /**
   * Plugin name. Must be unique.
   */
  name: '@/http/client-mp'
}

export type CustomClientPlugin = DefinePlugin<Config>

const defaultConfig: CustomClientPlugin['Config'] = {
  ...clientDefaultMeta,
  config: {
    ...clientDefaultConfig,
    bundle: false
  },
  handler: clientPluginHandler as unknown as CustomClientPlugin['Handler'],
  name: '@/http/client-mp'
}

const customClientPlugin = definePluginConfig(defaultConfig)

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
    '@hey-api/schemas',
    '@tanstack/vue-query',
    {
      enums: 'javascript',
      name: '@hey-api/typescript'
    }
    // {
    //   dates: true,
    //   name: '@hey-api/transformers',
    // },
    // {
    //   name: '@hey-api/sdk',
    //   transformer: true,
    // },
  ]
})
