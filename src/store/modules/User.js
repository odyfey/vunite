import Vue from "vue"
import { config } from "@/config"
import { API_KEY_STORAGE, USERINFO_STORAGE } from "@/const"

const state = {
    apiKey: "",
    userInfo: {},
    error: ""
}

const getters = {
    apiKey: state => state.apiKey,

    authorized: state => !!state.apiKey,

    username: state => (state.userInfo ? state.userInfo.username : "")
}

const mutations = {
    setApiKey: (state, key) => (state.apiKey = key),

    // info: { id, name }
    setUserInfo: (state, info) => (state.userInfo = info),

    setError: (state, error) => (state.error = error),

    clear(state) {
        state.apiKey = ""
        state.userInfo = {}
        state.error = ""
    }
}

const actions = {
    async fetchUserApiKey({ commit }, query) {
        try {
            const { data } = await Vue.http.get(
                `${config.discourse.ssoProxy}/getToken?sso=${query.sso}&sig=${
                    query.sig
                }`,
                {
                    responseType: "text"
                }
            )

            commit("setApiKey", data.api_key.key)
            localStorage.setItem(API_KEY_STORAGE, data.api_key.key)

            commit("setUserInfo", data.api_key.user)
            localStorage.setItem(
                USERINFO_STORAGE,
                JSON.stringify(data.api_key.user)
            )
        } catch (error) {
            commit("setError", error.data)
            localStorage.removeItem(API_KEY_STORAGE)
            localStorage.removeItem(USERINFO_STORAGE)
        }
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
