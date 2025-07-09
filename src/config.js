export const shareMixins = {
  onShareAppMessage() {
    return {
      title: '票审小程序',
      path: `/${this.route || this.__route__}`
      // imageUrl: '/static/resources/baoheyi/share.png'
    }
  },
  onShareTimeline() {
    return {
      title: '票审小程序',
      query: ''
      // imageUrl: '/static/resources/baoheyi/share.png'
    }
  }
}

// export const serverMap = {
//   dev: 'https://tiscom.terumo.com.cn',
//   testing: 'https://tiscom.terumo.com.cn',
//   staging: 'https://tiscom.terumo.com.cn',
//   production: 'https://tiscom.terumo.com.cn'
// }

// export function getServerUrl() {
//   let server = serverMap[process.env.BUILD_ENV] || ''

//   /* #ifdef H5 */
//   if (process.env.NODE_ENV === 'development') {
//     server = '/'
//   }
//   /* #endif */

//   return server
// }
