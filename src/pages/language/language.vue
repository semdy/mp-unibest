<script>
import { getI18nLocale, setI18nLocale, languageList } from '@/locale'

export default {
  data() {
    return {
      selected: getI18nLocale(),
      languages: languageList
    }
  },
  methods: {
    onClickRight() {
      setI18nLocale(this.selected)
      uni.navigateBack()
    },
    onSelected(item) {
      this.selected = item.value
    }
  }
}
</script>

<template>
  <view class="language-page">
    <fixed-nav-bar
      title="切换语言"
      left-icon=""
      left-text="取消"
      right-text="确定"
      class="language-nav"
      @click-right="onClickRight"
    />
    <up-cell-group class="language-list" :border="false">
      <up-cell
        v-for="item in languages"
        :key="item.value"
        right-icon=""
        :title="item.name"
        clickable
        @click="onSelected(item)"
      >
        <template v-if="selected === item.value" #value>
          <ui-icon name="checked" class="checked" />
        </template>
      </up-cell>
    </up-cell-group>
  </view>
</template>

<style lang="scss">
page {
  background: #f7f8fa;
}
</style>

<style lang="scss" scoped>
.language-nav {
  background-color: #fff;
}
.language-list {
  background: #fff;
}
.checked {
  color: $uni-color-primary;
  font-size: 20px;
}
</style>
