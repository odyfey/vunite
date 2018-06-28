import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { config } from '@/config'
import ru from './ru-RU.json'
import cn from './zh-CN.json'

Vue.use(VueI18n)

export function createI18n () {
  return new VueI18n({
    locale: config.locale,
    messages: {
      'ru-RU': ru,
      'zh-CN': cn
    }
  })
}