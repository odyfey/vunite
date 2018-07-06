import Vue from 'vue'
import VueAffix from 'vue-affix'
import VueScrollTo from 'vue-scrollto'
import * as ElementUI from 'element-ui'

import axios from 'axios'
import moment from 'moment'
import fontawesome from '@fortawesome/fontawesome'
import faRegular from '@fortawesome/fontawesome-free-regular'
import faSolid from '@fortawesome/fontawesome-free-solid'

import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
import 'mavon-editor/dist/css/index.css'
import '@/styles/normalize.css'
import '@/styles/post.css'
import '@/styles/editor.css'

import App from './App'
import { createRouter } from './router'
import { createStore } from './store'
import { createI18n } from './i18n'
import { sync } from 'vuex-router-sync'
import { config } from './config'

fontawesome.library.add(faRegular)
fontawesome.library.add(faSolid)
moment.locale(config.locale)

export function createApp({ isClient }) {
    Vue.config.productionTip = false

    Vue.use(VueAffix)
    Vue.use(VueScrollTo)
    Vue.use(ElementUI)

    const store = createStore()
    const router = createRouter(store, isClient)
    const i18n = createI18n()

    sync(store, router)

    const httpOpts = {
        baseURL: config.discourse.backend,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        },
        responseType: 'json',
        withCredentials: true,
    }

    let _http = axios.create(httpOpts)
    _http.interceptors.request.use(request => {
        const token = store.getters['bearer']

        if (token)
            request.headers.common['Authorization'] = `Bearer ${token}`
        else
            delete request.headers.common['Authorization']

        return request
    })

    Vue.http = Vue.prototype.$http = _http

    /* eslint-disable no-new */
    const app = new Vue({
        router,
        store,
        i18n,
        render: h => h(App)
    })

    return { app, router, store }
}
