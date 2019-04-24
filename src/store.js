import Vue from 'vue'
import Vuex from 'vuex'
import socketService from './services/socketService'
import cryptoService from './services/cryptoService'
import axios from 'axios'
import config from '../public/config'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    hash: null,
    redirectUrl: null,
    keys: {},
    doubleName: null,
    nameCheckStatus: {
      checked: false,
      checking: false,
      available: false
    },
    scannedFlagUp: false,
    signed: null,
    firstTime: null
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
    },
    setHash (state, hash) {
      state.hash = hash
    },
    setRedirectUrl (state, redirectUrl) {
      state.redirectUrl = redirectUrl
    },
    setScannedFlagUp (state, scannedFlagUp) {
      state.scannedFlagUp = scannedFlagUp
    },
    setSigned (state, signed) {
      state.signed = signed
    },
    setFirstTime (state, firstTime) {
      state.firstTime = firstTime
    }
  },
  actions: {
    SOCKET_connect (context, payload) {
      console.log(`hi`)
    },
    saveState (context, payload) {
      context.commit('setHash', payload.hash)
      context.commit('setRedirectUrl', payload.redirectUrl)
    },
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
    },
    registerUser (context, data) {
      console.log(`Register user`)
      context.dispatch('loginUser', true)
      socketService.emit('register', {
        doubleName: context.getters.doubleName,
        email: data.email,
        publicKey: context.getters.keys.publicKey
      })
    },
    SOCKET_scannedFlag (context) {
      context.commit('setScannedFlagUp', true)
    },
    SOCKET_signed (context, data) {
      context.commit('setSigned', data)
    },
    loginUser (context, firstTime = false) {
      context.commit('setFirstTime', firstTime)
      socketService.emit('login', {
        doubleName: context.getters.doubleName,
        state: context.getters.hash,
        firstTime
      })
    },
    resendNotification (context) {
      socketService.emit('resend', {
        doubleName: context.getters.doubleName,
        state: context.getters.hash
      })
    },
    forceRefetchStatus (context) {
      axios.get(`${config.apiurl}api/forcerefetch?hash=${context.getters.hash}&doublename=${context.getters.doubleName}`).then(response => {
        if (response.data.scanned) context.commit('setScannedFlagUp', response.data.scanned)
        if (response.data.signed) context.commit('setSigned', response.data.signed)
      }).catch(e => {
        alert(e)
      })
      // socketService.emit('forceRefetch', {
      //   doubleName: context.getters.doubleName,
      //   state: context.getters.hash
      // })
    }
  },
  getters: {
    doubleName: state => state.doubleName,
    nameCheckStatus: state => state.nameCheckStatus,
    keys: state => state.keys,
    hash: state => state.hash,
    redirectUrl: state => state.redirectUrl,
    scannedFlagUp: state => state.scannedFlagUp,
    signed: state => state.signed,
    firstTime: state => state.firstTime
  }
})
