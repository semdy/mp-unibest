<template>
  <view class="ui-picker" @touchmove.stop="noop" @touchend.stop="noop">
    <view class="ui-picker-trigger" @click="showPicker">
      <slot :showText="showText || placeholder" :value="modelValue">
        <view class="ui-picker-btn" :class="{ dark }">
          <view class="ui-picker-text">{{ showText || placeholder }}</view>
          <ui-icon name="caret" :size="12" class="ui-picker-caret" />
        </view>
      </slot>
    </view>
    <up-picker
      ref="pickerRef"
      :show="visible"
      :title="placeholder"
      :columns="searchedColumns"
      :closeOnClickOverlay="closeOnClickOverlay"
      :defaultIndex="defaultIndex"
      keyName="label"
      @close="handleClose"
      @cancel="handleCancel"
      @change="handleChange"
      @confirm="handleConfirm"
    >
      <template #toolbar-bottom v-if="searchable">
        <view class="ui-picker-search">
          <up-search
            :show-action="false"
            icon-position="right"
            bg-color="#fff"
            border-color="#e8e8e8"
            shape="square"
            :height="36"
            :placeholder="searchPlaceholder"
            v-model="keyword"
          ></up-search>
        </view>
      </template>
    </up-picker>
  </view>
</template>

<script>
export default {
  name: 'ui-picker',
  emits: ['close', 'open', 'cancel', 'confirm', 'change', 'update:modelValue'],
  props: {
    columns: {
      type: Array,
      default: () => {
        return [[]]
      }
    },
    closeOnClickOverlay: {
      type: Boolean,
      default: true
    },
    modelValue: {
      type: [String, Number, Array]
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    dark: {
      type: Boolean,
      default: false
    },
    searchable: {
      type: Boolean,
      default: false
    },
    searchPlaceholder: {
      type: String,
      default: '请输入搜索关键字'
    },
    emptyOption: {
      type: Object,
      default: () => ({
        label: '全部',
        value: ''
      })
    }
  },
  data() {
    return {
      visible: false,
      defaultIndex: [],
      keyword: ''
    }
  },
  watch: {
    modelValue: {
      handler(val) {
        this.defaultIndex = this.getDefaultIndex(val)
      },
      immediate: true
    },
    visible(val) {
      if (val && this.modelValue) {
        this.$refs.pickerRef.setIndexs(this.getDefaultIndex(this.modelValue), true)
      }
      this.$emit('open', val)
    }
  },
  computed: {
    isMultiple() {
      return Array.isArray(this.columns[0])
    },
    innerColumns() {
      if (this.columns.length === 0) {
        return [[]]
      }
      if (this.isMultiple) {
        return this.columns
      }
      return [this.columns]
    },
    searchedColumns() {
      const result = this.keyword
        ? this.innerColumns.map(it => {
            return it.filter(item => item.label.includes(this.keyword))
          })
        : this.innerColumns

      if (this.emptyOption) {
        return result.map(it => {
          return [this.emptyOption, ...it]
        })
      }

      return result
    },
    showText() {
      const result = this.defaultIndex.map((it, index) => this.searchedColumns[index][it])
      if (this.emptyOption && result.every(item => item === undefined || item.value === this.emptyOption.value)) {
        return ''
      }
      return result
        .filter(Boolean)
        .map(it => it.label)
        .join(',')
    }
  },
  methods: {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    noop() {},
    getDefaultIndex(val) {
      if (Array.isArray(val)) {
        return val.map((it, i) => this.searchedColumns[i].findIndex(column => column.value === it))
      }
      return [this.searchedColumns[0]?.findIndex(column => column.value === val)]
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
      const value = result.value.map(it => it.value)
      // this.$emit('update:modelValue', this.isMultiple ? value : value[0])
      this.$emit('change', result)
    },
    handleConfirm(result) {
      const value = result.value.map((it, index) => (!it ? result.values[index][0].value : it.value))
      this.hidePicker()
      this.$emit('update:modelValue', this.isMultiple ? value : value[0])
      this.$emit('confirm', {
        ...result,
        value,
        indexs: result.indexs.map(it => (it === -1 ? 0 : it))
      })
    }
  }
}
</script>

<style lang="scss">
.ui-picker {
  position: relative;
  display: inline-block;

  &-trigger {
    max-width: 110px;
  }

  &-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px 7px 6px 12px;
    background-color: rgba(0, 0, 0, 0.04);
    border-radius: 6px;
    min-height: 30px;

    &.dark {
      background-color: rgba(255, 255, 255, 0.2);
      color: #fff;
    }
  }

  &-text {
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &-caret {
    margin-left: 3px;
    ::v-deep .ui-iconfont {
      vertical-align: middle !important;
    }
  }

  &-search {
    padding: 8px 15px;
  }
}
</style>
