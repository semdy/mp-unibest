<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'
import authorize from '@/utils/authorize'
import { usePickerDataStore } from '@/store'

// import { getCurrentPage } from '@/utils/util'
// import { shareMixins } from '@/config'

// function routeChangeHandle() {
//   const curPage = getCurrentPage()
//   if (curPage && curPage.onShareAppMessage === undefined) {
//     curPage.onShareAppMessage = shareMixins.onShareAppMessage
//   }
// }

onLaunch(() => {
  const toLogin = () => {
    uni.redirectTo({
      url: '/pages/login/login',
    })
  }
  const pickerDataStore = usePickerDataStore()
  authorize.startup(true).then(token => {
    // Logined
    if (token) {
      pickerDataStore.initAllFilter()
    } else {
      toLogin()
    }
  })
  authorize.onLoginExpired(toLogin)
  /* #ifdef MP-WEIXIN */
  // 全局监听路由切换，实现全局设置分享内容
  // wx.onAppRoute(routeChangeHandle)
  // routeChangeHandle()
  /* #endif */
})
onShow(() => {
  console.log('App Show')
})
onHide(() => {
  console.log('App Hide')
})
</script>

<!-- <style lang="less">
@import './themes/lightVars.less';
@import './themes/darkVars.less';

.lightVars();
.darkVars();
</style> -->

<style lang="scss">
@import '@/uni_modules/uview-plus/index.scss';
/* stylelint-disable selector-type-no-unknown */
button::after {
  border: none;
}

swiper,
scroll-view {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

image {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}

input,
textarea {
  background-color: transparent;
}

page,
view,
text,
input,
textarea,
scroll-view,
image,
button {
  box-sizing: border-box;

  &::before,
  &::after {
    box-sizing: border-box;
  }
}

// 单行省略，优先使用 unocss: text-ellipsis
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 两行省略
.ellipsis-2 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

// 三行省略
.ellipsis-3 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
