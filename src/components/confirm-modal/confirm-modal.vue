<script>
export default {
  name: 'ConfirmModal',
  props: {
    contentTextAlign: {
      type: String,
      default: 'center'
    },
    showClose: {
      type: Boolean,
      default: true
    },
    asyncClose: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:show', 'confirm', 'cancel', 'close'],
  data() {
    return {
      loading: false
    }
  },
  watch: {
    show(val) {
      if (val === false && this.loading && this.asyncClose) {
        this.loading = false
      }
    }
  },
  methods: {
    onClose() {
      this.$emit('close')
      this.$emit('update:show', false)
      if (this.asyncClose && this.loading) {
        this.loading = false
      }
    },
    onConfirm() {
      this.$emit('confirm')
      if (!this.asyncClose) {
        this.onClose()
      } else {
        this.loading = true
      }
    },
    onCancel() {
      this.onClose()
      this.$emit('cancel')
    }
  }
}
</script>

<template>
  <up-modal :show="show" :content-text-align="contentTextAlign" class="confirm-modal">
    <template v-for="(_, name) in $slots" :key="name" #[name]>
      <slot :name="name" />
    </template>
    <template v-if="!$slots.confirmButton" #confirmButton>
      <view class="confirm-modal-button-group">
        <up-button class="confirm-modal-cancel-button" shape="circle" @click="onCancel">取消</up-button>
        <up-button type="primary" shape="circle" :loading="loading" @click="onConfirm">确定</up-button>
      </view>
      <view v-if="showClose" class="confirm-modal-close" @click="onClose">
        <ui-icon name="close" />
      </view>
    </template>
  </up-modal>
</template>

<style lang="scss">
.confirm-modal {
  ::v-deep .u-popup__content {
    border-radius: $u-modal-border-radius !important;
  }

  ::v-deep .u-modal {
    border-radius: $u-modal-border-radius;
  }

  ::v-deep .u-modal__title {
    color: #1d2129;
  }

  &-button-group {
    display: flex;

    & .u-button:not(:last-child) {
      margin-right: 24px;
    }
  }

  &-cancel-button {
    border-color: transparent !important;
    background-color: #f2f3f5 !important;
  }

  &-close {
    position: absolute;
    right: 0;
    top: 0;
    padding: 16px;
    line-height: 0;
    color: #86909c;
    font-size: 16px;
  }
}
</style>
