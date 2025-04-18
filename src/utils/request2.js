import Request from 'luch-request'
import { toast, delay } from '@/utils/util'
import authorize from '@/utils/authorize'
import { getServerUrl } from '@/config'

const http = new Request()

const origHttpGet = http.get

// 重写get方法，保持跟post方法传参一致
http.get = (url, params, config) => {
  return origHttpGet.call(http, url, { params, ...config })
}

function withAuthorizeInterceptor(config) {
  return new Promise(resolve => {
    authorize.onReady(() => {
      config.header.Authorization = `JWT ${authorize.getToken()}`
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
      config.baseURL = config.custom.server || getServerUrl()
      config.data = config.data || {}
      if (config?.custom?.auth !== false) {
        const token = config.data.token || authorize.getToken()
        config.header.Authorization = `JWT ${token}`
        config.header.lang = 'zh_cn'
        if (!token) {
          return withAuthorizeInterceptor(config)
        }
      }
      return config
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
        let msg
        if (response.msg) {
          msg = response.msg
        } else if (response.data) {
          msg = response.data.msg || response.data.message
        } else if (response.message) {
          msg = response.message
        } else {
          msg = response.errMsg || 'unknown error'
        }
        toast.error(msg)
        console.error(response)
      }
      //（statusCode !== 200）
      return Promise.reject(response)
    }
  )
}

export { initRequest, http }
