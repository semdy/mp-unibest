export function formatDate(source: string | Date | null, format: string): string {
  if (!source) return ''
  source = !(source instanceof Date) ? new Date(source.replace(/-/g, '/')) : source
  const o = {
    'M+': source.getMonth() + 1,
    'd+': source.getDate(),
    'H+': source.getHours(),
    'm+': source.getMinutes(),
    's+': source.getSeconds(),
    'q+': Math.floor((source.getMonth() + 3) / 3),
    'f+': source.getMilliseconds(),
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (source.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length),
      )
    }
  }
  return format
}

export function parseDate(dateStr: string | Date | null | undefined): Date {
  if (typeof dateStr === 'string') {
    dateStr = dateStr.replace(/-/g, '/')
  }
  return new Date(dateStr)
}

export function padZero(n: number): string {
  return n < 10 ? '0' + n : '' + n
}

export function dayAfter(target: string | Date | null | undefined, offset = 0): Date {
  const now = parseDate(target)
  now.setDate(now.getDate() + offset)
  return now
}

export function formatFloat(f: number, digit = 2): number {
  const m = Math.pow(10, digit)
  return Math.round(f * m) / m
}

export function calcSum(objArray: object[], key: string): number {
  return objArray.reduce((prev, cur) => cur[key] + prev, 0)
}

export function getNodeRect<T extends boolean = false>(
  selector: string,
  all?: T,
  scope?: any,
): Promise<T extends true ? UniNamespace.NodeInfo[] : UniNamespace.NodeInfo> {
  return new Promise(resolve => {
    let query = uni.createSelectorQuery()
    if (scope) {
      query = query.in(scope)
    }
    query[all ? 'selectAll' : 'select'](selector)
      .boundingClientRect(rect => {
        if (all && Array.isArray(rect) && rect.length) {
          resolve(rect as any)
        }
        if (!all && rect) {
          resolve(rect as any)
        }
      })
      .exec()
  })
}

export function getNode(selector: string, all?: boolean, scope?: any): Promise<any | any[]> {
  return new Promise((resolve, reject) => {
    let query = uni.createSelectorQuery()
    if (scope) {
      query = query.in(scope)
    }
    query[all ? 'selectAll' : 'select'](selector)
      .node(() => {})
      .exec((res: any[]) => {
        if (res.length) {
          if (all) {
            resolve(res.map(r => r.node))
          } else {
            resolve(res[0].node)
          }
        } else {
          reject(res)
        }
      })
  })
}

const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')

export function uuid(len: number, radix?: number): string {
  const chars = CHARS
  const uuid = []
  let i

  radix = radix || chars.length

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
  } else {
    // rfc4122, version 4 form
    let r

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16)
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return uuid.join('')
}

export function isObj(x: any): x is Record<any, any> {
  const type = typeof x
  return x !== null && (type === 'object' || type === 'function')
}

export function parseParams(params: Record<any, any> = {}): string {
  const result = Object.keys(params).map(key => {
    if (params[key] === undefined) return ''
    return `${key}=${encodeURIComponent(params[key])}`
  })
  return result.join('&')
}

export function confirm(
  msg: string,
  title: string = '',
  confirmText: string = '确定',
  cancelText: string = '取消',
): Promise<boolean> {
  return new Promise(resolve => {
    uni.showModal({
      title: title,
      content: msg,
      confirmColor: '#08affe',
      confirmText: confirmText,
      cancelText: cancelText,
      success: function (res) {
        if (res.confirm) {
          resolve(true)
        } else {
          resolve(false)
        }
      },
    })
  })
}

export function Alert(msg: string, title?: string) {
  return uni.showModal({
    title: title || '提示',
    showCancel: false,
    content: msg,
  })
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

let isLoadingShown = false

export function showLoading(title = '请稍候...', mask = true) {
  isLoadingShown = true
  return uni.showLoading({
    mask: mask,
    title: title,
  })
}

export function hideLoading() {
  isLoadingShown = false
  uni.hideLoading()
}

export async function toast(options: UniNamespace.ShowToastOptions) {
  if (isLoadingShown) {
    await delay(200)
  }
  return uni.showToast(options)
}

toast.error = (msg: string, duration = 2000, image = '') => {
  return toast({
    title: typeof msg === 'object' ? JSON.stringify(msg) : msg,
    icon: 'none',
    image: image,
    duration: duration,
  })
}

toast.info = (msg: string, duration = 2000, image = '') => {
  return toast({
    title: typeof msg === 'object' ? JSON.stringify(msg) : msg,
    icon: 'none',
    image: image,
    duration: duration,
  })
}

toast.success = (msg: string, duration = 2000) => {
  return toast({
    title: typeof msg === 'object' ? JSON.stringify(msg) : msg,
    icon: 'success',
    duration: duration,
  })
}

export function getPrevPage(): Page.PageInstance | undefined {
  // eslint-disable-next-line
  const pages = getCurrentPages()
  return pages[pages.length - 2]
}

export function getCurrentPage(): Page.PageInstance | undefined {
  // eslint-disable-next-line
  const pages = getCurrentPages()
  return pages[pages.length - 1]
}

export function rpxToPx(rpx: number) {
  const screenWidth = uni.getSystemInfoSync().screenWidth
  return (screenWidth * rpx) / 750
}

export function pxToRpx(px: number) {
  const screenWidth = uni.getSystemInfoSync().screenWidth
  return (750 * px) / screenWidth
}

export function pickerDataAdapter(data: any[], labelName: string, valueName: string) {
  if (!data) return []
  return data.map(item => {
    if (typeof item === 'object') {
      return {
        ...item,
        label: item[labelName],
        value: item[valueName],
      }
    }
    return {
      label: item,
      value: item,
    }
  })
}

export function objectToQueryString(obj: Record<string, any>) {
  return Object.keys(obj)
    .map(key => `${key}=${obj[key]}`)
    .join('&')
}
