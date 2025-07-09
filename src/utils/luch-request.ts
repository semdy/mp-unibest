import Request, {
  type HttpParams,
  type HttpRequestConfig,
  type HttpRequestTask,
  type HttpData,
  type HttpTask,
  type HttpUploadTask,
  type HttpDownloadTask
} from 'luch-request'
import { delay } from '@/utils/util'
import { toast } from '@/utils/toast'
import authorize from '@/utils/authorize'
import { getEnvBaseUrl } from '@/utils'

export type { HttpRequestConfig }

declare class HttpRequest extends Request {
  request<T = any, D = HttpRequestTask>(config: HttpRequestConfig<D>): Promise<T>

  get<T = any, D = HttpRequestTask>(url: string, params?: HttpParams, config?: HttpRequestConfig<D>): Promise<T>

  delete<T = any, D = HttpRequestTask>(url: string, data?: HttpData, config?: HttpRequestConfig<D>): Promise<T>

  head<T = any, D = HttpRequestTask>(url: string, data?: HttpData, config?: HttpRequestConfig<D>): Promise<T>

  options<T = any, D = HttpRequestTask>(url: string, data?: HttpData, config?: HttpRequestConfig<D>): Promise<T>

  post<T = any, D = HttpRequestTask>(url: string, data?: HttpData, config?: HttpRequestConfig<D>): Promise<T>

  put<T = any, D = HttpRequestTask>(url: string, data?: HttpData, config?: HttpRequestConfig<D>): Promise<T>

  connect<T = any, D = HttpRequestTask>(url: string, data?: HttpData, config?: HttpRequestConfig<D>): Promise<T>

  trace<T = any, D = HttpRequestTask>(url: string, data?: HttpData, config?: HttpRequestConfig<D>): Promise<T>

  upload<T = any, D = HttpUploadTask>(url: string, config?: HttpRequestConfig<D>): Promise<T>

  download<T = any, D = HttpDownloadTask>(url: string, config?: HttpRequestConfig<D>): Promise<T>

  middleware<T = any, D = HttpTask>(config: HttpRequestConfig<D>): Promise<T>
}

const http = new Request() as HttpRequest

const origHttpGet = http.get

// 重写get方法，保持跟post方法传参一致
http.get = <T = any, D = HttpRequestTask>(
  url: string,
  params?: HttpParams,
  config?: HttpRequestConfig<D>
): Promise<T> => {
  return origHttpGet.call(http, url, { params, ...config }) as Promise<T>
}

function withAuthorizeInterceptor(config: HttpRequestConfig) {
  return new Promise(resolve => {
    authorize.onReady(() => {
      config.header!.Authorization = `JWT ${authorize.getToken()}`
      resolve(config)
    })
  })
}

function initRequest() {
  // http.setConfig(config => {
  //   config.custom.auth = true
  //   return config
  // })

  http.interceptors.request.use(
    config => {
      config.baseURL = config.custom?.server ?? getEnvBaseUrl()
      config.data = config.data || {}
      if (config?.custom?.auth !== false) {
        const token = config.data.token || authorize.getToken()
        config.header = config.header || {}
        config.header.Authorization = `JWT ${token}`
        config.header.lang = 'zh_cn'
        if (!token) {
          return withAuthorizeInterceptor(config) as Promise<HttpRequestConfig>
        }
      }
      return config as Promise<HttpRequestConfig>
    },
    config => {
      return Promise.reject(config)
    }
  )

  http.interceptors.response.use(
    response => {
      const data = response.data
      const custom = response.config?.custom ?? {}
      if (data.code !== 200) {
        // request again
        if (data.code === 10014) {
          return delay(300).then(() => {
            return http.request(response.config)
          })
        }
        // token过期或token错误
        if (data.code === 401) {
          // 如果刷新token也401，通知登录过期
          if (custom.refreshToken) {
            authorize.dispatchLoginExpired()
            return Promise.reject(data)
          }
          authorize.reStart(true)
          return http.request(response.config)
        }
        if (custom.toast !== false) {
          toast.error(data.msg || data.message)
        }
        // 如果需要catch返回，则进行reject
        if (custom.catch !== false) {
          return Promise.reject(data)
        } else {
          // 否则返回一个pending中的promise，请求不会进入catch中
          return Promise.resolve(data)
        }
      }
      return data.data || {}
    },
    response => {
      if (!response) {
        return Promise.reject(response)
      }
      const custom = response.config?.custom ?? {}
      if (response.statusCode === 401) {
        if (custom.refreshToken) {
          authorize.dispatchLoginExpired()
          return Promise.reject(response)
        }
        authorize.reStart(true)
        return http.request(response.config)
      }
      if (custom.toast !== false) {
        let msg: string
        if ('msg' in response) {
          msg = response.msg as string
        } else if ('data' in response) {
          msg = response.data.msg || response.data.message
        } else if ('message' in response) {
          msg = response.message as string
        } else {
          msg = response.errMsg || 'unknown error'
        }
        toast.error(msg)
        console.error(response)
      }
      // （statusCode !== 200）
      return Promise.reject(response)
    }
  )
}

export { initRequest, http }
