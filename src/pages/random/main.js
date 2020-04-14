import Vue from 'vue'
import App from './index'
import Store from './../../store/index'

// add this to handle exception
Vue.config.errorHandler = function(err) {
  if (console && console.error) {
    console.error(err)
  }
}

Vue.prototype.$store = Store

const app = new Vue(App)
app.$mount()
