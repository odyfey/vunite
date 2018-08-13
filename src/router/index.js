import Vue from "vue"
import Router from "vue-router"

Vue.use(Router)

export function createRouter(store, isClient) {
    const router = new Router({
        mode: "history",
        routes: [
            {
                path: "/",
                name: "Home",
                component: () => import("@/components/Category/")
            },
            {
                path: "/category/:id/:subId?",
                name: "CategoryDetail",
                component: () => import("@/components/Category/")
            },
            {
                path: "/topic/:id",
                name: "TopicDetail",
                component: () => import("@/components/Topic/")
            },
            {
                path: "/notifications",
                name: "Notification",
                component: () => import("@/components/Notification/")
            },
            {
                path: "/tags",
                name: "TagList",
                component: () => import("@/components/TagList/")
            },
            {
                path: "/search",
                name: "Search",
                component: () => import("@/components/Search/")
            }
        ]
    })

    if (isClient) {
        function hasQueryParams(route) {
            return !!Object.keys(route.query).length
        }

        router.beforeEach((to, from, next) => {
            if (hasQueryParams(to) && to.query.sso) {
                store.dispatch("User/fetchBearerToken", to.query)
                next({
                    path: "/"
                })
            } else {
                next()
            }
        })
    }

    return router
}
