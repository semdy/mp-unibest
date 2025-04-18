import { http } from '@/utils/request2'

const prefix = '/api'

// 登录授权认证
export function getTokenByJsCode(jsCode) {
  return http.post(`${prefix}/login`, { jsCode }, { custom: { auth: false } })
}

// 授权获取手机号
export function getAuthorizedInfo(code) {
  return http.post(`${prefix}/authorize`, { code })
}

export function sendCheckCode(params) {
  return http.post(`${prefix}/send_checkcode/`, params, { custom: { auth: false } })
}

export function loginApi(params) {
  return http.post(`${prefix}/phone_login/`, params, { custom: { auth: false } })
}

export function getMainFilterApi(params) {
  return http.post(`${prefix}/dealer_permissions/init_all_filter/`, params)
}

export function getRebatePolicyFilterApi(params) {
  return http.post(`${prefix}/rebate_policy/init_filter/`, params)
}

export function getSalesFilterApi(params) {
  return http.post(`${prefix}/dealer_permissions/filter_sales/`, params)
}

export function getSalesRecordFilterApi(params) {
  return http.post(`${prefix}/sales_record/filter_sales_record/`, params)
}

export function getReportInvoiceApi(params) {
  return http.post(`${prefix}/dealer_permissions/report_invoice/`, params)
}

export function getSummarySalesApi(params) {
  return http.post(`${prefix}/dealer_permissions/summary_sales/`, params)
}

export function getDetailSalesApi(params) {
  return http.post(`${prefix}/dealer_permissions/detail_sales/`, params)
}

export function getRelateDetailCompareApi(params) {
  return http.post(`${prefix}/dealer_permissions/relate_detail_compare/`, params)
}

export function getPolicyReportApi(params) {
  return http.post(`${prefix}/rebate_settlement/policy_report/`, params)
}

export function getPolicyReportDetailApi(policy_id) {
  return http.get(`${prefix}/rebate_policy/${policy_id}`)
}

export function getDiffRecordReportApi(params) {
  return http.post(`${prefix}/sales_record/sales_record_report/`, params)
}

export function getDiffRecordReportDetailApi(params) {
  return http.post(`${prefix}/sales_record/sales_record_detail/`, params)
}

export function submitDifferenceApi(params) {
  return http.post(`${prefix}/sales_record/submit_difference/`, params)
}

export function approveDifferenceApi(params) {
  return http.post(`${prefix}/sales_record/approval_difference/`, params)
}

export function refreshTokenApi(params) {
  return http.post(`${prefix}/token/refresh/`, params, { custom: { refreshToken: true } })
}

export function uploadFile(config) {
  return http.upload(`${prefix}/file_upload/`, config)
}
