import vm from '../main.js'

export default {
  emit (type, message) {
    console.log(`emit`)
    // console.log(JSON.stringify(vm))
    if (vm) {
      console.log(type, message)

      vm.$socket.emit(type, message)
    } else {
      setTimeout(() => {
        console.log(`WAIT TO EMIT`)
        this.emit(type, message)
      }, 100)
    }
  }
}

// I/chromium(12556): [INFO:CONSOLE(124)] "Redirecting to http://192.168.2.80:8081/callback?username=jos.3bot&signedhash=BmsSDV7p3OJNUBZQuFW5ZRJgY%2Bu6BpOF7RX6R8upn8I%2BVIiaxv%2F48XfJZYNSllaXjzq1Z%2BKrQkhQArHgUOd7BGNhdm1TY1hkYkdOVHJsVnNQQmVxNEkzS2NMWEdXR0pv&data=%7B%22nonce%22%3A%2233DemiHVH2i3QQGkRbdddKVlMLXQ0qrs%22%2C%22ciphertext%22%3A%22IDcKju8bJxd%2Fn%2ByRW2C6ayi5JlsBM%2Fl9VExw93X%2FCFdBRZFUuGtWrk58UKrTicyq9jEC1KMiv2XkcA%2Bbv4QJKXg9j9CdXQovBzcH%22%7D", source: webpack-internal:///./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/eslint-loader/index.js?!./src/views/initial/initial.js?vue&type=script&lang=js& (124)
