import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { locale } from '@/config'
import ru from './ru-RU.json'
import cn from './zh-CN.json'

Vue.use(VueI18n)

export function createI18n () {
  return new VueI18n({
    locale: locale,
    messages: {
      'ru-RU': ru,
      'zh-CN': cn
    }
  })
}