import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  socketState: 0
}

const actions = {

}

const mutations = {
  // 改变websocket链接状态
  changeSocketState(state, value) {
    this.state.socketState = value
  }
}

export default new Vuex.Store({
  state: state,
  actions: actions,
  mutations: mutations
})
