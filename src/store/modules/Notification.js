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
    allNotifications: state => state.all,

    unreadNotifications: state => state.all.filter((item) => !item.read),
}

const actions = {
    async loadNotifications({ commit }) {
        const res = await Vue.http.get('/notifications.json')
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