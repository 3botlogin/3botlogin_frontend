import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins'
import './style.scss'
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  console.log(`to.name == ${to.name}`)
  if ((to.name !== 'inital' && to.name !== 'error' && to.name !== 'verifyemail') && !store.state.doubleName) {
    next({
      name: 'inital'
    })
  } else {
    next()
  }
})

export default new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
