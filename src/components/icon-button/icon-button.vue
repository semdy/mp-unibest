<script>
export default {
  name: 'IconButton',
  props: {
    name: {
      type: String
    },
    color: {
      type: String
    },
    size: {
      type: [String, Number],
      default: 20
    },
    rounded: {
      type: Boolean,
      default: true
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

<template>
  <view
    class="ui-icon-button"
    :class="{ 'ui-icon-button--rounded': rounded }"
    :style="{ 'font-size': `${size}px` }"
    @click="clickHandler"
  >
    <slot>
      <ui-icon :name="name" :color="color" />
    </slot>
  </view>
</template>

<style lang="scss">
$pd: 0.5rem;

.ui-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  flex-shrink: 0;
  padding: $pd;
  border-radius: 0.25rem;
  background-color: rgba(255, 255, 255, 0.8);

  &--rounded {
    border-radius: 3.125rem;
  }

  &:active {
    background-color: rgba(255, 255, 255, 0.4);
  }
}
</style>
