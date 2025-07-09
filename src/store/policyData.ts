import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getPolicyReportApi } from '@/api/index'

export const usePolicyDataStore = defineStore('policyData', () => {
  const policy_info = ref<any[]>([])

  const setData = (val: any[]) => {
    policy_info.value = val
  }

  const appendData = (val: any[]) => {
    policy_info.value = [...policy_info.value, ...val]
  }

  const $reset = () => {
    policy_info.value = []
  }

  const getPolicyReportData = async (params: any) => {
    const res = await getPolicyReportApi(params)
    if (params.page === 1) {
      setData(res.data || [])
    } else {
      appendData(res.data)
    }
    return res
  }

  return {
    policy_info,
    getPolicyReportData,
    $reset
  }
})
