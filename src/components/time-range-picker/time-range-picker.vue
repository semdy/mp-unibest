<script>
import dayjs from 'dayjs'

function generateDayColumns(startDayOfNum, endDayOfNum, format) {
  const today = dayjs()
  return Array.from({ length: endDayOfNum - startDayOfNum + 1 }, (_, i) => {
    const day = today.add(i, 'day')
    return {
      label: day.isSame(today) ? '今天' : day.format(format),
      value: day.startOf('day').valueOf()
    }
  })
}

function generateColumns(start, end) {
  return Array.from({ length: end - start + 1 }, (_, i) => {
    const value = start + i
    return {
      label: value < 10 ? `0${value}` : value,
      value
    }
  })
}

function compare(source, target) {
  if (typeof source === 'object') {
    source = dayjs(source).startOf('day').valueOf()
  }
  if (typeof target === 'object') {
    target = dayjs(target).startOf('day').valueOf()
  }
  return source === target
}

function buildDate(date, hour, minute) {
  return dayjs(date).startOf('day').hour(hour).minute(minute).startOf('minute')
}

export default {
  name: 'TimeRangePicker',
  props: {
    title: {
      type: String,
      default: '选择时间'
    },
    closeOnClickOverlay: {
      type: Boolean,
      default: true
    },
    modelValue: {
      type: Array,
      default: () => []
    },
    range: {
      type: Array,
      default: () => [0, 5]
    },
    dateFormat: {
      type: String,
      default: 'M.D HH:mm'
    },
    columnFormat: {
      type: String,
      default: 'M.D ddd'
    }
  },
  emits: ['close', 'open', 'cancel', 'confirm', 'change', 'update:modelValue'],
  data() {
    return {
      visible: false,
      columns: [],
      defaultIndex: [],
      mode: 'start',
      innerValue: []
    }
  },
  computed: {
    innerValueText() {
      return this.innerValue.map(value => dayjs(value).format(this.dateFormat))
    },
    valueText() {
      return this.modelValue.map(value => dayjs(value).format(this.dateFormat))
    }
  },
  watch: {
    modelValue: {
      handler(val) {
        this.innerValue = [...val]
        this.defaultIndex = this.getDefaultIndex(val)
      },
      immediate: true
    },
    visible(val) {
      if (val && this.modelValue.length) {
        this.$refs.pickerRef.setIndexs(this.getDefaultIndex(this.modelValue), true)
      }
      this.$emit('open', val)
    },
    mode() {
      this.defaultIndex = this.getDefaultIndex(this.innerValue)
      this.$refs.pickerRef.setIndexs(this.defaultIndex, true)
    }
  },
  mounted() {
    setTimeout(() => {
      this.generateColumns()
    }, 50)
  },
  methods: {
    generateColumns() {
      const dayColumns = generateDayColumns(this.range[0], this.range[1], this.columnFormat)
      const hourColumns = generateColumns(1, 23)
      const timeColumns = generateColumns(1, 59)
      this.columns = [dayColumns, hourColumns, timeColumns]
    },
    getDefaultIndex(val) {
      if (!this.columns.length) return []
      let d
      if (this.mode === 'start') {
        d = dayjs(val[0])
      } else {
        d = dayjs(val[1])
      }
      val = [d, d.hour(), d.minute()]
      if (Array.isArray(val)) {
        return val.map((it, i) => this.columns[i]?.findIndex(column => compare(column.value, it)))
      }
      return [this.columns[0]?.findIndex(column => compare(column.value, val))]
    },
    switchToStart() {
      this.mode = 'start'
    },
    switchToEnd() {
      this.mode = 'end'
    },
    showPicker() {
      this.visible = true
    },
    hidePicker() {
      this.visible = false
    },
    handleClose() {
      this.hidePicker()
      this.$emit('close')
    },
    handleCancel() {
      this.hidePicker()
      this.$emit('cancel')
    },
    handleChange(result) {
      const value = result.value.map(it => it?.value)
      if (this.mode === 'start') {
        this.innerValue[0] = buildDate(value[0], value[1], value[2])
      } else {
        this.innerValue[1] = buildDate(value[0], value[1], value[2])
      }
      this.$emit('change', result)
    },
    handleConfirm(result) {
      this.hidePicker()
      this.$emit('update:modelValue', this.innerValue)
      this.$emit('confirm', {
        ...result,
        value: [...this.innerValue],
        indexs: result.indexs.map(it => (it === -1 ? 0 : it))
      })
    }
  }
}
</script>

<template>
  <view class="time-range-picker-trigger" @click="showPicker">
    <slot :value="modelValue" :value-text="valueText" :set-start="switchToStart" :set-end="switchToEnd">
      <view class="time-range-picker-time">
        <view class="time-range-picker-time-text">
          {{ valueText[0] }}
        </view>
        <text style="margin: 0 10px">-</text>
        <view class="time-range-picker-time-text">
          {{ valueText[1] }}
        </view>
      </view>
    </slot>
  </view>
  <up-picker
    ref="pickerRef"
    :show="visible"
    :title="title"
    :columns="columns"
    :close-on-click-overlay="closeOnClickOverlay"
    :default-index="defaultIndex"
    key-name="label"
    @close="handleClose"
    @cancel="handleCancel"
    @change="handleChange"
    @confirm="handleConfirm"
  >
    <template #toolbar-bottom>
      <view class="time-range-picker-switch">
        <view class="time-range-picker-switch-item" :class="{ active: mode === 'start' }" @click="switchToStart">
          {{ innerValueText[0] }}
        </view>
        <view class="time-range-picker-switch-delimiter">-</view>
        <view class="time-range-picker-switch-item" :class="{ active: mode === 'end' }" @click="switchToEnd">
          {{ innerValueText[1] }}
        </view>
      </view>
    </template>
  </up-picker>
</template>

<style lang="scss">
.time-range-picker {
  &-time {
    display: flex;

    &-text {
      white-space: nowrap;
    }
  }

  &-switch {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;

    &-item {
      flex: 1;
      max-width: 150px;
      background-color: #f2f3f5;
      border-radius: 4px;
      text-align: center;
      padding: 7px 16px;
      min-height: 36px;
      line-height: 22px;
      font-size: 16px;

      &.active {
        color: $uni-color-primary;
        background-color: fade-out($uni-color-primary, 0.85);
      }
    }

    &-delimiter {
      margin: 0 24px;
    }
  }
}
</style>
