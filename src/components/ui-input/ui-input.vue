<script>
export default {
  name: 'UiInput',
  props: {
    error: {
      type: Boolean,
      default: false
    },
    password: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isFocus: false,
      showPassword: false
    }
  },
  methods: {
    onFocus() {
      this.isFocus = true
    },
    onBlur() {
      this.isFocus = false
    },
    togglePassword() {
      this.showPassword = !this.showPassword
    }
  }
}
</script>

<template>
  <up-input
    class="ui-input"
    :class="{ 'ui-input--focus': isFocus, 'ui-input--error': error }"
    :password="password && !showPassword"
    @focus="onFocus"
    @blur="onBlur"
  >
    <template v-for="(_, name) in $slots" :key="name" #[name]>
      <slot :name="name" />
    </template>

    <template #suffix>
      <slot name="suffix" />
      <ui-icon
        v-if="password"
        :name="showPassword ? 'eye-on' : 'eye-off'"
        class="eye-pointer"
        @click="togglePassword"
      />
    </template>
  </up-input>
</template>

<style lang="scss">
.ui-input {
  background-color: #f7f8fa !important;
  border-radius: 10px !important;
  border-width: 1.5px !important;
  border-color: transparent !important;

  &--focus {
    border-color: $u-primary !important;
  }

  &--error {
    border-color: $uni-color-error !important;
  }

  &:not(.u-border) ::v-deep .u-input__content__field-wrapper__field {
    height: $u-input-large-height;
    padding-left: 9px;
    padding-right: 9px;
  }

  &.u-border ::v-deep .u-input__content__field-wrapper__field {
    height: $u-input-large-height - 14px;
  }

  ::v-deep .eye-pointer {
    color: #86909c;
    font-size: 18px;
    padding: 4px;
  }
}
</style>
