import Vue from 'vue'
import { config } from '@/config'
import { TOKEN_STORAGE, API_KEY_STORAGE, USERINFO_STORAGE } from '@/const'

const namespaced = true

const state = {
    bearer: '',
    apiKey: '',
    userInfo: {},
    error: ''
}

const getters = {
    bearer: state => state.bearer,

    apiKey: state => state.apiKey,

    authorized: state => !!state.bearer,

    username: state => ( state.userInfo ? state.userInfo.name : '' ),
}

const mutations = {
    setBearer: (state, bearer) => state.bearer = bearer,

    setApiKey: (state, key) => state.apiKey = key,

    // info: { id, name }
    setUserInfo: (state, info) => state.userInfo = info,

    setError: (state, error) => state.error = error,

    clear(state) {
        state.bearer = ''
        state.apiKey = ''
        state.userInfo = {}
        state.error = ''
    },
}

const actions = {
    async generateApiKey({ commit, state }) {
        try {
            const { data } = await Vue.http.get(`${config.discourse.backend}/admin/users/${state.userInfo.id}/generate_api_key?api_key=${config.discourse.apiKey}&api_username=${state.userInfo.name}`)

            commit('setApiKey', data.api_key.key)
            localStorage.setItem(API_KEY_STORAGE, data.api_key.key)
        }
        catch (error) {
            commit('setError', error.data)
            localStorage.removeItem(API_KEY_STORAGE)
        }
    },

    async fetchUser({ commit, dispatch }, username) {
        try {
            const response = await Vue.http.get(`/users/${username}.json`)

            const user = response.data.users[0]
            const info = {
                id: user.id,
                name: user.username
            }

            commit('setUserInfo', info)
            localStorage.setItem(USERINFO_STORAGE, JSON.stringify(info))

            dispatch('generateApiKey')
        }
        catch (error) {
            commit('setError', error.data)
            localStorage.removeItem(USERINFO_STORAGE)
        }
    },

    async fetchBearerToken({ commit, dispatch }, query) {
        try {
            const { data } = await Vue.http.get(`${config.discourse.ssoProxy}/getToken?sso=${query.sso}&sig=${query.sig}`, {
                responseType: 'text'
            })

            commit('setBearer', data.token)
            localStorage.setItem(TOKEN_STORAGE, data.token)

            dispatch('fetchUser', data.username)
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