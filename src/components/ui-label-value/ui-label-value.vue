<template>
  <view class="ui-label-value" :class="{ 'ui-label-value-inline': inline }">
    <view class="ui-label-value-label" :style="{ color: labelColor }" v-if="label">
      <slot name="label">{{ label }}</slot>
    </view>
    <view class="ui-label-value-value" :class="{ 'ui-label-value-value-bold': valueBold }">
      <slot></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ui-label-value',
  props: {
    label: {
      type: String
    },
    valueBold: {
      type: Boolean,
      default: false
    },
    labelColor: {
      type: String,
      default: ''
    },
    inline: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
.ui-label-value {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;

  &-inline {
    display: inline-flex;
  }

  &-label {
    font-size: 13px;
    color: rgba(0, 0, 0, 0.5);
    white-space: nowrap;
    margin-right: 12px;
  }

  &-value {
    font-size: 13px;
    color: rgba(0, 0, 0, 0.7);

    &-bold {
      font-weight: bold;
    }
  }
}
</style>
