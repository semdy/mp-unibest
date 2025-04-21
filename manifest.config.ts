// manifest.config.ts
import { defineManifestConfig } from '@uni-helper/vite-plugin-uni-manifest'
import path from 'node:path'
import { loadEnv } from 'vite'

// 获取环境变量的范例
const env = loadEnv(process.env.NODE_ENV!, path.resolve(process.cwd(), 'env'))
const {
  VITE_APP_TITLE,
  VITE_UNI_APPID,
  VITE_WX_APPID,
  VITE_APP_PUBLIC_BASE,
  VITE_FALLBACK_LOCALE,
} = env

export default defineManifestConfig({
  name: VITE_APP_TITLE,
  appid: VITE_UNI_APPID,
  description: '',
  versionName: '1.0.0',
  versionCode: '100',
  transformPx: false,
  locale: VITE_FALLBACK_LOCALE, // 'zh-Hans'
  h5: {
    optimization: {
      prefetch: true,
      treeShaking: {
        enable: true,
      },
    },
    router: {
      base: VITE_APP_PUBLIC_BASE,
    },
  },
  /* 5+App特有相关 */
  'app-plus': {
    usingComponents: true,
    nvueStyleCompiler: 'uni-app',
    renderer: 'native',
    compilerVersion: 3,
    compatible: {
      ignoreVersion: true,
    },
    splashscreen: {
      alwaysShowBeforeRender: true,
      waiting: true,
      autoclose: true,
      delay: 0,
    },
    /* 模块配置 */
    modules: {},
    /* 应用发布信息 */
    distribute: {
      /* android打包配置 */
      android: {
        minSdkVersion: 30,
        targetSdkVersion: 30,
        abiFilters: ['armeabi-v7a', 'arm64-v8a'],
        permissions: [
          '<uses-permission android:name="android.permission.CHANGE_NETWORK_STATE"/>',
          '<uses-permission android:name="android.permission.MOUNT_UNMOUNT_FILESYSTEMS"/>',
          '<uses-permission android:name="android.permission.VIBRATE"/>',
          '<uses-permission android:name="android.permission.READ_LOGS"/>',
          '<uses-permission android:name="android.permission.ACCESS_WIFI_STATE"/>',
          '<uses-feature android:name="android.hardware.camera.autofocus"/>',
          '<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>',
          '<uses-permission android:name="android.permission.CAMERA"/>',
          '<uses-permission android:name="android.permission.GET_ACCOUNTS"/>',
          '<uses-permission android:name="android.permission.READ_PHONE_STATE"/>',
          '<uses-permission android:name="android.permission.CHANGE_WIFI_STATE"/>',
          '<uses-permission android:name="android.permission.WAKE_LOCK"/>',
          '<uses-permission android:name="android.permission.FLASHLIGHT"/>',
          '<uses-feature android:name="android.hardware.camera"/>',
          '<uses-permission android:name="android.permission.WRITE_SETTINGS"/>',
        ],
      },
      /* ios打包配置 */
      ios: {},
      /* SDK配置 */
      sdkConfigs: {},
      /* 图标配置 */
      icons: {
        android: {
          hdpi: 'static/app/icons/72x72.png',
          xhdpi: 'static/app/icons/96x96.png',
          xxhdpi: 'static/app/icons/144x144.png',
          xxxhdpi: 'static/app/icons/192x192.png',
        },
        ios: {
          appstore: 'static/app/icons/1024x1024.png',
          ipad: {
            app: 'static/app/icons/76x76.png',
            'app@2x': 'static/app/icons/152x152.png',
            notification: 'static/app/icons/20x20.png',
            'notification@2x': 'static/app/icons/40x40.png',
            'proapp@2x': 'static/app/icons/167x167.png',
            settings: 'static/app/icons/29x29.png',
            'settings@2x': 'static/app/icons/58x58.png',
            spotlight: 'static/app/icons/40x40.png',
            'spotlight@2x': 'static/app/icons/80x80.png',
          },
          iphone: {
            'app@2x': 'static/app/icons/120x120.png',
            'app@3x': 'static/app/icons/180x180.png',
            'notification@2x': 'static/app/icons/40x40.png',
            'notification@3x': 'static/app/icons/60x60.png',
            'settings@2x': 'static/app/icons/58x58.png',
            'settings@3x': 'static/app/icons/87x87.png',
            'spotlight@2x': 'static/app/icons/80x80.png',
            'spotlight@3x': 'static/app/icons/120x120.png',
          },
        },
      },
    },
  },
  /* 快应用特有相关 */
  quickapp: {},
  /* 小程序特有相关 */
  'mp-weixin': {
    appid: VITE_WX_APPID,
    compileType: 'miniprogram',
    projectname: '票审小程序',
    miniprogramRoot: '',
    libVersion: '3.7.12',
    editorSetting: {
      tabIndent: 'insertSpaces',
      tabSize: 2,
    },
    setting: {
      urlCheck: false,
      es6: false,
      postcss: false,
      minified: false,
      bigPackageSizeSupport: true,
      coverView: true,
      autoAudits: false,
      checkInvalidKey: true,
      checkSiteMap: true,
      uploadWithSourceMap: true,
      babelSetting: {
        ignore: [],
        disablePlugins: [],
        outputPath: '',
      },
      minifyWXSS: false,
      minifyWXML: false,
      ignoreUploadUnusedFiles: true,
      uglifyFileName: true,
    },
    optimization: {
      subPackages: true,
    },
    usingComponents: true,
    mergeVirtualHostAttributes: true,
    lazyCodeLoading: 'requiredComponents',
  },
  'mp-alipay': {
    projectname: '票审小程序',
    usingComponents: true,
    styleIsolation: 'shared',
    compileType: 'mini',
    miniprogramRoot: '',
    mergeVirtualHostAttributes: true,
    lazyCodeLoading: 'requiredComponents',
    enableParallelLoader: true,
  },
  'mp-baidu': {
    usingComponents: true,
    mergeVirtualHostAttributes: true,
  },
  'mp-toutiao': {
    usingComponents: true,
    mergeVirtualHostAttributes: true,
  },
  uniStatistics: {
    enable: false,
  },
  vueVersion: '3',
})
