import Vue from 'vue'
import { DISCOURSE_SSO_PROXY, TOKEN_STORAGE, USERINFO_STORAGE } from '@/const'

const namespaced = true

const state = {
    token: '',
    userInfo: {},
    error: ''
}

const getters = {
    token: state => state.token,

    authorized: state => !!state.token,

    username: state => ( state.userInfo ? state.userInfo.name : '' ),
}

const mutations = {
    setToken: (state, token) => state.token = token,

    // info: { id, name }
    setUserInfo: (state, info) => state.userInfo = info,

    setError: (state, error) => state.error = error,

    clear(state) {
        state.token = ''
        state.userInfo = {}
        state.error = ''
    },
}

const actions = {
    async fetchUser({ commit }, username) {
        try {
            const response = await Vue.http.get(`/users/${username}.json`)

            const user = response.data.users[0]
            const info = {
                id: user.id,
                name: user.username
            }

            commit('setUserInfo', info)
            localStorage.setItem(USERINFO_STORAGE, JSON.stringify(info))
        }
        catch (error) {
            commit('setError', error.data)
            localStorage.removeItem(USERINFO_STORAGE)
        }
    },

    async fetchToken({ commit, dispatch }, query) {
        try {
            const response = await Vue.http.get(`${DISCOURSE_SSO_PROXY}/getToken?sso=${query.sso}&sig=${query.sig}`, {
                responseType: 'text'
            })

            const token = response.data.token
            commit('setToken', token)
            localStorage.setItem(TOKEN_STORAGE, token)

            dispatch('fetchUser', response.data.username)
        }
        catch (error) {
            commit('setError', error.data)
            localStorage.removeItem(TOKEN_STORAGE)
        }
    }
}

export default {
    namespaced,
    state,
    getters,
    mutations,
    actions,
}