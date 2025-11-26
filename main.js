import Vue from 'vue'
import App from './App'

// 导入封装的请求模块
import request from './utils/request'
import api from './api/index'

// #ifndef VUE3
// Vue2 配置
import Vue from 'vue'
import './uni.promisify.adaptor'

// 挂载到Vue原型
Vue.prototype.$http = request
Vue.prototype.$api = api

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
// Vue3 配置
import { createSSRApp } from 'vue'

// 挂载到Vue3全局属性
export function createApp() {
  const app = createSSRApp(App)
  
  // 在Vue3中挂载到全局属性
  app.config.globalProperties.$http = request
  app.config.globalProperties.$api = api
  
  return {
    app
  }
}
// #endif