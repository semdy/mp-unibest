import dayjs from 'dayjs'
import { createI18n } from 'vue-i18n'

import en from './en.json'
import ja from './ja.json'
import th from './th.json'
import id from './id.json'
import lo from './lo.json'
import vi from './vi.json'
import zhHans from './zh-Hans.json'
import zhHant from './zh-Hant.json'

import en_gen from './gen/en.json'
import ja_gen from './gen/ja.json'
import th_gen from './gen/th.json'
import id_gen from './gen/id.json'
import lo_gen from './gen/lo.json'
import vi_gen from './gen/vi.json'
import zhHans_gen from './gen/zh-cn.json'
import zhHant_gen from './gen/zh-tw.json'

import 'dayjs/locale/zh-cn'
import 'dayjs/locale/zh-tw'
import 'dayjs/locale/ja'
import 'dayjs/locale/th'

const messages = {
  'zh-Hans': { ...zhHans, ...zhHans_gen },
  'zh-Hant': { ...zhHant, ...zhHant_gen },
  en: { ...en, ...en_gen },
  ja: { ...ja, ...ja_gen },
  th: { ...th, ...th_gen },
  id: { ...id, ...id_gen },
  lo: { ...lo, ...lo_gen },
  vi: { ...vi, ...vi_gen }
} as const

export type LocalesKeys = keyof typeof messages

export const languageList = [
  { value: 'zh-Hans', name: '简体中文' },
  { value: 'zh-Hant', name: '繁体中文' },
  { value: 'en', name: 'English' },
  { value: 'id', name: 'Bahasa Indonesia' },
  { value: 'ja', name: '日本語' },
  { value: 'lo', name: 'ພາສາລາວ' },
  { value: 'th', name: 'แบบไทย' },
  { value: 'vi', name: 'Tiếng Việt' }
]

function getDayjsLocale(locale: LocalesKeys): string {
  const localeMap = {
    'zh-Hans': 'zh-cn',
    'zh-Hant': 'zh-tw'
  }
  return localeMap[locale] || locale
}

let locale = getI18nLocale()

const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale, // 获取已设置的语言，fallback 语言需要再 manifest.config.ts 中设置
  fallbackLocale: 'en',
  messages,
  globalInjection: true, // 全局注入 $t 方法
  allowComposition: true
})

dayjs.locale(getDayjsLocale(locale)) // 设置 dayjs 的语言

export function getTemplateByKey(key: string): string {
  if (!key) {
    console.error(`[i18n] Function getTemplateByKey(), key param is required`)
    return ''
  }

  const message = messages[locale] // 拿到某个多语言的所有模板（是一个对象)
  if (message[key] !== undefined) {
    return message[key]
  }

  try {
    return key.split('.').reduce((pre, cur) => pre[cur], message) as any as string
  } catch (error) {
    console.error(`[i18n] Function getTemplateByKey(), key param ${key} is not existed.`)
    return ''
  }
}

function formatI18n(template: string, data?: any) {
  return template.replace(/\{([^}]+)\}/g, (match, key: string) => {
    // console.log( match, key) // => { detail.height }  detail.height
    const arr = key.trim().split('.')
    let result = data
    while (arr.length) {
      const first = arr.shift()
      if (first !== undefined) {
        result = result[first]
      }
    }
    return result
  })
}

export function setI18nLocale(l: LocalesKeys) {
  locale = l
  i18n.global.locale.value = l
  dayjs.locale(getDayjsLocale(l))
  uni.setLocale(l)
  // uni.setStorageSync('locale', l)
  console.log(`[i18n] Language changed to ${l}`)
}

export function getI18nLocale(): LocalesKeys {
  // const locale = uni.getStorageSync('locale') as LocalesKeys
  // if (locale) {
  //   return locale
  // }
  return uni.getLocale() as LocalesKeys
}

export function $t(key: string, data?: any) {
  return formatI18n(getTemplateByKey(key), data)
}

export default i18n
