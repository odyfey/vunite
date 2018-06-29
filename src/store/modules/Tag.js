import Vue from 'vue'

const state = {
    all: [],
}

const mutations = {
    updateTags: (state, list) => state.all = list,
}

const getters = {
    allTags: (state) => state.all,
}

const actions = {
    getTags({ commit }) {
        return Vue.http.get('/tags.json').then(result => {
            commit('updateTags', result.data.tags)
        })
    },
}

export default {
    state,
    mutations,
    getters,
    actions,
}