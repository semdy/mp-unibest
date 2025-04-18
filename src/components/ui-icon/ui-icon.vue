<template>
  <view class="ui-icon" :class="className" :style="style" @click="onClick">
    <text
      v-if="!isImg"
      :style="{ color: color, fontSize: iconSize }"
      :class="`ui-iconfont ui-icon-${name}`"
    />
    <image
      v-else
      class="ui-icon__img"
      :src="`/static/img-icons/${name}`"
      :style="`width:${iconSize};height:${iconSize}`"
    />
  </view>
</template>

<script>
import mpMixin from '@/uni_modules/uview-plus/libs/mixin/mpMixin'

const getVal = val => {
  const reg = /^[0-9]*$/g
  return typeof val === 'number' || reg.test(val) ? val + 'px' : val
}

export default {
  name: 'UIIcon',
  emits: ['click'],
  mixins: [mpMixin],
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
      return /\.(png|svg|gif|jpe?g|bmp|webp)$/i.test(this.name)
    },
    className() {
      return this['class']
    }
  },
  methods: {
    onClick() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss">
@import '@/static/fonts/styles/ui-iconfont.css';

.ui-icon {
  display: inline-block;
  line-height: 1;

  .ui-iconfont,
  .ui-icon__img {
    line-height: 1;
    vertical-align: bottom;
  }
}
</style>
