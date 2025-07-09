<script>
export default {
  name: 'UiRadioButton',
  props: {
    list: {
      type: Array,
      default: () => []
    },
    modelValue: {
      type: Number
    },
    value: {
      type: Number
    },
    block: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'change'],
  data() {
    return {}
  },
  methods: {
    clickHandler(item) {
      this.$emit('update:modelValue', item.value)
      this.$emit('change', item.value)
    }
  }
}
</script>

<template>
  <view class="ui-radio-button-group" :class="{ block }">
    <view
      v-for="(item, index) in list"
      :key="index"
      class="ui-radio-button"
      :class="{ 'ui-radio-button--active': item.value === modelValue || item.value === value }"
      @click="clickHandler(item)"
    >
      {{ item.label }}
    </view>
  </view>
</template>

<style lang="scss">
.ui-radio-button {
  &-group {
    display: flex;
  }

  & {
    padding: 6px 12px;
    border-radius: 4px;
    background-color: #fff;
    color: #1d2129;
    text-align: center;

    &:not(:last-child) {
      margin-right: 10px;
    }

    &--active {
      background: fade-out($uni-color-primary, 0.86);
      color: $uni-color-primary;
    }
  }

  &-group.block & {
    flex: 1;
  }
}
</style>
