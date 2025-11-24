<template>
  <view class="login-container">
    <view class="logo-section">
      <image class="logo" src="/static/logo.png" mode="aspectFit"></image>
      <text class="app-name">校园流浪猫互助平台</text>
    </view>
    
    <view class="login-form">
      <!--用户名登录表单-->
      <view class="form-section">
        <view class="input-group">
          <view class="input-wrapper">
            <text class="input-icon">👤</text>
            <input 
              class="input-field" 
              type="text" 
              placeholder="请输入用户名" 
              v-model="username"
              maxlength="20"
            />
          </view>
        </view>
        
        <view class="input-group">
          <view class="input-wrapper">
            <text class="input-icon">🔒</text>
            <input 
              class="input-field" 
              :type="showPassword ? 'text' : 'password'" 
              placeholder="请输入密码" 
              v-model="password"
            />
            <text class="password-toggle" @tap="togglePassword">
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </text>
          </view>
        </view>
        
        <button 
          class="login-btn username-btn" 
          @tap="handleLogin" 
          :disabled="loading || !canLogin"
        >
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </view>
      
      <!--分割线-->
      <view class="divider">
        <view class="divider-line"></view>
        <text class="divider-text">或</text>
        <view class="divider-line"></view>
      </view>
      
      <!--微信一键登录-->
      <button 
        class="login-btn wechat-btn" 
        @tap="handleWechatLogin" 
        :disabled="loading"
      >
        <view class="btn-content">
          <text class="wechat-icon">💬</text>
          <text class="btn-text">{{ loading ? '登录中...' : '微信一键登录' }}</text>
        </view>
      </button>
      
      <!--注册链接-->
            <view class="register-link">
              <text class="register-text" @tap="goToRegister">还没有账号？立即注册</text>
            </view>
	  
      <!--协议提示-->
      <view class="agreement">
        <text class="agreement-text">登录即代表同意《用户协议》和《隐私政策》</text>
      </view>
    </view>
    
    <!--加载状态-->
    <view class="loading-mask" v-if="loading">
      <view class="loading-content">
        <activity-indicator size="large" color="#07C160"></activity-indicator>
        <text class="loading-text">正在登录...</text>
      </view>
    </view>
  </view>
</template>



<script>
export default {
  data() {
    return {
      username: '',  // 改为用户名
      password: '',
      showPassword: false,
      loading: false
    }
  },
  computed: {
    // 判断是否可以登录（用户名和密码都已填写）
    canLogin() {
      return this.username.length > 0 && this.password.length >= 6
    }
  },
  methods: {
    // 切换密码显示/隐藏
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    
    // 处理用户名密码登录
    async handleLogin() {
      // 防止重复点击
      if (this.loading) return
      
      // 验证用户名
      if (!this.username) {
        uni.showToast({
          title: '请输入用户名',
          icon: 'none',
          duration: 2000
        })
        return
      }
      
      // 验证密码
      if (this.password.length < 6) {
        uni.showToast({
          title: '密码至少6位',
          icon: 'none',
          duration: 2000
        })
        return
      }
      
      this.loading = true
      
      try {
        // 调用登录接口 - 使用封装的API
        const loginRes = await this.$api.login({
          username: this.username,
          password: this.password
        })
        
        // 登录成功，保存token和用户信息
        if (loginRes.success && loginRes.data) {
          const userInfo = {
            userId: loginRes.data.userId,
            username: loginRes.data.username
          }
          
          uni.setStorageSync('token', loginRes.data.token)
          uni.setStorageSync('userInfo', userInfo)
          
          uni.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1500
          })
          
          // 跳转到首页
          setTimeout(() => {
            uni.reLaunch({
              url: '/pages/index/index'
            })
          }, 1500)
        } else {
          throw new Error(loginRes.message || '登录失败')
        }
        
      } catch (error) {
        console.error('登录失败:', error)
        uni.showToast({
          title: error.message || '登录失败，请重试',
          icon: 'none',
          duration: 3000
        })
      } finally {
        this.loading = false
      }
    },
    
    // 处理微信登录
    async handleWechatLogin() {
      // 防止重复点击
      if (this.loading) return
      
      this.loading = true
      
      try {
        // 1. 调用uni.login获取code
        const loginRes = await new Promise((resolve, reject) => {
          uni.login({
            provider: 'weixin',
            success: resolve,
            fail: reject
          })
        })
        
        if (!loginRes.code) {
          throw new Error('获取微信授权码失败')
        }
        
        console.log('获取到微信code:', loginRes.code)
        
        // 2. 将code发送到后端进行微信登录 - 使用封装的API
        const tokenRes = await this.$api.wechatLogin({
          code: loginRes.code
        })
        
        // 3. 登录成功，保存token和用户信息
        if (tokenRes.success && tokenRes.data) {
          const userInfo = {
            userId: tokenRes.data.userId,
            isNewUser: tokenRes.data.isNewUser
          }
          
          uni.setStorageSync('token', tokenRes.data.token)
          uni.setStorageSync('userInfo', userInfo)
          
          uni.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1500
          })
          
          // 如果是新用户，可能需要跳转到完善信息页面
          if (tokenRes.data.isNewUser) {
            // 这里可以跳转到完善信息页面
            setTimeout(() => {
              uni.reLaunch({
                url: '/pages/complete-info/complete-info'
              })
            }, 1500)
          } else {
            // 跳转到首页
            setTimeout(() => {
              uni.reLaunch({
                url: '/pages/index/index'
              })
            }, 1500)
          }
        } else {
          throw new Error(tokenRes.message || '登录失败')
        }
        
      } catch (error) {
        console.error('微信登录失败:', error)
        uni.showToast({
          title: error.message || '登录失败，请重试',
          icon: 'none',
          duration: 3000
        })
      } finally {
        this.loading = false
      }
    },
    
    // 跳转到注册页面
    goToRegister() {
      uni.navigateTo({
        url: '/pages/register/register'
      })
    }
  }
}
</script>

<style scoped>
.login-container {
  padding: 60rpx 60rpx;
  min-height: 100vh;
  background: #FFFFFF;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60rpx;
}

.logo {
  width: 180rpx;
  height: 180rpx;
  border-radius: 36rpx;
  margin-bottom: 40rpx;
  background: #F5F5F5;
}

.app-name {
  font-size: 40rpx;
  color: #333333;
  font-weight: 600;
}

.login-form {
  width: 100%;
  max-width: 600rpx;
  background: transparent;
  padding: 0;
}

.form-section {
  margin-bottom: 40rpx;
}

.input-group {
  margin-bottom: 32rpx;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 0 32rpx;
  height: 96rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
  border: 1rpx solid #E5E5E5;
}

.input-icon {
  font-size: 40rpx;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.input-field {
  flex: 1;
  font-size: 32rpx;
  color: #333333;
  height: 100%;
}

.password-toggle {
  font-size: 40rpx;
  margin-left: 24rpx;
  flex-shrink: 0;
  cursor: pointer;
}

.login-btn {
  width: 100%;
  height: 96rpx;
  border-radius: 48rpx;
  border: none;
  margin-top: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-weight: 500;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.15);
  transition: all 0.3s;
}

.username-btn {
  background: #ffcaca;
  color: #ffffff;
}

.username-btn:disabled {
  background: #FF9999;
  color: #ffcaca;
  opacity: 0.6;
  box-shadow: none;
}

.wechat-btn {
  background: #FF9999;
  margin-top: 0;
}

.wechat-btn:disabled {
  background: #ffcaca;
  box-shadow: none;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.wechat-icon {
  font-size: 40rpx;
  margin-right: 16rpx;
}

.btn-text {
  font-size: 32rpx;
  color: #FFFFFF;
  font-weight: 500;
}

.divider {
  display: flex;
  align-items: center;
  margin: 40rpx 0;
}

.divider-line {
  flex: 1;
  height: 1rpx;
  background: #cecece;
}

.divider-text {
  margin: 0 24rpx;
  font-size: 28rpx;
  color: #999999;
}

/* 新增注册链接样式 */
.register-link {
  margin-top: 40rpx;
  text-align: center;
}

.register-text {
  font-size: 28rpx;
  color: #999999;
  text-decoration: underline;
}

.agreement {
  margin-top: 60rpx;
  text-align: center;
}

.agreement-text {
  font-size: 24rpx;
  color: #999999;
  line-height: 1.6;
}

.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  background: #FFFFFF;
  padding: 60rpx 80rpx;
  border-radius: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.2);
}

.loading-text {
  margin-top: 30rpx;
  font-size: 28rpx;
  color: #333333;
}
</style>
