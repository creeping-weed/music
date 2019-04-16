// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import fastclick from 'fastclick'
import vueLazyLoad from 'vue-lazyload'
import './common/stylus/index.styl'
import router from './router'
import store from './store'
// import fetch from 'common/js/fetch'
// fetch('/api/getVkey').then(res => {
//   console.log(res)
// })
Vue.use(vueLazyLoad, {
  loading: require('common/image/none.jpg')
})
fastclick.attach(document.body)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: c => c(App),
  router,
  store
})