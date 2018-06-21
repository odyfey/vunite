import Vue from 'vue'
import VueInfiniteScroll from 'vue-infinite-scroll'

import popover from 'element-ui/packages/popover/src/directive'

import { createApp } from './main'

Vue.use(VueInfiniteScroll)
Vue.directive('popover', popover)

const { app, router, store } = createApp()

if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__)
}

router.onReady(() => {
    router.beforeResolve((to, from, next) => {
        const matched = router.getMatchedComponents(to)
        const prevMatched = router.getMatchedComponents(from)

        let diffed = false
        const activated = matched.filter((c, i) => {
            return diffed || (diffed = (prevMatched[i] !== c))
        })
    
        if (!activated.length) {
            return next()
        }
    
        // todo: здесь мы должны вызвать индикатор загрузки, если используем его
    
        Promise.all(activated.map(c => {
            if (c.asyncData) {
                return c.asyncData({ store, route: to })
            }
        })).then(() => {
    
          // todo: останавливаем индикатор загрузки
    
            next()
        }).catch(next)
      })

    app.$mount('#app')
})