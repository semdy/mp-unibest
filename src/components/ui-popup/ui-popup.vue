<template>
  <view
    class="ui-popup"
    :class="{ 'with-handler': draggable }"
    :style="moveStyle"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchmove"
    @touchend="handleTouchend"
    @transitionend="handleTransitionEnd"
  >
    <view class="ui-popup-header" v-if="draggable"></view>
    <view class="ui-popup-body">
      <slot></slot>
    </view>
  </view>
</template>

<script>
import { mpMixin } from '@/uni_modules/uview-plus/libs/mixin/mpMixin'

export default {
  name: 'ui-popup',
  emits: ['start', 'move', 'end', 'slideend'],
  mixins: [mpMixin],
  props: {
    draggable: {
      type: Boolean,
      default: true
    },
    range: {
      type: Array,
      default: () => [-Infinity, Infinity]
    },
    autoSlide: {
      type: Boolean,
      default: true
    },
    slideDuration: {
      type: Number,
      default: 250
    },
    slideRatio: {
      type: Number,
      default: 0.2
    },
    useTransform: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      startY: 0,
      moveDistance: 0,
      moveOffset: 0,
      lastMoveDistance: 0,
      lastMoveOffset: 0,
      withAnimation: false,
      clearStyle: true,
      isSetManually: false
    }
  },
  computed: {
    moveStyle() {
      if (this.clearStyle) {
        return {}
      }
      if (this.useTransform) {
        return {
          transform: `translateY(${this.moveOffset}px)`,
          transition: this.withAnimation ? `transform ${this.slideDuration}ms ease-out` : ''
        }
      }
      return {
        top: `${this.moveOffset}px`,
        transition: this.withAnimation ? `top ${this.slideDuration}ms ease-out` : ''
      }
    }
  },
  methods: {
    handleTouchStart(e) {
      if (!this.draggable) return
      // e.preventDefault()
      this.startY = e.touches[0].clientY
      this.lastMoveDistance = this.moveOffset
      this.moveDistance = 0
      this.withAnimation = false
      this.clearStyle = false
      this.isSetManually = false
      this.$emit('start', {
        moveOffset: this.moveOffset,
        moveDistance: this.moveDistance,
        startY: this.startY
      })
    },
    handleTouchmove(e) {
      if (!this.draggable || this.isSetManually) return
      e.preventDefault()
      e.stopPropagation()
      if (this.startY) {
        const distance = e.touches[0].clientY - this.startY
        const [minDistance, maxDistance] = this.range
        this.moveDistance = distance
        this.moveOffset = this.lastMoveDistance + distance
        if (this.moveOffset > maxDistance) {
          this.moveOffset = maxDistance
        }
        if (this.moveOffset < minDistance) {
          this.moveOffset = minDistance
        }
        this.lastMoveOffset = this.moveOffset
        this.$emit('move', {
          moveOffset: this.moveOffset,
          moveDistance: this.moveDistance,
          startY: this.startY
        })
      }
    },
    handleTouchend() {
      if (!this.draggable || this.isSetManually) return
      if (this.startY) {
        this.startY = 0
        this.$emit('end', {
          moveOffset: this.moveOffset,
          moveDistance: this.moveDistance,
          startY: this.startY
        })
        if (this.autoSlide && this.moveDistance !== 0) {
          const [minDistance, maxDistance] = this.range
          const minOffset = Math.abs(minDistance)
          const maxOffset = Math.abs(maxDistance)
          this.withAnimation = true
          if (this.moveOffset > 0) {
            if (this.moveDistance > 0) {
              if (this.moveDistance > maxOffset * this.slideRatio) {
                this.moveOffset = maxDistance
              } else {
                this.moveOffset = 0
              }
            } else {
              if (Math.abs(this.moveDistance) > maxOffset * this.slideRatio) {
                this.moveOffset = 0
              } else {
                this.moveOffset = maxDistance
              }
            }
          } else {
            if (this.moveDistance > 0) {
              if (this.moveDistance > minOffset * this.slideRatio) {
                this.moveOffset = 0
              } else {
                this.moveOffset = minDistance
              }
            } else {
              if (Math.abs(this.moveDistance) > minOffset * this.slideRatio) {
                this.moveOffset = minDistance
              } else {
                this.moveOffset = 0
              }
            }
          }
        }
        this.lastMoveOffset = this.moveOffset
      }
    },
    handleTransitionEnd() {
      this.withAnimation = false
      if (this.moveOffset === 0) {
        this.clearStyle = true
      }
      this.$emit('slideend', {
        moveOffset: this.moveOffset,
        moveDistance: this.moveDistance,
        startY: this.startY
      })
    },
    isAtStart() {
      return this.moveOffset === 0
    },
    isAtUpper() {
      return this.moveOffset === this.range[0]
    },
    isAtLower() {
      return this.moveOffset === this.range[1]
    },
    getMoveOffset() {
      return this.moveOffset
    },
    getLastMoveOffset() {
      return this.lastMoveOffset
    },
    slideToUpper() {
      this.slideTo(this.range[0])
    },
    slideToLower() {
      this.slideTo(this.range[1])
    },
    slideToStart() {
      this.slideTo(0)
    },
    slideTo(offset, withAnimation = true) {
      this.isSetManually = true
      this.clearStyle = false
      this.withAnimation = withAnimation
      this.moveOffset = offset
      const evtName = withAnimation ? 'end' : 'move'
      this.$emit(evtName, {
        moveOffset: this.moveOffset,
        moveDistance: offset - this.getLastMoveOffset(),
        startY: this.startY
      })
    }
  }
}
</script>

<style lang="scss">
.ui-popup {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 12px 12px 0 0;
  background-color: #fff;
  overflow: hidden;
  z-index: 10;

  &-header {
    height: 45px;
    flex-shrink: 0;
  }

  &.with-handler {
    .ui-popup-body {
      padding-top: 0;
    }

    .ui-popup-header {
      text-align: center;

      &::after {
        content: '';
        display: inline-block;
        margin-top: 12px;
        width: 53px;
        height: 6px;
        background: #dfdfdf;
        border-radius: 3px;
      }
    }
  }

  &-body {
    padding: 16px;
  }
}
</style>
