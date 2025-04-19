<template>
  <view class="ui-alert" :class="[type, { plain, bold }]">
    <view class="ui-alert-icon" v-if="icon">
      <slot name="icon">
        <ui-icon :name="icon" :size="iconSize" :color="iconColor"></ui-icon>
      </slot>
    </view>
    <view class="ui-alert-content">
      <slot></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ui-alert',
  props: {
    type: {
      type: String,
      default: 'primary',
    },
    icon: {
      type: String,
    },
    plain: {
      type: Boolean,
      default: false,
    },
    iconColor: {
      type: String,
    },
    iconSize: {
      type: Number,
      default: 14,
    },
    bold: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss">
.ui-alert {
  display: flex;
  align-items: center;
  border-radius: 6px;
  padding: 8px 12px;

  ::v-deep .ui-iconfont {
    vertical-align: -2px !important;
  }

  &.primary {
    background-color: fade-out($uni-color-primary, 0.85);
    color: $uni-color-primary;
  }

  &.warning {
    background-color: fade-out($uni-color-warning, 0.85);
    color: $uni-color-warning;
  }

  &.error {
    background-color: fade-out($uni-color-error, 0.85);
    color: $uni-color-error;
  }

  &.plain {
    background-color: transparent;
    padding: 1px;
  }

  &-icon {
    font-size: 15px;
    margin-right: 6px;
  }

  &-content {
    display: flex;
    align-items: center;
    font-size: 13px;
  }

  &.bold &-content {
    font-weight: bold;
  }
}
</style>
