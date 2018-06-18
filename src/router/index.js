import Vue from 'vue'
import Router from 'vue-router'

import { createStore } from '@/store'

Vue.use(Router)

export function createRouter () {
    const router = new Router({
        mode: 'history',
        routes: [
            {
                path: '/',
                name: 'Home',
                component: () => import('@/components/Home'),
            },
            {
                path: '/category/:id/:subId?',
                name: 'CategoryDetail',
                component: () => import('@/components/Category'),
            },
            {
                path: '/topic/:id',
                name: 'TopicDetail',
                component: () => import('@/components/Topic'),
            },
            {
                path: '/notifications',
                name: 'Notification',
                component: () => import('@/components/Notification'),
            },
            {
                path: '/tags',
                name: 'TagList',
                component: () => import('@/components/TagList'),
            },
            {
                path: '/search',
                name: 'Search',
                component: () => import('@/components/Search'),
            }
        ],
    })

    function hasQueryParams(route) {
        return !!Object.keys(route.query).length
    }

    router.beforeEach((to, from, next) => {
        if ( hasQueryParams(to) ) {
            const store = createStore()
            store.dispatch('fetchToken', to.query)
            next({
                path: '/'
            })
        }

        next()
    })


    return router
}
