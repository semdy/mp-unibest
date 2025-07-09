import { login, isAuthorized } from './wechat'
import { getTokenByJsCode, refreshTokenApi } from '@/api'
import { useTokenStore } from '@/store'
import { showLoading, hideLoading } from '@/utils/toast'

type noop = (...args: any[]) => void

const authorize = {
  appReady: false,
  readyCallback: [] as noop[],
  loginExpiredCallback: [] as noop[],
  isPending: false,
  startup(checkTokenExist?: boolean, lastToken?: string | null, needUnionId?: boolean) {
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
            token = (res as any).token
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

  async reStart(refreshToken?: boolean, needUnionId?: boolean) {
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
  //     const userStore = useUserStore()
  //     userStore.setUserInfo(res.datas)
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

  async saveToken(token: string, refreshToken?: boolean) {
    const tokenStore = useTokenStore()
    uni.setStorageSync('token', token)
    tokenStore.setToken(token)
    if (refreshToken) {
      uni.setStorageSync('refreshToken', refreshToken)
    }
    this.dispatchReady()
  },

  getToken() {
    const tokenStore = useTokenStore()
    return tokenStore.token || uni.getStorageSync('token') || ''
  },

  getRefreshToken() {
    return uni.getStorageSync('refreshToken')
  },

  async refreshToken(token: string) {
    const res: any = await refreshTokenApi({
      token,
      refresh: this.getRefreshToken()
    })
    return { token: res.access, refreshToken: res.refresh }
  },

  resetToken(resetRefreshToken?: boolean) {
    const tokenStore = useTokenStore()
    uni.removeStorageSync('token')
    tokenStore.setToken(null)
    if (resetRefreshToken) {
      uni.removeStorageSync('refreshToken')
    }
  },

  onReady(callback: noop) {
    if (this.appReady) {
      callback()
    } else {
      this.readyCallback.push(callback)
    }
  },

  onLoginExpired(callback: noop) {
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

  dispatchReady(...args: any[]) {
    this.appReady = true
    this.isPending = false
    const self = this
    this.readyCallback.forEach(function (callback) {
      if (typeof callback === 'function') {
        callback.apply(self, args)
      }
    })
    this.readyCallback = []
  },

  dispatchLoginExpired(...args: any[]) {
    const self = this
    this.loginExpiredCallback.forEach(function (callback) {
      if (typeof callback === 'function') {
        callback.apply(self, args)
      }
    })
  }
}

export default authorize
