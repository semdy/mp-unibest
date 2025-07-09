<script>
export default {
  name: 'FixedNavBar',
  props: {
    title: {
      type: String
    },
    titleColor: {
      type: String
    },
    dark: {
      type: Boolean,
      default: false
    },
    canBack: {
      type: Boolean,
      default: true
    },
    leftText: {
      type: String
    },
    rightText: {
      type: String
    },
    leftIcon: {
      type: String,
      default: 'angle-left'
    },
    rightIcon: {
      type: String
    }
  },
  methods: {
    onClickLeft() {
      this.$emit('click-left')
      if (!this.canBack) {
        return
      }
      uni.navigateBack()
    },
    onClickRight() {
      this.$emit('click-right')
    }
  }
}
</script>

<template>
  <uni-nav-bar
    :fixed="true"
    :border="false"
    :dark="dark"
    status-bar
    :left-icon="canBack ? leftIcon : ''"
    :left-text="leftText"
    :right-text="rightText"
    :right-icon="rightIcon"
    background-color="transparent"
    :title="title"
    :title-color="titleColor"
    @click-left="onClickLeft"
    @click-right="onClickRight"
  >
    <template v-for="(_, name) in $slots" :key="name" #[name]>
      <slot :name="name" />
    </template>
  </uni-nav-bar>
</template>
