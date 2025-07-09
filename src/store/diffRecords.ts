import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getDiffRecordReportApi } from '@/api/index'

export const useDiffRecordsStore = defineStore('diffRecords', () => {
  const diff_info = ref<any[]>([])

  const setData = (val: any[]) => {
    diff_info.value = val
  }

  const appendData = (val: any[]) => {
    diff_info.value = [...diff_info.value, ...val]
  }

  const updateData = ({ status, index }: { status: number; index: number }) => {
    diff_info.value[index] = {
      ...diff_info.value[index],
      approval_state: status
    }
  }

  const $reset = () => {
    diff_info.value = []
  }

  const getDiffRecordsReport = async (params: any) => {
    const { data } = await getDiffRecordReportApi(params)
    if (params.page === 1) {
      setData(data)
    } else {
      appendData(data)
    }
    return data
  }

  const updateApprovalState = ({ index, status }: { index: number; status: number }) => {
    updateData({ index, status })
  }

  return {
    diff_info,
    getDiffRecordsReport,
    updateApprovalState,
    $reset
  }
})
