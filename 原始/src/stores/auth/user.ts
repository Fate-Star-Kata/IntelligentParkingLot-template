import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {UserInfoNoToken} from "types/apis/auth.ts";
export const useUserStore = defineStore('user', () => {
  // 用户信息对象
  const userInfo = ref<UserInfoNoToken | null>(null)

  // 获取用户信息
  const getUserInfo = (): UserInfoNoToken | null => {
    return userInfo.value
  }

  // 设置用户信息
  const setUserInfo = (info: UserInfoNoToken | null): void => {
    userInfo.value = info
  }

  return {
    userInfo,
    getUserInfo,
    setUserInfo,
  }
}, {
  //开启持久化
  persist: true,
})
