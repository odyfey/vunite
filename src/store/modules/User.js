import Vue from 'vue'
import { DISCOURSE_SSO_PROXY } from '../../const'

const TOKEN_STORAGE_NAME = 'discourse_token'

const state = {
    token: localStorage.getItem(TOKEN_STORAGE_NAME) || '',
    username: '',
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
    async fetchToken({ commit, dispatch }, query) {
        Vue.http.get(`${DISCOURSE_SSO_PROXY}/getToken?sso=${query.sso}&sig=${query.sig}`, {
            responseType: 'text'
        })
        .then(response => {
            const token = `Bearer ${response.data}`
            commit('setToken', token)
            localStorage.setItem(TOKEN_STORAGE_NAME, token)
            Vue.http.defaults.headers.common['Authorization'] = token

            //todo: fetch username: await dispatch
        })
        .catch(error => {
            commit('setError', error.data)
            localStorage.removeItem(TOKEN_STORAGE_NAME)
        })
    },

    logout({ commit }) {
        commit('logout')
        localStorage.removeItem(TOKEN_STORAGE_NAME)
        delete Vue.http.defaults.headers.common['Authorization']
    },

    fetchSavedToken({ commit, state }) {
        if (state.token)
            Vue.http.defaults.headers.common['Authorization'] = token
    },
}

export default {
  state,
  mutations,
  getters,
  actions,
};