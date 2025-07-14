import { createSSRApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import uviewPlus from 'uview-plus'

import App from './App.vue'
import { requestInterceptor /* , routeInterceptor */ } from './interceptors'
import i18n from './locale'
import store from './store'
import 'virtual:uno.css'

export function createApp() {
  const app = createSSRApp(App)

  app.use(store)
  app.use(i18n)
  // app.use(routeInterceptor)
  app.use(requestInterceptor)
  app.use(VueQueryPlugin)

  // @ts-expect-error uviewPlus
  app.use(uviewPlus, () => {
    return {
      options: {
        config: {
          iconUrl: '/static/fonts/font_2225171_8kdcwk4po24.ttf'
        }
      }
    }
  })

  app.config.globalProperties.$numberFormat = (num: number, locale: string = 'en-US'): string => {
    if (num === 0) {
      return num.toString()
    }
    if (!num) {
      return '-'
    }
    return num.toLocaleString(locale)
  }

  return {
    app
  }
}
