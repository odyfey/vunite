import Vue from 'vue'
import { DISCOURSE_SSO_PROXY } from '../../const'

const TOKEN_STORAGE = 'discourse_token'
const USERINFO_STORAGE = 'user_info'

const state = {
    token: localStorage.getItem(TOKEN_STORAGE) || '',
    userInfo: JSON.parse( localStorage.getItem(USERINFO_STORAGE) ) || {},
    error: ''
}

var mutations = {
    setToken: (state, token) => state.token = token,

    // info: { id, name }
    setUserInfo: (state, info) => state.userInfo = info,

    logout(state) {
        state.token = ''
        state.userInfo = {}
    },

    setError: (state, error) => state.error = error
}

var getters = {
    authorized: state => !!state.token,

    username: state => state.userInfo.name,
}

var actions = {
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

            const token = `Bearer ${response.data.token}`
            commit('setToken', token)
            localStorage.setItem(TOKEN_STORAGE, token)
            Vue.http.defaults.headers.common['Authorization'] = token

            dispatch('fetchUser', response.data.username)
        }
        catch (error) {
            commit('setError', error.data)
            localStorage.removeItem(TOKEN_STORAGE)
        }
    },

    logout({ commit, state }) {
        //requires admin api key: https://meta.discourse.org/t/discourse-sso-logout/28509/21
        //Vue.http.post(`/admin/users/${state.userInfo.id}/log_out`)

        commit('logout')
        localStorage.removeItem(TOKEN_STORAGE)
        localStorage.removeItem(USERINFO_STORAGE)
        delete Vue.http.defaults.headers.common['Authorization']
    },

    fetchStorage({ commit, state }) {
        if (state.token)
            Vue.http.defaults.headers.common['Authorization'] = state.token
    },
}

export default {
  state,
  mutations,
  getters,
  actions,
};