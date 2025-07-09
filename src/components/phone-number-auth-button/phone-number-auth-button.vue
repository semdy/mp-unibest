<template>
  <view :class="className" :style="style" @click="onClick">
    <button
      class="phone-auth-btn"
      v-if="!userInfo.phone"
      open-type="getPhoneNumber"
      @getphonenumber="getPhoneNumber"
      @error="onAuthError"
    >
      <slot></slot>
    </button>
    <slot v-else></slot>
  </view>
</template>

<script>
import { getAuthorizedInfo } from '@/api'
import { toast } from '@/utils/toast'
import { mapState } from 'pinia'
import { useUserStore } from '@/store'

export default {
  name: 'phone-number-auth-button',
  emits: ['click', 'getPhoneNumber'],
  props: {
    style: {
      type: [Object, String]
    },
    class: {
      type: String
    }
  },
  computed: {
    ...mapState(useUserStore, ['userInfo']),
    className() {
      return this.class
    }
  },
  methods: {
    onClick() {
      if (this.userInfo.phone) {
        this.$emit('getPhoneNumber', this.userInfo.phone)
      }
      this.$emit('click', !!this.userInfo.phone)
    },
    async getPhoneNumber(e) {
      const { code } = e.detail
      if (!code) {
        return toast.error('已拒绝授权')
      }
      const res = await getAuthorizedInfo(code)
      const userStore = useUserStore()
      userStore.setUserInfo({ phone: res })
      this.$emit('getPhoneNumber', res)
    },
    onAuthError() {
      toast.error('已拒绝授权')
    }
  }
}
</script>

<style lang="scss">
.phone-auth-btn {
  width: 100%;
  height: 100%;
  border: none;
  background: none;
  padding: 0;
  margin: 0;
  line-height: unset;

  &:after {
    display: none;
  }
}
</style>
