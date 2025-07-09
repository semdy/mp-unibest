<template>
  <view class="ui-card" @click="clickHandler">
    <view class="ui-card-header">
      <slot name="title">
        <view class="ui-card-title" v-if="title">{{ title }}</view>
      </slot>
      <slot name="header-right"></slot>
    </view>
    <view class="ui-card-content">
      <slot></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ui-card',
  props: {
    title: {
      type: String
    }
  },
  methods: {
    clickHandler(e) {
      // #ifdef MP
      this.$emit('click', e)
      // #endif
    }
  }
}
</script>

<style lang="scss">
.ui-card {
  padding: 16px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0px 2px 8px rgba(0, 20, 18, 0.1);

  &:not(:last-child) {
    margin-bottom: 10px;
  }

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:not(:empty) {
      margin-bottom: 8px;
    }
  }

  &-title {
    font-size: 15px;
    font-weight: bold;
    word-wrap: break-word;
  }
}
</style>
