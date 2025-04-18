import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getReportInvoiceApi, getSummarySalesApi } from '@/api/index'

const initState = {
  total_qty: 0,
  pass_qty: 0,
  special_sales_qty: 0,
  pass_percentage: '0%',
  audit_report: [] as any[],
  audit_info: [] as any[],
}

type ISummaryData = typeof initState

export const useSummaryDataStore = defineStore('summaryData', () => {
  const summaryData = ref<Partial<ISummaryData>>({ ...initState })

  const setData = (val: Partial<ISummaryData>) => {
    summaryData.value = { ...summaryData.value, ...val }
  }

  const appendData = (val: any[]) => {
    summaryData.value.audit_info = [...summaryData.value.audit_info, ...val]
  }

  const $reset = () => {
    summaryData.value = { ...initState }
  }

  async function getReportInvoice(params) {
    const data = await getReportInvoiceApi(params)
    setData(data as unknown as ISummaryData)
    return data
  }

  async function getSummarySales(params) {
    // @ts-ignore
    const { audit_info = [] } = await getSummarySalesApi(params)
    if (params.page === 1) {
      setData({ audit_info })
    } else {
      appendData(audit_info)
    }
    return audit_info
  }

  return {
    summaryData,
    getReportInvoice,
    getSummarySales,
    $reset,
  }
})
