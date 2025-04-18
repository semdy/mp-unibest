import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTokenStore = defineStore('token', () => {
  const token = ref<string | null>(null)

  const setToken = (val: string | null) => {
    token.value = val
  }

  const $reset = () => {
    token.value = null
  }

  return {
    setToken,
    token,
    $reset,
  }
})
