<script>
function getVal(val) {
  const reg = /^\d*$/g
  return typeof val === 'number' || reg.test(val) ? `${val}px` : val
}

export default {
  name: 'UIIcon',
  props: {
    name: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: 'currentColor'
    },
    size: {
      type: [Number, String],
      default: ''
    },
    style: {
      type: [Object, String]
    },
    class: {
      type: String
    }
  },
  computed: {
    iconSize() {
      if (this.size) {
        return getVal(this.size)
      }
      return '1em'
    },
    isImg() {
      return /\.(?:png|svg|gif|jpe?g|bmp|webp)$/i.test(this.name)
    },
    className() {
      return this.class
    }
  }
}
</script>

<template>
  <view class="ui-icon" :class="className" :style="style">
    <text v-if="!isImg" :style="{ color, fontSize: iconSize }" :class="`ui-iconfont ui-icon-${name}`" />
    <image
      v-else
      class="ui-icon__img"
      :src="`/static/img-icons/${name}`"
      :style="`width:${iconSize};height:${iconSize}`"
    />
  </view>
</template>

<style lang="scss">
@import '@/static/fonts/styles/ui-iconfont.css';

.ui-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  flex-shrink: 0;
}
</style>
