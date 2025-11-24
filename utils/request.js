// utils/request.js
const BASE_URL = 'http://localhost:3000/api'

class Request {
  constructor() {
    this.baseURL = BASE_URL
  }

  request(method, url, data = {}) {
    return new Promise((resolve, reject) => {
      // 获取token
      const token = uni.getStorageSync('token')
      
      // 设置请求头
      const header = {
        'Content-Type': 'application/json'
      }
      
      // 如果有token，添加到请求头
      if (token) {
        header['Authorization'] = `Bearer ${token}`
      }

      uni.request({
        url: this.baseURL + url,
        method: method,
        data: data,
        header: header,
        success: (res) => {
          // 统一处理HTTP状态码
          if (res.statusCode >= 200 && res.statusCode < 300) {
            // 检查业务逻辑成功状态
            if (res.data.success) {
              resolve(res.data)
            } else {
              reject(new Error(res.data.message || '请求失败'))
            }
          } else if (res.statusCode === 401) {
            this.handleUnauthorized()
            reject(new Error('登录已过期，请重新登录'))
          } else {
            reject(new Error(`请求失败: ${res.statusCode}`))
          }
        },
        fail: (err) => {
          reject(new Error('网络请求失败，请检查网络连接'))
        }
      })
    })
  }

  get(url, data = {}) {
    return this.request('GET', url, data)
  }

  post(url, data = {}) {
    return this.request('POST', url, data)
  }

  handleUnauthorized() {
    // 清除本地存储
    uni.removeStorageSync('token')
    uni.removeStorageSync('userInfo')
    
    // 显示提示
    uni.showToast({
      title: '登录已过期，请重新登录',
      icon: 'none'
    })
    
    // 跳转到登录页
    setTimeout(() => {
      uni.reLaunch({
        url: '/pages/login/login'
      })
    }, 1500)
  }
}

export default new Request()