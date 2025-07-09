<template>
  <view class="authorize-panel">
    <!-- <image class="authorize-icon" src="/static/images/shu.png" /> -->
    <view class="authorize-text">
      <view>邀您完成授权</view>
      <view>以继续使用</view>
    </view>
  </view>
  <up-button
    open-type="getUserInfo"
    type="primary"
    size="large"
    class="authorize-button"
    @getuserinfo="onGetUserInfo"
    @click="onClick"
    lang="zh_CN"
  >
    授权用户信息
  </up-button>
</template>

<script>
import authorize from '@/utils/authorize'

export default {
  data() {
    return {
      isShow: true
    }
  },

  methods: {
    onClick() {
      this.isShow = false
    },
    onGetUserInfo() {
      authorize.getToken()
      uni.navigateBack()
    }
  }
}
</script>

<style lang="scss">
.authorize-panel {
  background: #0ac0ff;
  padding: 50px 20px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.authorize-icon {
  width: 180px;
  height: 147px;
}
.authorize-text {
  font-size: 17px;
  color: #fff;
  text-align: center;
  margin-top: 15px;
}

.authorize-button {
  display: block;
  width: 85%;
  max-width: 300px;
  margin: 60px auto;
  overflow: visible;
  box-shadow: 0 6px 12px rgba(8, 199, 254, 0.2);
}
</style>
