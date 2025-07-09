import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useTokenStore } from './token'

const initState = { nickname: '', avatar: '' }

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<IUserInfo>({ ...initState })
  const tokenStore = useTokenStore()

  const setUserInfo = (val: IUserInfo) => {
    userInfo.value = val
  }

  const $reset = () => {
    userInfo.value = { ...initState }
    tokenStore.$reset()
  }

  const isLogined = computed(() => !!tokenStore.token)

  return {
    token: tokenStore.token,
    userInfo,
    setUserInfo,
    isLogined,
    $reset
  }
})
