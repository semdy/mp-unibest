<script>
// #ifdef APP
import callCheckVersion from '@/uni_modules/uni-upgrade-center-app/utils/call-check-version'
import checkUpdate from '@/uni_modules/uni-upgrade-center-app/utils/check-update'
// #endif
import { hideLoading, showLoading, toast } from '@/utils/toast'

const upgradeCode2MessageMap = {
  0: '当前版本已经是最新的，不需要更新',
  '-101': '暂无更新或检查appid是否填写正确',
  '-102': '请检查传参是否填写正确'
}

export default {
  data() {
    return {
      currentAppWgtVersion: '',
      hasUpdate: false,
      checkingUpdate: false,
      showLogoutConfirmModal: false,
      showUpgradeConfirmModal: false
    }
  },
  computed: {
    settings() {
      return [
        {
          title: '语言设置',
          desc: '简体中文',
          onClick: () => {
            uni.navigateTo({
              url: '/pages/language/language'
            })
          }
        },
        {
          title: '隐私协议',
          desc: '',
          onClick: () => {
            uni.navigateTo({
              url: '/pages/privacy/privacy'
            })
          }
        },
        {
          title: '用户协议',
          desc: '',
          onClick: () => {
            uni.navigateTo({
              url: '/pages/user-agreement/user-agreement'
            })
          }
        },
        {
          title: '清除缓存',
          desc: '',
          onClick: () => {}
        },
        // #ifdef APP
        {
          title: '检查版本更新',
          desc: this.hasUpdate ? '发现新版本' : this.currentAppWgtVersion,
          className: this.hasUpdate ? 'up-cell__value--red' : '',
          onClick: async () => {
            try {
              if (this.checkingUpdate) return
              this.checkingUpdate = true
              await checkUpdate()
            } catch (err) {
              toast.error(upgradeCode2MessageMap[err?.code] || err?.message || err)
            } finally {
              this.checkingUpdate = false
            }
          }
        }
        // #endif
      ]
    }
  },
  watch: {
    checkingUpdate(val) {
      if (val) {
        showLoading('检查更新中...')
      } else {
        hideLoading()
      }
    }
  },
  onLoad() {
    // #ifdef APP
    const { appWgtVersion } = uni.getSystemInfoSync()
    this.currentAppWgtVersion = appWgtVersion
    callCheckVersion().then(({ code }) => {
      this.hasUpdate = code > 0
    })
    // #endif
  },
  methods: {
    handleSwitchMerchant() {
      uni.navigateTo({
        url: '/pages/merchant/merchant'
      })
    },
    handleLogout() {
      this.showLogoutConfirmModal = true
    },
    handleConfirmLogout() {
      uni.redirectTo({
        url: '/pages/login/login'
      })
    }
  }
}
</script>

<template>
  <view class="my-page">
    <fixed-nav-bar left-icon="" title="" />
    <view class="page-content">
      <view class="top-view">
        <view class="merchant-info mb-2">
          <text class="merchant-name text-size-4.5">测试门店</text>
          <icon-button name="swap" size="12" class="ml-2" @click="handleSwitchMerchant" />
        </view>
        <view class="my-info flex items-center">
          <ui-icon name="user" class="mr-1" />
          <text class="my-name">19883893000 · 李大大</text>
        </view>
      </view>

      <ui-card class="settings-card" style="padding: 0">
        <view class="settings-card-title">常用功能</view>
        <up-cell-group class="language-list" :border="false">
          <up-cell
            v-for="(item, index) in settings"
            :key="index"
            :title="item.title"
            :value="item.desc"
            :border="false"
            :class="item.className"
            clickable
            is-link
            @click="item.onClick(item)"
          />
        </up-cell-group>
      </ui-card>

      <up-button class="logout-btn" size="large" @click="handleLogout">退出登录</up-button>
    </view>

    <confirm-modal
      v-model:show="showLogoutConfirmModal"
      title="提示"
      content="确定要退出登录吗？"
      @confirm="handleConfirmLogout"
    />

    <upgrade-confirm-modal v-model:show="showUpgradeConfirmModal" />
  </view>
</template>

<style lang="scss">
@import '@/style/res.scss';

page {
  background: #f7f8fa url($my-bg) no-repeat;
  background-size: 100% auto;
}
</style>

<style lang="scss" scoped>
.page-content {
  padding: 50px 16px 16px;
}

.top-view {
  margin-bottom: 25px;

  ::v-deep .ui-icon {
    color: $uni-color-primary;
  }
}

.my-info {
  color: $text-color;
}

.settings-card {
  background: linear-gradient(180deg, #e4ecff 0%, #fff 14%);
  border: 1px solid #fff;
  overflow: hidden;

  &-title {
    font-size: 1rem;
    font-weight: bold;
    margin: 15px 13px 8px;
  }
}

.up-cell__value--red {
  ::v-deep .u-cell__value {
    color: $uni-color-error;
  }
}

.logout-btn {
  border-color: transparent !important;
  color: $uni-color-error !important;
  margin-top: 25px;
}
</style>
