import vm from '../main'

export default {
  emit (type, message) {
    vm.$socket.emit(type, message)
  }
}
