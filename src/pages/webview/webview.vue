<template>
  <web-view v-if="url" :src="url"></web-view>
</template>

<script>
export default {
  data() {
    return {
      url: '',
    }
  },
  onLoad(options) {
    this.url = decodeURIComponent(options.url)
    if (options.title) {
      uni.setNavigationBarTitle({
        title: options.title,
      })
    }
  },
}
</script>

<style lang="scss">
page {
  background: #fff;
}
</style>
