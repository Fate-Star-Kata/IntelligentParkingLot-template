<template>
  <div class="modern-home-page">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner">
        <svg class="spinner-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
      </div>
      <p class="loading-text">正在加载停车场信息...</p>
    </div>

    <!-- 主要内容区域 -->
    <div v-else class="home-content">
      <!-- 欢迎区域 -->
      <div class="welcome-section">
        <div class="welcome-container">
          <h1 class="welcome-title">智能停车场管理系统</h1>
          <p class="welcome-subtitle">为您提供便捷、高效的停车服务体验</p>

          <!-- 当前停车场信息 -->
          <div v-if="currentMode" class="location-info">
            <div class="location-card">
              <div class="location-header">
                <svg class="location-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <h2 class="location-title">当前停车场</h2>
              </div>
              <div class="location-details">
                <p class="location-name">{{ currentMode.name }}</p>
                <p class="location-code">编号: {{ currentMode.code }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 功能区域 -->
      <div class="function-section">
        <div class="function-container">
          <!-- 入场功能 -->
          <div v-if="currentMode?.id === 1" class="function-card entrance-card">
            <div class="card-header">
              <div class="card-icon entrance-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16,17 21,12 16,7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </div>
              <h3 class="card-title">车辆入场</h3>
            </div>
            <div class="card-content">
              <Entrance />
            </div>
          </div>

          <!-- 出场功能 -->
          <div v-if="currentMode?.id === 2" class="function-card exit-card">
            <div class="card-header">
              <div class="card-icon exit-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="8,17 3,12 8,7"></polyline>
                  <line x1="3" y1="12" x2="15" y2="12"></line>
                </svg>
              </div>
              <h3 class="card-title">车辆出场</h3>
            </div>
            <div class="card-content">
              <Export />
            </div>
          </div>

          <!-- 无可用功能时的提示 -->
          <div v-if="!currentMode || (currentMode.id !== 1 && currentMode.id !== 2)" class="no-function-card">
            <div class="no-function-content">
              <svg class="no-function-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <h3 class="no-function-title">暂无可用功能</h3>
              <p class="no-function-text">请选择正确的停车场位置或联系管理员</p>
            </div>
          </div>
        </div>
      </div>
    </div>
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

// 加载状态
const isLoading = ref(true)

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
  } finally {
    // 无论成功还是失败，都要停止加载状态
    isLoading.value = false
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
.modern-home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, rgb(var(--bg)) 0%, rgb(var(--bg-muted)) 100%);
  display: flex;
  flex-direction: column;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 1.5rem;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner-icon {
  width: 3rem;
  height: 3rem;
  color: rgb(var(--primary));
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 1.125rem;
  color: rgb(var(--text-secondary));
  font-weight: 500;
}

.home-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.welcome-section {
  background: rgb(var(--bg-elevated));
  border-bottom: 1px solid rgb(var(--border));
  padding: 3rem 0;
}

.welcome-container {
  margin: 0 auto;
  padding: 0 1.5rem;
  text-align: center;
}

.welcome-title {
  font-size: 3rem;
  font-weight: 800;
  color: rgb(var(--text));
  margin-bottom: 1rem;
  line-height: 1.2;
}

@media (max-width: 768px) {
  .welcome-title {
    font-size: 2.25rem;
  }
}

.welcome-subtitle {
  font-size: 1.25rem;
  color: rgb(var(--text-secondary));
  margin-bottom: 2rem;
  font-weight: 400;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .welcome-subtitle {
    font-size: 1.125rem;
  }
}

.location-info {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.location-card {
  background: rgb(var(--bg));
  border: 1px solid rgb(var(--border));
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
  width: 100%;
}

.location-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.location-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: rgb(var(--primary));
  stroke-width: 2;
}

.location-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: rgb(var(--text));
  margin: 0;
}

.location-details {
  text-align: left;
}

.location-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: rgb(var(--text));
  margin-bottom: 0.5rem;
}

.location-code {
  font-size: 0.875rem;
  color: rgb(var(--text-secondary));
  font-family: 'Courier New', monospace;
  margin: 0;
}

.function-section {
  flex: 1;
  padding: 3rem 0;
}

.function-container {
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: center;
}

.function-card {
  background: rgb(var(--bg-elevated));
  border: 1px solid rgb(var(--border));
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  width: 100%;
  transition: all 0.3s ease;
}

.function-card:hover {
  transform: translateY(-0.25rem);
  box-shadow: var(--shadow-xl);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 2rem 2rem 1rem;
}

.card-icon {
  width: 3rem;
  height: 3rem;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon svg {
  width: 1.5rem;
  height: 1.5rem;
  stroke-width: 2;
}

.entrance-icon {
  background: rgb(var(--success) / 0.1);
  color: rgb(var(--success));
}

.exit-icon {
  background: rgb(var(--warning) / 0.1);
  color: rgb(var(--warning));
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgb(var(--text));
  margin: 0;
}

.card-content {
  padding: 0 2rem 2rem;
}

.no-function-card {
  background: rgb(var(--bg-elevated));
  border: 1px solid rgb(var(--border));
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  width: 100%;
  padding: 3rem 2rem;
}

.no-function-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.no-function-icon {
  width: 4rem;
  height: 4rem;
  color: rgb(var(--text-secondary));
  stroke-width: 1.5;
}

.no-function-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: rgb(var(--text));
  margin: 0;
}

.no-function-text {
  font-size: 1rem;
  color: rgb(var(--text-secondary));
  margin: 0;
  line-height: 1.5;
}

/* 禁用动画的用户偏好 */
@media (prefers-reduced-motion: reduce) {
  .spinner-icon {
    animation: none;
  }

  .function-card {
    transition: none;
  }

  .function-card:hover {
    transform: none;
  }
}
</style>
