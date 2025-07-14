import type {
  HttpData,
  HttpDownloadTask,
  HttpParams,
  HttpRequestConfig,
  HttpRequestTask,
  HttpTask,
  HttpUploadTask
} from 'luch-request'
import Request from 'luch-request'

export type { HttpRequestConfig }

declare class HttpRequest extends Request {
  request<T = any, D = HttpRequestTask>(config: HttpRequestConfig<D>): Promise<T>

  get<T = any, D = HttpRequestTask>(url: string, params?: HttpParams, config?: HttpRequestConfig<D>): Promise<T>

  delete<T = any, D = HttpRequestTask>(url: string, data?: HttpData, config?: HttpRequestConfig<D>): Promise<T>

  head<T = any, D = HttpRequestTask>(url: string, data?: HttpData, config?: HttpRequestConfig<D>): Promise<T>

  options<T = any, D = HttpRequestTask>(url: string, data?: HttpData, config?: HttpRequestConfig<D>): Promise<T>

  post<T = any, D = HttpRequestTask>(url: string, data?: HttpData, config?: HttpRequestConfig<D>): Promise<T>

  put<T = any, D = HttpRequestTask>(url: string, data?: HttpData, config?: HttpRequestConfig<D>): Promise<T>

  connect<T = any, D = HttpRequestTask>(url: string, data?: HttpData, config?: HttpRequestConfig<D>): Promise<T>

  trace<T = any, D = HttpRequestTask>(url: string, data?: HttpData, config?: HttpRequestConfig<D>): Promise<T>

  upload<T = any, D = HttpUploadTask>(url: string, config?: HttpRequestConfig<D>): Promise<T>

  download<T = any, D = HttpDownloadTask>(url: string, config?: HttpRequestConfig<D>): Promise<T>

  middleware<T = any, D = HttpTask>(config: HttpRequestConfig<D>): Promise<T>
}

const http = new Request() as HttpRequest

const origHttpGet = http.get

// 重写get方法，保持跟post方法传参一致
http.get = <T = any, D = HttpRequestTask>(
  url: string,
  params?: HttpParams,
  config?: HttpRequestConfig<D>
): Promise<T> => {
  return origHttpGet.call(http, url, { params, ...config }) as Promise<T>
}

export { http }
