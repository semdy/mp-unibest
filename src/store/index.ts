import { createPinia } from 'pinia'
// import { createPersistedState } from 'pinia-plugin-persistedstate'

const store = createPinia()

// store.use(
//   createPersistedState({
//     storage: {
//       getItem: uni.getStorageSync,
//       setItem: uni.setStorageSync,
//     },
//   }),
// )

export default store

export * from './user'
export * from './token'
export * from './diffRecords'
export * from './pickerData'
export * from './policyData'
export * from './summaryData'
export * from './summaryDetail'
