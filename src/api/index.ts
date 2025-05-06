import { http } from '@/utils/luch-request'

const prefix = '/api'

// 登录授权认证
export function getTokenByJsCode(jsCode: string): Promise<any> {
  return http.post(`${prefix}/login`, { jsCode }, { custom: { auth: false } })
}

// 授权获取手机号
export function getAuthorizedInfo(code: string): Promise<any> {
  return http.post(`${prefix}/authorize`, { code })
}

export function sendCheckCode(params?: any) {
  return http.post(`${prefix}/send_checkcode/`, params, { custom: { auth: false } })
}

export function loginApi(params?: any) {
  return http.post(`${prefix}/phone_login/`, params, { custom: { auth: false } })
}

export function getMainFilterApi(params?: any) {
  return http.post(`${prefix}/dealer_permissions/init_all_filter/`, params)
}

export function getRebatePolicyFilterApi(params?: any) {
  return http.post(`${prefix}/rebate_policy/init_filter/`, params)
}

export function getSalesFilterApi(params?: any) {
  return http.post(`${prefix}/dealer_permissions/filter_sales/`, params)
}

export function getSalesRecordFilterApi(params?: any) {
  return http.post(`${prefix}/sales_record/filter_sales_record/`, params)
}

export function getReportInvoiceApi(params?: any) {
  return http.post(`${prefix}/dealer_permissions/report_invoice/`, params)
}

export function getSummarySalesApi(params?: any) {
  return http.post(`${prefix}/dealer_permissions/summary_sales/`, params)
}

export function getDetailSalesApi(params?: any) {
  return http.post(`${prefix}/dealer_permissions/detail_sales/`, params)
}

export function getRelateDetailCompareApi(params?: any) {
  return http.post(`${prefix}/dealer_permissions/relate_detail_compare/`, params)
}

export function getPolicyReportApi(params?: any) {
  return http.post(`${prefix}/rebate_settlement/policy_report/`, params)
}

export function getPolicyReportDetailApi(policy_id: string) {
  return http.get(`${prefix}/rebate_policy/${policy_id}`)
}

export function getDiffRecordReportApi(params?: any) {
  return http.post(`${prefix}/sales_record/sales_record_report/`, params)
}

export function getDiffRecordReportDetailApi(params?: any) {
  return http.post(`${prefix}/sales_record/sales_record_detail/`, params)
}

export function submitDifferenceApi(params?: any) {
  return http.post(`${prefix}/sales_record/submit_difference/`, params)
}

export function approveDifferenceApi(params?: any) {
  return http.post(`${prefix}/sales_record/approval_difference/`, params)
}

export function refreshTokenApi(params?: any) {
  return http.post(`${prefix}/token/refresh/`, params, { custom: { refreshToken: true } })
}

export function uploadFile(config: any) {
  return http.upload(`${prefix}/file_upload/`, config)
}
