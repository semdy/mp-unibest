import { Ref, ref } from 'vue'

type IUseRequestOptions<T> = {
  /** 是否立即执行 */
  immediate?: boolean
  /** 初始化数据 */
  initialData?: T
}

/**
 * useRequest是一个定制化的请求钩子，用于处理异步请求和响应。
 * @param func 一个执行异步请求的函数，返回一个包含响应数据的Promise。
 * @param options 包含请求选项的对象 {immediate, initialData}。
 * @param options.immediate 是否立即执行请求，默认为false。
 * @param options.initialData 初始化数据，默认为undefined。
 * @returns 返回一个对象{loading, error, data, run}，包含请求的加载状态、错误信息、响应数据和手动触发请求的函数。
 */
export default function useRequest<T>(
  func: () => Promise<IResData<T>>,
  options: IUseRequestOptions<T> = { immediate: false }
): {
  loading: Ref<boolean>
  error: Ref<unknown>
  data: Ref<T | undefined>
  run: () => Promise<T | undefined>
} {
  const loading = ref(false)
  const error = ref<unknown>(false)
  const data = ref<T | undefined>(options.initialData) as Ref<T | undefined>

  const run = async () => {
    loading.value = true
    try {
      const res = await func()
      data.value = res.data
      error.value = false
      return data.value
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  if (options.immediate) {
    run()
  }

  return { loading, error, data, run }
}
