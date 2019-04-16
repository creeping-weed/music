import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutaions'
import * as getters from './getters'
import * as actions from './actions'
Vue.use(Vuex)
export default new Vuex.Store({
  strict: true,
  state,
  mutations,
  getters,
  actions
})