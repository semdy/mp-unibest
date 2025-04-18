import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getDetailSalesApi } from '@/api/index'

export const useSummaryDetailStore = defineStore('summaryDetail', () => {
  const sales_detail = ref<any[]>([])

  const setData = (val: any[]) => {
    sales_detail.value = val
  }

  const appendData = (val: any[]) => {
    sales_detail.value = [...sales_detail.value, ...val]
  }

  const $reset = () => {
    sales_detail.value = []
  }

  async function getDetailSales(params) {
    // @ts-ignore
    const { sales_detail = [] } = await getDetailSalesApi(params)
    if (params.page === 1) {
      setData(sales_detail)
    } else {
      appendData(sales_detail)
    }
    return sales_detail
  }

  return {
    sales_detail,
    setData,
    appendData,
    $reset,
    getDetailSales,
  }
})
