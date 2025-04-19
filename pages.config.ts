import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  globalStyle: {
    navigationStyle: 'custom',
    transparentTitle: 'always',
    titlePenetrate: 'YES',
    navigationBarTextStyle: 'black',
    navigationBarTitleText: '',
    navigationBarBackgroundColor: '#fff',
    backgroundColor: '#fff',
    backgroundTextStyle: 'light',
  },
  networkTimeout: {
    request: 10000,
  },
  window: {
    enableInPageRenderInput: 'YES',
  },
  permission: {
    'scope.userLocation': {
      desc: '你的位置信息将用于小程序位置接口的效果展示',
    },
    'scope.getFuzzyLocation': {
      desc: '你的位置信息将用于小程序位置接口的效果展示',
    },
  },
  requiredPrivateInfos: ['getFuzzyLocation', 'chooseLocation', 'chooseAddress', 'choosePoi'],
  subPackages: [],
  easycom: {
    autoscan: true,
    custom: {
      '^wd-(.*)': 'wot-design-uni/components/wd-$1/wd-$1.vue',
      '^u--(.*)': '@/uni_modules/uview-plus/components/u-$1/u-$1.vue',
      '^up-(.*)': '@/uni_modules/uview-plus/components/u-$1/u-$1.vue',
      '^u-([^-].*)': '@/uni_modules/uview-plus/components/u-$1/u-$1.vue',
      '^(?!z-paging-refresh|z-paging-load-more)z-paging(.*)':
        'z-paging/components/z-paging$1/z-paging$1.vue',
    },
  },
  tabBar: {
    color: '#888',
    selectedColor: '#2BA293',
    backgroundColor: '#fff',
    borderStyle: 'black',
    height: '50px',
    fontSize: '10px',
    iconWidth: '24px',
    spacing: '3px',
    midButton: {
      width: '65px',
      height: '65px',
      iconPath: 'static/tabbar/homekey.png',
      text: '开门',
      iconWidth: '45px',
    },
    list: [
      {
        pagePath: 'pages/review/review',
        text: '票审结果',
        iconPath: 'static/tabbar/review.png',
        selectedIconPath: 'static/tabbar/review-selected.png',
      },
      {
        pagePath: 'pages/diff/diff',
        text: '差异说明',
        iconPath: 'static/tabbar/diff.png',
        selectedIconPath: 'static/tabbar/diff-selected.png',
      },
      {
        pagePath: 'pages/policy/policy',
        text: '商务返利/促销',
        iconPath: 'static/tabbar/policy.png',
        selectedIconPath: 'static/tabbar/policy-selected.png',
      },
    ],
  },
})
