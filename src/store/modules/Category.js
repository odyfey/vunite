import Vue from "vue"

const state = {
    subCategories: [],
    canCreateTopic: null,
    all: []
}

const mutations = {
    setSubCategories: (state, data) => (state.subCategories = data),

    updateCategoriesList(state, { list, canCreateTopic, isRoot, parent }) {
        if (isRoot) {
            state.canCreateTopic = canCreateTopic
            state.all = list || []
        } else if (parent) {
            parent.children = list
        }
    }
}

const getters = {
    allCategories: state => state.all
}

const actions = {
    async getCategories({ commit, dispatch }, parentId) {
        let pathname = "/categories.json"
        let parent = null

        if (parentId) {
            parent = await dispatch("findCategoryById", { id: parentId })
            // FIXME(Yorkie): if parent.children exists, just returns the current children,
            // that means will not be updated if not refreshed.
            if (parent && parent.children && parent.children.length > 0)
                return parent.children
            pathname += `?parent_category_id=${parentId}`
        }
        var { data } = await Vue.http.get(pathname)
        var { categories } = data.category_list || []
        var options = {
            list: categories,
            canCreateTopic: data.category_list.can_create_topic,
            parent,
            isRoot: parentId ? false : true
        }
        commit("updateCategoriesList", options)
        return options.list
    },
    findCategoryById({ state }, { id, parent }) {
        if (!parent) {
            parent = state.all
        }
        return parent.find(item => item.id === id)
    },

    // если понадобится сделать вывод вложенных категорий, то точно не так
    async findCategoryBySlug({ commit, dispatch }, slug) {
        if (!slug) return

        let id
        var mslug = slug.match(/^(\d+)\-category$/)

        if (mslug && mslug.length === 2) {
            id = parseInt(mslug, 10)
            return await dispatch("findCategoryById", { id })
        } else {
            return state.all.find(item => item.slug === slug)
        }
    },

    async checkSubCategories({ dispatch }, categoryId) {
        this.subCategories = []

        const curr = await dispatch("findCategoryBySlug", categoryId)

        if (curr && curr.has_children && curr.id) {
            commit("setSubCategories", await this.getCategories(curr.id))
        }
    }
}

export default {
    state,
    mutations,
    getters,
    actions
}
