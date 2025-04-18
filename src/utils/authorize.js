import { login, isAuthorized } from './wechat'
import { getTokenByJsCode } from '@/api'
import { refreshTokenApi } from '@/api/index'
import store from '@/store'
import { showLoading, hideLoading } from '@/utils/util'

const authorize = {
  appReady: false,
  readyCallback: [],
  loginExpiredCallback: [],
  isPending: false,
  startup(checkTokenExist, lastToken, needUnionId) {
    if (this.isPending) {
      return Promise.reject()
    }
    this.isPending = true
    return new Promise((resolve, reject) => {
      ;(async () => {
        let isLoadingShow = false
        let token = null
        let refreshToken = null
        try {
          token = this.getToken()
          if (token) {
            resolve(token)
            this.isPending = false
            return
          }
          if (checkTokenExist) {
            resolve(null)
            this.isPending = false
            return
          }
          showLoading()
          isLoadingShow = true
          if (lastToken) {
            const res = await this.refreshToken(lastToken)
            token = res.token
            refreshToken = res.refreshToken
          } else {
            const code = await login()
            const res = await getTokenByJsCode(code)
            token = res.token
          }
          if (needUnionId) {
            this.doAuthorize()
            // if (unionid) {
            //   const token = await getUserToken(openid, unionid, this.shareScene)
            //   this.saveToken(token)
            // } else {
            //   this.doAuthorize()
            // }
          } else {
            await this.saveToken(token, refreshToken)
            resolve(token)
          }
        } catch (e) {
          reject(e)
        } finally {
          this.isPending = false
          if (isLoadingShow) {
            hideLoading()
          }
        }
      })()
    })
  },

  async reStart(refreshToken, needUnionId) {
    if (this.isPending) {
      return Promise.resolve()
    }
    this.appReady = false
    this.isPending = false
    if (refreshToken) {
      const lastToken = this.getToken()
      this.resetToken()
      return this.startup(false, lastToken, needUnionId)
    }
    this.resetToken()
    return this.startup(false, null, needUnionId)
  },

  // async getUnionId() {
  //   try {
  //     const { encryptedData, iv } = await getWxUserInfo({ withCredentials: true, lang: 'zh_CN' })
  //     const res = await getWxUserInfoFromServer(this.openId, encryptedData, iv)
  //     store.commit('setUserInfo', res.datas)
  //     return res.datas
  //   } catch (errMsg) {
  //     // toast.error(errMsg)
  //     // return {}
  //     return { unionId: '' }
  //   }
  // },

  // async getToken() {
  //   const { unionId } = await this.getUnionId()
  //   if (unionId === undefined) {
  //     uni.showModal({
  //       content: '抱歉，未找到您的unionId',
  //       showCancel: false,
  //       success: () => {
  //         this.doAuthorize()
  //       }
  //     })
  //   } else {
  //     this.unionId = unionId
  //     this.requestToken()
  //   }
  // },
  //
  // async requestToken() {
  //   const token = await getUserToken(this.openId, this.unionId, this.shareScene)
  //   this.saveToken(token)
  // },

  async doAuthorize() {
    const isAuthored = await isAuthorized()
    if (isAuthored) {
      this.getToken()
    } else {
      uni.navigateTo({ url: '/pages/auth/auth' })
    }
  },

  async saveToken(token, refreshToken) {
    uni.setStorageSync('token', token)
    store.dispatch('setToken', token)
    if (refreshToken) {
      uni.setStorageSync('refreshToken', refreshToken)
    }
    this.dispatchReady()
  },

  getToken() {
    return store.state.token || uni.getStorageSync('token') || ''
  },

  getRefreshToken() {
    return uni.getStorageSync('refreshToken')
  },

  async refreshToken(token) {
    const { access, refresh } = await refreshTokenApi({
      token,
      refresh: this.getRefreshToken()
    })
    return { token: access, refreshToken: refresh }
  },

  resetToken(resetRefreshToken) {
    uni.removeStorageSync('token')
    store.dispatch('setToken', null)
    if (resetRefreshToken) {
      uni.removeStorageSync('refreshToken')
    }
  },

  onReady(callback) {
    if (this.appReady) {
      callback()
    } else {
      this.readyCallback.push(callback)
    }
  },

  onLoginExpired(callback) {
    this.loginExpiredCallback.push(() => {
      this.resetToken(true)
      callback?.()
    })
  },

  isLogin() {
    return !!this.getToken()
  },

  isReady() {
    return this.appReady
  },

  dispatchReady() {
    this.appReady = true
    this.isPending = false
    this.readyCallback.forEach(callback => {
      if (typeof callback === 'function') {
        callback.apply(this, arguments)
      }
    })
    this.readyCallback = []
  },

  dispatchLoginExpired() {
    this.loginExpiredCallback.forEach(callback => {
      if (typeof callback === 'function') {
        callback.apply(this, arguments)
      }
    })
  }
}

export default authorize
