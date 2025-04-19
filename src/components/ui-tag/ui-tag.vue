<template>
  <view class="ui-tag" :class="type">
    <slot></slot>
  </view>
</template>

<script>
export default {
  name: 'ui-tag',
  props: {
    type: {
      type: String,
      default: 'primary',
    },
  },
}
</script>

<style lang="scss">
.ui-tag {
  display: inline-block;
  border-radius: 2px;
  padding: 3px 8px;
  font-size: 12px;
  align-self: center;
  white-space: nowrap;
  flex-shrink: 0;

  &.default {
    background: rgba(163, 162, 161, 0.2);
    color: #6d6d6d;
  }

  &.primary {
    background-color: fade-out($uni-color-primary, 0.8);
    color: $uni-color-primary;
  }

  &.warning {
    background-color: fade-out($uni-color-warning, 0.8);
    color: $uni-color-warning;
  }

  &.error {
    background-color: fade-out($uni-color-error, 0.8);
    color: $uni-color-error;
  }

  &.success {
    background-color: fade-out($uni-color-success, 0.8);
    color: $uni-color-success;
  }
}
</style>
