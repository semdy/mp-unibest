<template>
  <view class="login-page g-page full-page">
    <fixed-nav-bar dark :can-back="false" title="手机号登录" />
    <view class="page-container">
      <ui-card class="login-card">
        <up-input placeholder="请输入手机号" v-model="phone" class="f-input" />
        <up-input placeholder="请输入验证码" v-model="code" class="l-input">
          <template #suffix>
            <up-code ref="uCodeRef" seconds="60" changeText="X秒重新获取" @change="codeChange" />
            <up-button @click="getCode" :text="tips" type="success" size="mini">
              {{ tips }}
            </up-button>
          </template>
        </up-input>
      </ui-card>
      <view class="login-footer">
        <up-button type="primary" shape="square" :loading="logining" @click="doLogin" text="登录" />
      </view>
    </view>
  </view>
</template>

<script>
import { shareMixins } from '@/config'
import { sendCheckCode, loginApi } from '@/api'
import authorize from '@/utils/authorize'
import { showLoading, hideLoading, toast } from '@/utils/util'
import { usePickerDataStore } from '@/store'

export default {
  data() {
    return {
      phone: '',
      code: '',
      tips: '',
      logining: false,
    }
  },
  mixins: [shareMixins],
  methods: {
    async getCode() {
      if (!this.phone) {
        return toast.error('请输入手机号')
      }
      if (!/^1[23456789]\d{9}$/.test(this.phone)) {
        return toast.error('手机号格式不正确')
      }
      if (this.$refs.uCodeRef.canGetCode) {
        showLoading('正在获取验证码')
        try {
          await sendCheckCode({
            phone: this.phone,
          })
          toast.success('验证码已发送')
          this.$refs.uCodeRef.start()
        } finally {
          hideLoading()
        }
      } else {
        toast.error('倒计时结束后再发送')
      }
    },
    codeChange(text) {
      this.tips = text
    },
    async doLogin() {
      if (!this.phone) {
        return toast.error('请输入手机号')
      }
      if (!/^1[23456789]\d{9}$/.test(this.phone)) {
        return toast.error('手机号格式不正确')
      }
      if (!this.code) {
        return toast.error('请输入验证码')
      }
      try {
        this.logining = true
        const { access: token, refresh: refreshToken } = await loginApi({
          username: this.phone,
          password: this.code,
          login_type: 'phone',
        })
        authorize.saveToken(token, refreshToken)
        const pickerDataStore = usePickerDataStore()
        pickerDataStore.initAllFilter()
        uni.switchTab({
          url: '/pages/review/review',
        })
      } finally {
        this.logining = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.page-container {
  height: 100%;
  padding: 16px;
  padding-top: 50px;

  ::v-deep .ui-card {
    padding: 32px 16px;
  }
}

.login-footer {
  margin-top: 24px;
}

.login-card .f-input {
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.login-card .l-input {
  margin-top: -0.5px;
  border-top-color: transparent !important;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.login-card ::v-deep .u-input__content__field-wrapper__field {
  height: 32px;
}
</style>
