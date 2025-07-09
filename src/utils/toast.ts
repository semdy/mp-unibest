import { delay } from './util'

let isLoadingShown = false

export function Alert(msg: string, title?: string) {
  return uni.showModal({
    title: title || '提示',
    showCancel: false,
    content: msg
  })
}

export function showLoading(title = '请稍候...', mask = true) {
  isLoadingShown = true
  return uni.showLoading({
    mask,
    title
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
  if (typeof options.title === 'object') {
    options.title = JSON.stringify(options.title)
  }
  return uni.showToast(options)
}

toast.error = (msg: string, duration = 2000, image = '') => {
  return toast({
    title: msg,
    icon: 'none',
    image,
    duration
  })
}

toast.info = (msg: string, duration = 2000, image = '') => {
  return toast({
    title: msg,
    icon: 'none',
    image,
    duration
  })
}

toast.warning = (msg: string, duration = 2000, image = '') => {
  return toast({
    title: msg,
    icon: 'fail',
    image,
    duration
  })
}

toast.success = (msg: string, duration = 2000) => {
  return toast({
    title: msg,
    icon: 'success',
    duration
  })
}
