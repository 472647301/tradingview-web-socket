import { ElHeader, ElMain, ElInput, ElSelect, ElOption } from 'element-plus'
import zhCN from 'element-plus/lib/locale/lang/zh-cn'
import zhTW from 'element-plus/lib/locale/lang/zh-tw'

import locale from 'element-plus/lib/locale'

const elementLang = {
  'zh-cn': zhCN,
  'zh-tw': zhTW,
}
const component = [ElHeader, ElMain, ElInput, ElSelect, ElOption]

import { createI18n } from 'vue-i18n'

const loadLocaleMessages = () => {
  const locales = require.context(
    '../locales',
    true,
    /[A-Za-z0-9-_,\s]+\.json?$/i
  )
  const messages = {}
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = {
        ...locales(key),
        ...(elementLang[locale] || {}),
      }
    }
  })
  return messages
}

const nowLang = window.localStorage.getItem('lang') || 'zh-tw'

/** [i18n] plugin */
export const i18n = createI18n({
  locale: nowLang,
  messages: loadLocaleMessages(),
})
/** [element plus] plusin */
export default (app) => {
  locale.use(elementLang[nowLang]) //element lang
  component.forEach((e) => {
    app.use(e)
    return null
  })
}
