import type { Client, Config } from './types'
import { buildUrl, createConfig, mergeConfigs, mergeHeaders } from './utils'
import { http, type HttpRequestConfig } from '@/utils/luch-request'

export const createClient = (config: Config = {}): Omit<Client, 'interceptors'> => {
  let _config = mergeConfigs(createConfig(), config)

  const getConfig = (): Config => ({ ..._config })

  const setConfig = (config: Config): Config => {
    _config = mergeConfigs(_config, config)
    return getConfig()
  }

  // @ts-expect-error
  const request: Client['request'] = options => {
    const opts = {
      ..._config,
      ...options,
      headers: mergeHeaders(_config.headers, options.headers),
    }

    // if (opts.body && opts.bodySerializer) {
    //   opts.body = opts.bodySerializer(opts.body)
    // }

    const url = buildUrl(opts)
    const { headers, body, query, baseUrl, ...restOpts } = opts

    const requestOpts = {
      ...restOpts,
      url,
      header: headers,
      data: body,
      params: query,
      baseURL: baseUrl,
    } as unknown as HttpRequestConfig

    return http.request(requestOpts)
  }

  return {
    buildUrl,
    connect: options => request({ ...options, method: 'CONNECT' }),
    delete: options => request({ ...options, method: 'DELETE' }),
    get: options => request({ ...options, method: 'GET' }),
    getConfig,
    head: options => request({ ...options, method: 'HEAD' }),
    options: options => request({ ...options, method: 'OPTIONS' }),
    patch: options => request({ ...options, method: 'PATCH' }),
    post: options => request({ ...options, method: 'POST' }),
    put: options => request({ ...options, method: 'PUT' }),
    request,
    setConfig,
    trace: options => request({ ...options, method: 'TRACE' }),
  }
}
