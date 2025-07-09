export function formatDate(source: string | Date | null, format: string): string {
  if (!source) return ''

  const date = source instanceof Date ? source : new Date(source.replace(/-/g, '/'))

  const map: Record<string, number> = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'f+': date.getMilliseconds()
  }

  // 处理年份：yyyy 或 yy
  format = format.replace(/(y+)/g, (_, matched) => {
    return `${date.getFullYear()}`.slice(4 - matched.length)
  })

  // 处理其他时间字段
  for (const key in map) {
    const regex = new RegExp(`(${key})`, 'g')
    format = format.replace(regex, (_, matched) => {
      const value = map[key].toString()
      return matched.length === 1 ? value : value.padStart(matched.length, '0')
    })
  }

  return format
}

export function parseDate(dateStr: number | string | Date): Date {
  if (typeof dateStr === 'string') {
    dateStr = dateStr.replace(/-/g, '/')
  }
  return new Date(dateStr)
}

export function padZero(n: number): string {
  return n < 10 ? `0${n}` : `${n}`
}

export function dayAfter(target: number | string | Date, offset = 0): Date {
  const now = parseDate(target)
  now.setDate(now.getDate() + offset)
  return now
}

export function formatFloat(f: number, digit = 2): number {
  const m = 10 ** digit
  return Math.round(f * m) / m
}

export function calcSum(objArray: Record<string, any>[], key: string): number {
  return objArray.reduce((prev, cur) => cur[key] + prev, 0)
}

export function getNodeRect<T extends boolean = false>(
  selector: string,
  all?: T,
  scope?: any
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
  cancelText: string = '取消'
): Promise<boolean> {
  return new Promise(resolve => {
    uni.showModal({
      title,
      content: msg,
      confirmColor: '#08affe',
      confirmText,
      cancelText,
      success(res) {
        if (res.confirm) {
          resolve(true)
        } else {
          resolve(false)
        }
      }
    })
  })
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

export function getPrevPage(): Page.PageInstance | undefined {
  const pages = getCurrentPages()
  return pages[pages.length - 2]
}

export function getCurrentPage(): Page.PageInstance | undefined {
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

export function pickerDataAdapter(data: any[], labelName: string = 'label', valueName: string = 'value') {
  if (!data) return []
  return data.map(item => {
    if (typeof item === 'object') {
      return {
        ...item,
        label: item[labelName],
        value: item[valueName]
      }
    }
    return {
      label: item,
      value: item
    }
  })
}

export function objectToQueryString(obj: Record<string, any>) {
  return Object.keys(obj)
    .map(key => `${key}=${obj[key]}`)
    .join('&')
}
