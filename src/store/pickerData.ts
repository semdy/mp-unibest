import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getMainFilterApi,
  getSalesRecordFilterApi,
  getSalesFilterApi,
  getRebatePolicyFilterApi,
} from '@/api/index'
import { pickerDataAdapter } from '@/utils/util'

const initState = {
  audit_types: [],
  audit_dealers: [],
  audit_quarters: [],
  diff_customers: [],
  diff_quarters: [],
  diff_dealers: [],
  diff_diffTypes: [],
  diff_approveStatus: [],
  sales_customers: [],
  sales_month: [],
  policy_dealers: [],
  policy_quarters: [],
}

type IPickerItem = {
  label: string
  value: string
  [key: string]: any
}

export interface IPickerData {
  audit_types: IPickerItem[]
  audit_dealers: IPickerItem[]
  audit_quarters: IPickerItem[]
  diff_customers: IPickerItem[]
  diff_quarters: IPickerItem[]
  diff_dealers: IPickerItem[]
  diff_diffTypes: IPickerItem[]
  diff_approveStatus: IPickerItem[]
  sales_customers: IPickerItem[]
  sales_month: IPickerItem[]
  policy_dealers: IPickerItem[]
  policy_quarters: IPickerItem[]
}

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
      getRebatePolicyFilterApi(),
    ])
    auditData = {
      audit_types: pickerDataAdapter((auditData as any).audit_types, 'name', 'id'),
      audit_dealers: pickerDataAdapter((auditData as any).dealers, 'dealer_name', 'id'),
      audit_quarters: pickerDataAdapter((auditData as any).quarters, 'Quarter', 'id'),
    } as any

    diffData = {
      diff_customers: pickerDataAdapter((diffData as any).customers),
      diff_quarters: pickerDataAdapter((diffData as any).quarters, 'Quarter', 'id'),
      diff_dealers: pickerDataAdapter((diffData as any).dealers, 'dealer_name', 'id'),
      diff_diffTypes: pickerDataAdapter((diffData as any).diff_types, 'name', 'value'),
      diff_approveStatus: pickerDataAdapter((diffData as any).approve_status, 'name', 'value'),
    } as any

    policyData = {
      policy_dealers: pickerDataAdapter((policyData as any).dealers, 'dealer_name', 'id'),
      policy_quarters: pickerDataAdapter((policyData as any).quarters, 'Quarter', 'id'),
    } as any

    const res = { ...auditData, ...diffData, ...policyData } as any as IPickerData

    setPickerData(res)
    return res
  }

  const filterSales = async (params: object) => {
    let salesData = await getSalesFilterApi(params)
    salesData = {
      sales_customers: pickerDataAdapter((salesData as any).customers),
      sales_month: pickerDataAdapter((salesData as any).sales_month),
    } as any
    setPickerData(salesData as any as IPickerData)
    return salesData
  }

  return {
    pickerData,
    setPickerData,
    initAllFilter,
    filterSales,
    $reset,
  }
})
