import Vue from 'vue'
import Router from 'vue-router'
import Inital from './views/Inital'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'inital',
      component: Inital
    },{
      path: '/register',
      name: 'register',
      component: () => import(/* webpackChunkName: "register-page" */ './views/Register')
    },{
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login-page" */ './views/Login')
    },{
      path: '/error',
      name: 'error',
      component: () => import(/* webpackChunkName: "error-page" */ './views/Errorpage')
    }
  ]
})
