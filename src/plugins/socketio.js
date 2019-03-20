import Vue from 'vue'
import store from '../store'
import VueSocketIO from 'vue-socket.io/dist/vue-socketio'

Vue.use(new VueSocketIO({
  debug: true,
  secure: true,
  connection: 'http://localhost:8080',
  vuex: {
    store,
    actionPrefix: 'SOCKET_'
  }
}))
