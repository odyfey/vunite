import Vue from 'vue'

const namespaced = true

const state = {
    all: [],
}

const mutations = {
    replace(state, list) {
        if (list)
            state.all = list
    },
}

const getters = {
    all: state => state.all,

    unread: state => state.all.filter((item) => !item.read),
}

const actions = {
    async load({ commit, rootGetters }) {
        const res = await Vue.http.get(`/notifications.json?api_key=${rootGetters['User/apiKey']}&api_username=${rootGetters['User/username']}`)
        commit('replace', res.data.notifications)
    },
}

export default {
    namespaced,
    state,
    mutations,
    getters,
    actions,
}