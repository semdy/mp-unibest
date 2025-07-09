import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getMainFilterApi, getSalesRecordFilterApi, getSalesFilterApi, getRebatePolicyFilterApi } from '@/api/index'
import { pickerDataAdapter } from '@/utils/util'

const initState = {
  audit_types: [] as IPickerItem[],
  audit_dealers: [] as IPickerItem[],
  audit_quarters: [] as IPickerItem[],
  diff_customers: [] as IPickerItem[],
  diff_quarters: [] as IPickerItem[],
  diff_dealers: [] as IPickerItem[],
  diff_diffTypes: [] as IPickerItem[],
  diff_approveStatus: [] as IPickerItem[],
  sales_customers: [] as IPickerItem[],
  sales_month: [] as IPickerItem[],
  policy_dealers: [] as IPickerItem[],
  policy_quarters: [] as IPickerItem[]
}

type IPickerItem = {
  label: string
  value: string
  [key: string]: any
}

export type IPickerData = typeof initState

export const usePickerDataStore = defineStore('pickerData', () => {
  const pickerData = ref<IPickerData>({ ...initState })

  const setPickerData = (val: IPickerData) => {
    pickerData.value = { ...pickerData.value, ...val }
  }

  const $reset = () => {
    pickerData.value = { ...initState }
  }

  const initAllFilter = async () => {
    let [auditData, diffData, policyData] = await Promise.all([
      getMainFilterApi(),
      getSalesRecordFilterApi(),
      getRebatePolicyFilterApi()
    ])
    auditData = {
      audit_types: pickerDataAdapter((auditData as any).audit_types, 'name', 'id'),
      audit_dealers: pickerDataAdapter((auditData as any).dealers, 'dealer_name', 'id'),
      audit_quarters: pickerDataAdapter((auditData as any).quarters, 'Quarter', 'id')
    } as any

    diffData = {
      diff_customers: pickerDataAdapter((diffData as any).customers),
      diff_quarters: pickerDataAdapter((diffData as any).quarters, 'Quarter', 'id'),
      diff_dealers: pickerDataAdapter((diffData as any).dealers, 'dealer_name', 'id'),
      diff_diffTypes: pickerDataAdapter((diffData as any).diff_types, 'name', 'value'),
      diff_approveStatus: pickerDataAdapter((diffData as any).approve_status, 'name', 'value')
    } as any

    policyData = {
      policy_dealers: pickerDataAdapter((policyData as any).dealers, 'dealer_name', 'id'),
      policy_quarters: pickerDataAdapter((policyData as any).quarters, 'Quarter', 'id')
    } as any

    const res = { ...auditData, ...diffData, ...policyData } as any as IPickerData

    setPickerData(res)
    return res
  }

  const filterSales = async (params: object) => {
    let salesData = await getSalesFilterApi(params)
    salesData = {
      sales_customers: pickerDataAdapter((salesData as any).customers),
      sales_month: pickerDataAdapter((salesData as any).sales_month)
    } as any
    setPickerData(salesData as any as IPickerData)
    return salesData
  }

  return {
    pickerData,
    setPickerData,
    initAllFilter,
    filterSales,
    $reset
  }
})
