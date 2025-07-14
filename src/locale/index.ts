import dayjs from 'dayjs'
import { createI18n } from 'vue-i18n'

import zhHans from './zh-Hans.json'
import zhHant from './zh-Hant.json'
import en from './en.json'
import ja from './ja.json'
import th from './th.json'

import 'dayjs/locale/zh-cn'
import 'dayjs/locale/zh-tw'
import 'dayjs/locale/ja'
import 'dayjs/locale/th'

const messages = {
  en,
  'zh-Hans': zhHans,
  'zh-Hant': zhHant,
  ja,
  th
} as const

export type LocalesKeys = keyof typeof messages

const getDayjsLocale = (locale: LocalesKeys): string => {
  const localeMap = {
    'zh-Hans': 'zh-cn',
    'zh-Hant': 'zh-tw',
    en: 'en',
    ja: 'ja',
    th: 'th'
  }
  return localeMap[locale] || 'en'
}

let locale = getI18nLocale()

const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: locale, // 获取已设置的语言，fallback 语言需要再 manifest.config.ts 中设置
  fallbackLocale: 'en',
  messages,
  allowComposition: true
})

dayjs.locale(getDayjsLocale(locale)) // 设置 dayjs 的语言

/**
 * 可以拿到原始的语言模板，非 vue 文件使用这个方法，
 * @param { string } key 多语言的key，eg: "app.name"
 * @returns {string} 返回原始的多语言模板，eg: "{heavy}KG"
 */
export function getTemplateByKey(key: string): string {
  if (!key) {
    console.error(`[i18n] Function getTemplateByKey(), key param is required`)
    return ''
  }

  const message = messages[locale] // 拿到某个多语言的所有模板（是一个对象)
  if (Object.keys(message).includes(key)) {
    return message[key]
  }

  try {
    const keyList = key.split('.')
    return keyList.reduce((pre, cur) => {
      return pre[cur]
    }, message) as any as string
  } catch (error) {
    console.error(`[i18n] Function getTemplateByKey(), key param ${key} is not existed.`)
    return ''
  }
}

/**
 * formatI18n('我是{name},身高{detail.height},体重{detail.weight}',{name:'张三',detail:{height:178,weight:'75kg'}})
 * 暂不支持数组
 * @param template 多语言模板字符串，eg: `我是{name}`
 * @param {object | undefined} data 需要传递的数据对象，里面的key与多语言字符串对应，eg: `{name:'菲鸽'}`
 * @returns
 */
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

export function changeI18nLocale(l: LocalesKeys) {
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

/**
 * $t('introduction',{name:'张三',detail:{height:178,weight:'75kg'}})
 * => formatI18n('我是{name},身高{detail.height},体重{detail.weight}',{name:'张三',detail:{height:178,weight:'75kg'}})
 * 没有key的，可以不传 data；暂不支持数组
 * @param template 多语言模板字符串，eg: `我是{name}`
 * @param {object | undefined} data 需要传递的数据对象，里面的key与多语言字符串对应，eg: `{name:'菲鸽'}`
 * @returns
 */
export function $t(key: string, data?: any) {
  return formatI18n(getTemplateByKey(key), data)
}

export default i18n
