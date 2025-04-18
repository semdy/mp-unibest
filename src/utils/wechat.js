import { hideLoading, showLoading } from '@/utils/util'

let _isQyWechat

export function isAuthorized() {
  return new Promise(resolve => {
    uni.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          resolve(true)
        } else {
          resolve(false)
        }
      },
      fail: () => {
        resolve(false)
      }
    })
  })
}

export function isQyWechat() {
  if (_isQyWechat !== undefined) {
    return _isQyWechat
  }
  const res = uni.getSystemInfoSync()
  return res.environment && res.environment === 'wxwork'
}

export function requestAuthorize(scope) {
  return new Promise((resolve, reject) => {
    uni.getSetting({
      success(res) {
        if (!res.authSetting[scope]) {
          uni.authorize({
            scope,
            success() {
              resolve()
            },
            fail(e) {
              reject(e)
            }
          })
        } else {
          resolve()
        }
      },
      fail(e) {
        reject(e)
      }
    })
  })
}

/**
 *
 * @param withSubscriptions boolean 是否获取用户订阅消息的订阅状态
 * @returns {UniNamespace.PromisifySuccessResult<{withSubscriptions: boolean}, UniNamespace.GetSettingOptions>}
 */
export function getSetting(withSubscriptions) {
  return uni.getSetting({ withSubscriptions: !!withSubscriptions })
}

export function login() {
  return new Promise((resolve, reject) => {
    const login = isQyWechat() ? uni.qy.login : uni.login
    login({
      success(res) {
        if (res.code) {
          resolve(res.code)
        } else {
          reject(res.errMsg)
        }
      },
      fail() {
        reject('登录接口调用失败')
      }
    })
  })
}

export function checkSession() {
  if (isQyWechat()) {
    return uni.qy.checkSession()
  }
  return uni.checkSession()
}

export function getWxUserInfo(options = {}) {
  return new Promise((resolve, reject) => {
    uni.getUserInfo({
      withCredentials: options.withCredentials || false,
      lang: options.lang || 'en',
      success(res) {
        resolve(res)
      },
      fail() {
        reject('用户拒绝授权')
      }
    })
  })
}

export function downloadFile(url, params = {}) {
  return new Promise((resolve, reject) => {
    uni.downloadFile({
      ...params,
      url,
      success: res => {
        if (res.statusCode === 200) {
          resolve(res)
        } else {
          reject(new Error('图片下载状态异常'))
        }
      },
      fail: e => {
        reject(e)
      }
    })
  })
}

export function saveImageToPhotosAlbum(filePath, downloadParams) {
  return new Promise((resolve, reject) => {
    ;(async () => {
      if (/^https?:\/\//.test(filePath)) {
        try {
          showLoading()
          const { tempFilePath } = await downloadFile(filePath, downloadParams)
          filePath = tempFilePath
        } catch (e) {
          reject(e)
        } finally {
          hideLoading()
        }
      }
      uni.saveImageToPhotosAlbum({
        filePath,
        success: resolve,
        fail: e => {
          reject(e)
        }
      })
    })()
  })
}

export function uploadFile(url, filePath, params, header) {
  showLoading('上传中...')

  const defHeaders = {
    'content-type': 'multipart/form-data',
    token: uni.getStorageSync('token')
  }

  for (let i in params) {
    params[i] = typeof params[i] !== 'string' ? JSON.stringify(params[i]) : params[i]
  }

  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: url,
      filePath: filePath,
      name: 'file',
      header: Object.assign(defHeaders, header),
      formData: params,
      success(res) {
        if (res.statusCode === 200) {
          const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
          resolve(data)
        } else {
          reject(res)
        }
      },
      fail() {
        reject('上传接口调用失败')
      },
      complete() {
        hideLoading()
      }
    })
  })
}

/**
 * @param tmplIds string[] 模板消息id数组
 * @returns {Promise<unknown>}
 */
export function requestSubscribeMessage(tmplIds) {
  return new Promise((resolve, reject) => {
    uni.requestSubscribeMessage({
      tmplIds,
      success: resolve,
      fail: reject
    })
  })
}
