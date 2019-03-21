import Vue from 'vue'
import Vuex from 'vuex'
import socketService from './services/socketService'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    nameCheckStatus: {
      checked: false,
      checking: false,
      available: false
    }
  },
  mutations: {
    setNameCheckStatus (state, status) {
      state.nameCheckStatus = status
    }
  },
  actions: {
    identify (context, doubleName) {
      context.commit('setNameCheckStatus', {
        checked: false,
        checking: true,
        available: false
      })
      socketService.emit('identify', doubleName)
    },
    SOCKET_nameknown (context) {
      context.commit('setNameCheckStatus', {
        checked: true,
        checking: false,
        available: false
      })
    },
    SOCKET_namenotknown (context) {
      context.commit('setNameCheckStatus', {
        checked: true,
        checking: false,
        available: true
      })
    }
  },
  getters: {
    nameCheckStatus: state => state.nameCheckStatus
  }
})
