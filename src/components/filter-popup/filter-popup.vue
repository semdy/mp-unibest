<script>
export default {
  name: 'FilterPopup',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    spec: {
      type: Number
    },
    timeRange: {
      type: Array
    }
  },
  emits: ['update:show', 'update:spec', 'update:timeRange', 'close', 'reset', 'confirm'],
  data() {
    return {
      specList: [
        {
          label: '自取',
          value: 0
        },
        {
          label: '堂食',
          value: 1
        }
      ],
      innerSpec: -1,
      innerTimeRange: [],
      specSnapshot: -1,
      timeRangeSnapshot: []
    }
  },
  watch: {
    innerSpec(val) {
      this.$emit('update:spec', val)
    },
    innerTimeRange(val) {
      this.$emit('update:timeRange', val)
    },
    spec: {
      handler(val) {
        this.innerSpec = val
      },
      immediate: true
    },
    timeRange: {
      handler(val) {
        this.innerTimeRange = val
      },
      immediate: true
    }
  },
  mounted() {
    this.specSnapshot = this.spec
    this.timeRangeSnapshot = [...this.timeRange]
  },
  methods: {
    onClose() {
      this.$emit('update:show', false)
      this.$emit('close')
    },
    onConfirm() {
      this.$emit('confirm', { spec: this.innerSpec, timeRange: [...this.innerTimeRange] })
      this.onClose()
    },
    onReset() {
      this.onClose()
      this.$emit('reset', { spec: this.specSnapshot, timeRange: this.timeRangeSnapshot })
      this.$emit('update:spec', this.specSnapshot)
      this.$emit('update:timeRange', this.timeRangeSnapshot)
    }
  }
}
</script>

<template>
  <up-popup :show="show" class="filter-popup" mode="right" @close="onClose">
    <uni-status-bar />
    <view class="filter-popup-container flex flex-col">
      <view class="filter-popup-title">筛选</view>
      <view class="filter-popup-item-title">规格</view>
      <view class="filter-popup-item">
        <ui-radio-button v-model="innerSpec" block :list="specList" />
      </view>
      <view class="filter-popup-item-title">预约时间</view>
      <view class="filter-popup-item">
        <time-range-picker v-model="innerTimeRange">
          <template #default="{ valueText, setStart, setEnd }">
            <view class="flex items-center">
              <view class="filter-popup-item-date-input center flex" @click="setStart">
                {{ valueText[0] || '开始时间' }}
              </view>
              <text class="mx-2.5">-</text>
              <view class="filter-popup-item-date-input center flex" @click="setEnd">
                {{ valueText[1] || '结束时间' }}
              </view>
            </view>
          </template>
        </time-range-picker>
      </view>
    </view>
    <template v-if="!$slots.bottom" #bottom>
      <view class="filter-popup-button-group">
        <up-button class="filter-popup-cancel-button" @click="onReset">重置</up-button>
        <up-button type="primary" @click="onConfirm">确定</up-button>
      </view>
    </template>
  </up-popup>
</template>

<style lang="scss">
.filter-popup {
  ::v-deep .u-transition {
    flex-direction: column;
  }

  &-container {
    width: 18.125rem;
    padding: 1rem;
  }

  &-title {
    font-size: 1rem;
    font-weight: bold;
    color: #1d2129;
    margin-bottom: 1.2rem;
  }

  &-item {
    margin-bottom: 1.5rem;

    ::v-deep .ui-radio-button:not(.ui-radio-button--active) {
      background-color: #f2f3f5;
    }

    &-title {
      margin-bottom: 0.75rem;
    }

    &-date-input {
      flex: 1;
      padding: 6px 12px;
      height: 34px;
      border-radius: 4px;
      border: 1px solid $u-border-color;
    }
  }

  &-button-group {
    display: flex;
    background-color: #fff;
    padding: 1rem;

    & .u-button:not(:last-child) {
      margin-right: 1rem;
    }
  }

  &-cancel-button {
    border-color: transparent !important;
    background-color: #f2f3f5 !important;
  }
}
</style>
