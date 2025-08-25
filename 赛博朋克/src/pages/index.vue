<template>
  <div class="min-h-full h-full">
    <Entrance v-if="currentMode?.id === 1" />
    <Export v-if="currentMode?.id === 2" />

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, provide } from 'vue'
import { useRouter } from 'vue-router'
import { useStateStore } from '@/stores/state/state'
import { getParkingPreference } from '@/api/user/parking'
import Entrance from '@/components/pages/userInfo/Entrance.vue'
import Export from '@/components/pages/userInfo/Export.vue'

// 使用状态store和路由
const stateStore = useStateStore()
const router = useRouter()

// 用户会员状态
const userMembershipInfo = ref({
  is_member: false,
  license_plate: '',
  preferred_area: ''
})

// 计算属性：获取当前模式
const currentMode = computed(() => {
  return stateStore.getCurrentLocationInfo()
})

// 检查用户会员状态
const checkMembershipStatus = async () => {
  try {
    const response = await getParkingPreference()
    if (response) {
      userMembershipInfo.value = {
        is_member: response.is_member || false,
        license_plate: response.license_plate || '',
        preferred_area: response.preferred_area || ''
      }
      console.log('获取到的会员信息:', response)

      // 如果用户未绑定会员，跳转到用户信息页面
      if (!response.is_member) {
        console.log('用户未绑定会员，跳转到用户信息页面')
        router.push('/userInfo')
        return
      }

      // 会员用户正常显示页面内容
      console.log('用户是会员，显示正常页面')
    }
  } catch (error) {
    console.error('检查会员状态失败:', error)
    // 如果获取失败，也跳转到用户信息页面
    router.push('/userInfo')
  }
}

// 组件挂载时检查会员状态
onMounted(() => {
  checkMembershipStatus()
})

// 向子组件提供用户信息
provide('userMembershipInfo', userMembershipInfo)

</script>

<style scoped>

</style>
