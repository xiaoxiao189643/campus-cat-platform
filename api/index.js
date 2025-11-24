// api/index.js
import request from '@/utils/request'

export default {
  // 用户注册
  register(data) {
    return request.post('/register', data)
  },
  
  // 用户登录
  login(data) {
    return request.post('/login', data)
  },
  
  // 微信登录
  wechatLogin(data) {
    return request.post('/wechat/login', data)
  },
  
  // 获取受保护资源
  getProtectedResource() {
    return request.get('/protected-resource')
  }
}