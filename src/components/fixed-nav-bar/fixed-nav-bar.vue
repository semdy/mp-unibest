<template>
  <!-- #ifndef MP-ALIPAY -->
  <uni-nav-bar
    :fixed="true"
    :border="false"
    :dark="dark"
    status-bar
    :left-icon="canBack ? 'left' : ''"
    background-color="transparent"
    :title="title"
    @click-left="onBack"
  />
  <!-- #endif -->
  <!-- #ifdef MP-ALIPAY -->
  <uni-nav-bar
    :fixed="true"
    :border="false"
    :dark="dark"
    status-bar
    background-color="transparent"
  />
  <!-- #endif -->
</template>

<script>
export default {
  name: 'FixedNavBar',
  props: {
    title: {
      type: String
    },
    dark: {
      type: Boolean,
      default: false
    },
    canBack: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    onBack() {
      if (!this.canBack) {
        return
      }
      /* #ifdef H5 */
      history.back()
      /* #endif */
      /* #ifndef H5 */
      uni.navigateBack()
      /* #endif */
    }
  }
}
</script>
