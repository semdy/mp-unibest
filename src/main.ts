import '@/style/index.scss'
import { VueQueryPlugin } from '@tanstack/vue-query'
import 'virtual:uno.css'
import { createSSRApp } from 'vue'

import App from './App.vue'
import uviewPlus from '@/uni_modules/uview-plus'
import { prototypeInterceptor, requestInterceptor, routeInterceptor } from './interceptors'
import { initRequest } from '@/utils/luch-request'
import i18n from './locale'
import store from './store'

export function createApp() {
  const app = createSSRApp(App)

  app.use(store)
  app.use(i18n)
  app.use(uviewPlus)
  // app.use(routeInterceptor)
  // app.use(requestInterceptor)
  app.use(prototypeInterceptor)
  app.use(VueQueryPlugin)

  app.config.globalProperties.$numberFormat = (num: number, locale: string = 'en-US'): string => {
    if (num === 0) {
      return num.toString()
    }
    if (!num) {
      return '-'
    }
    return num.toLocaleString(locale)
  }

  initRequest()

  return {
    app,
  }
}
