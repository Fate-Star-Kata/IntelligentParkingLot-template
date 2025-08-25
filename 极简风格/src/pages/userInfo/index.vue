<template>
  <div class="modern-userinfo-page">
    <div class="userinfo-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">用户中心</h1>
          <p class="page-subtitle">管理您的个人信息和偏好设置</p>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <div class="main-content">
        <div class="content-card">
          <!-- Tab 导航 -->
          <div class="tab-navigation">
            <div class="tab-list">
              <button 
                v-for="tab in tabList" 
                :key="tab.key" 
                :class="['tab-button', { 'tab-active': activeTab === tab.key }]"
                @click="activeTab = tab.key"
              >
                <div class="tab-icon">
                  <svg v-if="tab.key === 'baseInfo'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <svg v-else-if="tab.key === 'changePassword'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <circle cx="12" cy="16" r="1"></circle>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <svg v-else-if="tab.key === 'parkingPreference'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14,2 14,8 20,8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10,9 9,9 8,9"></polyline>
                  </svg>
                </div>
                <span class="tab-label">{{ tab.label }}</span>
              </button>
            </div>
          </div>

          <!-- Tab 内容 -->
          <div class="tab-content">
            <div class="content-wrapper">
              <BaseInfo v-show="activeTab === 'baseInfo'" />
              <ChangePassword v-show="activeTab === 'changePassword'" />
              <ParkingPreference v-show="activeTab === 'parkingPreference'" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import BaseInfo from 'components/pages/userInfo/BaseInfo.vue'
import ChangePassword from 'components/pages/userInfo/ChangePassword.vue'
import ParkingPreference from 'components/pages/userInfo/ParkingPreference.vue'

// 定义页面元数据
defineOptions({
  name: 'UserInfo'
})

// 响应式数据
const activeTab = ref<string>('baseInfo')

watch(activeTab, (val) => {
  console.log(val);
})

// Tab 列表配置
const tabList = reactive([
  {
    key: 'baseInfo',
    label: '基本信息'
  },
  {
    key: 'changePassword',
    label: '修改密码'
  },
  {
    key: 'parkingPreference',
    label: '停车偏好'
  }
])
</script>

<style scoped>
.modern-userinfo-page {
  min-height: 100vh;
  background: linear-gradient(135deg, rgb(var(--bg)) 0%, rgb(var(--bg-muted)) 100%);
  padding: 2rem 0;
}

.userinfo-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.page-header {
  margin-bottom: 2rem;
}

.header-content {
  text-align: center;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: rgb(var(--text));
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
}

.page-subtitle {
  font-size: 1.125rem;
  color: rgb(var(--text-secondary));
  margin: 0;
  font-weight: 400;
}

@media (max-width: 768px) {
  .page-subtitle {
    font-size: 1rem;
  }
}

.main-content {
  display: flex;
  justify-content: center;
}

.content-card {
  background: rgb(var(--bg-elevated));
  border: 1px solid rgb(var(--border));
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  width: 100%;
  max-width: 56rem;
}

.tab-navigation {
  background: rgb(var(--bg));
  border-bottom: 1px solid rgb(var(--border));
  padding: 1.5rem;
}

.tab-list {
  display: flex;
  gap: 0.5rem;
  background: rgb(var(--bg-muted));
  border-radius: var(--radius-lg);
  padding: 0.25rem;
}

@media (max-width: 640px) {
  .tab-list {
    flex-direction: column;
    gap: 0.25rem;
  }
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  border: none;
  background: transparent;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(var(--text-secondary));
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  justify-content: center;
}

@media (max-width: 640px) {
  .tab-button {
    justify-content: flex-start;
    padding: 1rem 1.5rem;
  }
}

.tab-button:hover {
  background: rgb(var(--bg-elevated));
  color: rgb(var(--text));
}

.tab-button.tab-active {
  background: rgb(var(--bg-elevated));
  color: rgb(var(--primary));
  box-shadow: var(--shadow-sm);
}

.tab-icon {
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-icon svg {
  width: 100%;
  height: 100%;
  stroke-width: 2;
}

.tab-label {
  font-weight: 500;
}

.tab-content {
  padding: 2rem;
}

@media (max-width: 768px) {
  .tab-content {
    padding: 1.5rem;
  }
}

.content-wrapper {
  min-height: 400px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .userinfo-container {
    padding: 0 1rem;
  }
}

@media (max-width: 768px) {
  .modern-userinfo-page {
    padding: 1rem 0;
  }
  
  .page-header {
    margin-bottom: 1.5rem;
  }
  
  .tab-navigation {
    padding: 1rem;
  }
}

/* 禁用动画的用户偏好 */
@media (prefers-reduced-motion: reduce) {
  .tab-button {
    transition: none;
  }
}
</style>