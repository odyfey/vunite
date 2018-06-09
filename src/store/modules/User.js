import Vue from 'vue'
import { DISCOURSE_SSO_PROXY } from '../../const'

const TOKEN_STORAGE = 'discourse_token'
const USERNAME_STORAGE = 'username'

const state = {
    token: localStorage.getItem(TOKEN_STORAGE) || '',
    username: localStorage.getItem(USERNAME_STORAGE) || '',
    error: ''
}

var mutations = {
    setToken: (state, token) => state.token = token,

    setUsername: (state, username) => state.username = username,

    logout(state) {
        state.token = ''
        state.username = ''
    },

    setError: (state, error) => state.error = error
}

var getters = {
    authorized: state => !!state.token,

    username: state => state.username,
}

var actions = {
    async fetchUser({ commit }, username) {
        Vue.http.get(`/users/${username}`)
            .then(response => {
                const username = response.data.users[0].username
                commit('setUsername', username)
                localStorage.setItem(USERNAME_STORAGE, username)
            })
            .catch(error => {
                commit('setError', error.data)
                localStorage.removeItem(USERNAME_STORAGE)
            })
    },

    async fetchToken({ commit, dispatch }, query) {
        Vue.http.get(`${DISCOURSE_SSO_PROXY}/getToken?sso=${query.sso}&sig=${query.sig}`, {
            responseType: 'text'
        })
        .then(async response => {
            const token = `Bearer ${response.data.token}`
            commit('setToken', token)
            localStorage.setItem(TOKEN_STORAGE, token)
            Vue.http.defaults.headers.common['Authorization'] = token

            await dispatch('fetchUser', response.data.username)
        })
        .catch(error => {
            commit('setError', error.data)
            localStorage.removeItem(TOKEN_STORAGE)
        })
    },

    logout({ commit }) {
        commit('logout')
        localStorage.removeItem(TOKEN_STORAGE)
        localStorage.removeItem(USERNAME_STORAGE)
        delete Vue.http.defaults.headers.common['Authorization']
    },

    fetchSavedToken({ commit, state }) {
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