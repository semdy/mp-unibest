<template>
  <view class="ui-divider" :class="{ [align]: align, huge }">
    <view class="ui-divider-label" v-if="$slots.default">
      <slot></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ui-divider',
  props: {
    align: {
      type: String,
      default: 'left',
    },
    huge: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss">
.ui-divider {
  height: 1px;
  background-color: rgba(0, 0, 0, 0.06);
  margin: 16px 0;

  &.huge {
    margin: 24px 0;
  }

  &.left {
    .ui-divider-label {
      padding-left: 0;
    }
  }

  &.center {
    text-align: center;
  }

  &.right {
    text-align: right;

    .ui-divider-label {
      padding-right: 0;
    }
  }

  &-label {
    display: inline-block;
    background-color: #fff;
    padding: 0 12px;
    transform: translateY(-50%);
  }
}
</style>
