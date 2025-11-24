<template>
  <view class="container">
    <view class="welcome-section">
      <text class="welcome-text">欢迎来到校园猫咪互助平台</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      
    }
  },
  onLoad() {
    console.log('首页加载')
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #FFFFFF;
  padding: 40rpx;
}

.welcome-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.welcome-text {
  font-size: 36rpx;
  color: #333333;
  font-weight: 500;
}
</style>

