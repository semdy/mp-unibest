export default {
  includePath: ['src/components', 'src/layouts', 'src/pages', 'src/utils', 'src/App.vue'],
  excludePath: ['**/uni_modules/**'],
  rewrite: true,
  incrementalExtract: true,
  outputPath: 'src/locale/gen',
  i18nPkgImportPath: '@/locale',
  translateLangKeys: ['en', 'zh-tw', 'ja', 'id', 'lo', 'th', 'vi'],
  customTranslatedText: (text: string, toLang: string): string => {
    if (toLang === 'en') {
      const textArr = text.split(/\s+/)
      if (textArr.length <= 3) {
        return textArr
          .map(v => {
            return v.charAt(0).toUpperCase() + v.slice(1)
          })
          .join(' ')
      }
    }
    return text
  }
}
