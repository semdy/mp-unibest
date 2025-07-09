import { ref } from 'vue'
import { defineStore } from 'pinia'

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
    $reset
  }
})
