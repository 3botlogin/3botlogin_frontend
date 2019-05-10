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
    emailVerificationStatus: {
      checked: false,
      checking: false,
      valid: false
    },
    scannedFlagUp: false,
    signed: null,
    firstTime: null,
    scope: null,
    appId: null,
    appPublicKey: null
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
    },
    setEmailVerificationStatus (state, status) {
      state.emailVerificationStatus = status
    },
    setScope (state, scope) {
      state.scope = scope
    },
    setAppId (state, appId) {
      state.appId = appId
    },
    setAppPublicKey (state, appPublicKey) {
      state.appPublicKey = appPublicKey
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
      doubleName = `${doubleName}.3bot`
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
      context.commit('setKeys', await cryptoService.generateKeys())
    },
    registerUser (context, data) {
      console.log(`Register user`)
      context.dispatch('loginUser', true)
      socketService.emit('register', {
        doubleName: context.getters.doubleName,
        email: data.email,
        publicKey: context.getters.keys.publicKey
      })
      axios.post(`${config.openkycurl}users`, {
        'user_id': context.getters.doubleName,
        'email': data.email,
        'callback_url': `${window.location.protocol}//${window.location.host}/verifyemail`,
        'public_key': context.getters.keys.publicKey
      }).then(x => {
        console.log(`Mail has been sent`)
      }).catch(e => {
        alert(e)
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
        firstTime,
        scope: context.getters.scope,
        appId: context.getters.appId,
        appPublicKey: context.getters.appPublicKey
      })
    },
    resendNotification (context) {
      console.log(`resending`, {
        doubleName: context.getters.doubleName,
        state: context.getters.hash,
        scope: context.getters.scope,
        appId: context.getters.appId,
        appPublicKey: context.getters.appPublicKey
      })
      socketService.emit('resend', {
        doubleName: context.getters.doubleName,
        state: context.getters.hash,
        scope: context.getters.scope,
        appId: context.getters.appId,
        appPublicKey: context.getters.appPublicKey
      })
    },
    forceRefetchStatus (context) {
      axios.get(`${config.apiurl}api/forcerefetch?hash=${context.getters.hash}&doublename=${context.getters.doubleName}`).then(response => {
        if (response.data.scanned) context.commit('setScannedFlagUp', response.data.scanned)
        if (response.data.signed) context.commit('setSigned', response.data.signed)
      }).catch(e => {
        alert(e)
      })
    },
    validateEmail (context, data) {
      if (data && data.userId && data.verificationCode) {
        context.commit('setEmailVerificationStatus', {
          checked: false,
          checking: true,
          valid: false
        })
        axios.post(`${config.openkycurl}users/${data.userId}/verify`, {
          verification_code: data.verificationCode
        }).then(message => {
          axios.get(`${config.openkycurl}keys`).then(async keys => {
            console.log(`Validating signature`)
            cryptoService.validateSignature(message.data.email, message.data.signature, keys.data.public).then(validity => {
              console.log(validity)
              context.commit('setEmailVerificationStatus', {
                checked: true,
                checking: false,
                valid: true
              })
            }).catch(e => {
              context.commit('setEmailVerificationStatus', {
                checked: true,
                checking: false,
                valid: false
              })
            })
          }).catch(e => {
            context.commit('setEmailVerificationStatus', {
              checked: true,
              checking: false,
              valid: false
            })
          })
        }).catch(e => {
          context.commit('setEmailVerificationStatus', {
            checked: true,
            checking: false,
            valid: false
          })
        })
      }
    },
    setScope (context, scope) {
      context.commit('setScope', scope)
    },
    setAppId (context, appId) {
      context.commit('setAppId', appId)
    },
    setAppPublicKey (context, appPublicKey) {
      context.commit('setAppPublicKey', appPublicKey)
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
    firstTime: state => state.firstTime,
    emailVerificationStatus: state => state.emailVerificationStatus,
    scope: state => state.scope,
    appId: state => state.appId,
    appPublicKey: state => state.appPublicKey
  }
})
