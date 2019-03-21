import Vue from 'vue'
import Vuex from 'vuex'
import socketService from './services/socketService'
import cryptoService from './services/cryptoService'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    keys: {},
    doubleName: null,
    nameCheckStatus: {
      checked: false,
      checking: false,
      available: false
    }
  },
  mutations: {
    setNameCheckStatus (state, status) {
      state.nameCheckStatus = status
    },
    setKeys (state, keys) {
      state.keys = keys
    },
    setDoubleName (state, name) {
      state.doubleName = name
    }
  },
  actions: {
    identify (context, doubleName) {
      context.commit('setNameCheckStatus', {
        checked: false,
        checking: true,
        available: false
      })
      context.commit('setDoubleName', doubleName)
      socketService.emit('identify', { doubleName })
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
    },
    async generateKeys (context) {
      context.commit('setKeys', await cryptoService.generateAsymmetricKeypair())
      // TODO: send to backend
    },
    registerUser (context, data) {
      console.log(`Register user`)
      socketService.emit('register', {
        doubleName: context.getters.doubleName,
        email: data.email,
        publicKey: context.getters.keys.privateKey
      })
    }
  },
  getters: {
    doubleName: state => state.doubleName,
    nameCheckStatus: state => state.nameCheckStatus,
    keys: state => state.keys
  }
})
