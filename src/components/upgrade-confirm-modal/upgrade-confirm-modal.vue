<script>
export default {
  name: 'UpgradeConfirmModal',
  props: {},
  methods: {}
}
</script>

<template>
  <confirm-modal :show-close="false" class="upgrade-modal">
    <view class="upgrade-modal-container">
      <view class="upgrade-modal-title">发现新版本</view>
      <view class="upgrade-modal-version">V1.1.1</view>
      <image src="/static/images/upgrade-rocket.png" class="upgrade-modal-rocket" mode="widthFix" />
      <view class="upgrade-modal-content">
        <view class="upgrade-modal-content-title">更新内容:</view>
        <view class="upgrade-modal-content-item">优化产品体验，修复若干问题</view>
        <view class="upgrade-modal-content-item">优化产品体验，修复若干问题</view>
      </view>
    </view>
  </confirm-modal>
</template>

<style lang="scss">
@import '@/style/res.scss';

.upgrade-modal {
  ::v-deep .u-popup__content {
    overflow: visible !important;
  }

  ::v-deep .u-modal {
    overflow: visible !important;
    background: #f7f8fa;
  }

  &-container {
    flex: 1;
    margin: -25px;
    padding: 25px;
  }

  &-title {
    font-size: 1.375rem;
    color: #1d2129;
    font-weight: bold;
    margin-bottom: 10px;
  }

  &-version {
    color: #4e5969;
  }

  &-rocket {
    position: absolute;
    top: -40px;
    right: 5px;
    width: 133px;
    height: 136px;
  }

  &-content {
    margin-top: 36px;

    &-title {
      margin-bottom: 8px;
    }

    &-item {
      font-size: 0.8125rem;
      padding: 5px 0;
      color: #4e5969;

      &::before {
        display: inline-block;
        content: '·';
        font-size: 26px;
        margin-right: 10px;
        color: $uni-color-primary;
        line-height: 4px;
        width: 4px;
        height: 4px;
        vertical-align: middle;
      }
    }
  }

  .confirm-modal-cancel-button {
    background-color: #f0f0f0 !important;
  }
}
</style>
