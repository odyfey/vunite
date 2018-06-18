import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'

Vue.use(Vuex)

export function createStore () {
    return new Vuex.Store({
        modules,
        strict: process.env.NODE_ENV !== 'production',
    })
}
