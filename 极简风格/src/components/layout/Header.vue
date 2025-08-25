<script setup lang="ts">
import { provide, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import router from '@/router'
import { useOptionsStore } from '@/stores/options'
import Models from './btns/models.vue'
import Time from './information/time.vue'

import MenuItems from './MenuItems.vue'
import serverConfig from '@/configs'
import { useUserStore } from '@/stores/auth/user'
import { svgToBase64 } from "utils/tools.ts";
import { storeToRefs } from "pinia";

const { t } = useI18n()

const optionsStore = useOptionsStore()
const expandedMenus = ref<Set<string>>(new Set())
const website_name = serverConfig.website_name

const store = useUserStore()

const { userInfo } = storeToRefs(store)

//默认头像 适配无图片
const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120">
    <circle cx="60" cy="60" r="58" fill="#e3f2fd" stroke="#90caf9" stroke-width="2"/>
    <text
      x="60"
      y="70"
      text-anchor="middle"
      font-family="Arial, sans-serif"
      font-size="48"
      fill="#1976d2"
      font-weight="bold"
    >
      ${(userInfo?.value?.username?.[0] || '?').toUpperCase()}
    </text>
  </svg>
`

const avatar = ref(`data:image/svg+xml;base64,${svgToBase64(svg)}`)

// 用户头像下拉菜单项
const userMenuItems = ref([
  {
    title: '个人资料',
    class: 'justify-between',
    badge: '新',
    event: () => {
      console.log('跳转到个人资料页面')
      router.push('/userInfo')
    }
  },
  {
    title: '设置',
    class: '',
    hide: true,
    event: () => {
      console.log('跳转到设置页面')
      // router.push('/settings')
    }
  },
  {
    title: '退出登录',
    class: '',
    event: () => {
      console.log('执行退出登录')
      router.push("/auth/login")
    }
  }
])

// 从store获取菜单项
const menuItems = optionsStore.getCurrentMenuItems

function toggleSubmenu(menuId: string) {
  if (expandedMenus.value.has(menuId)) {
    expandedMenus.value.delete(menuId)
  }
  else {
    expandedMenus.value.add(menuId)
  }
}

function isMenuExpanded(menuId: string) {
  return expandedMenus.value.has(menuId)
}

// 提供菜单状态管理函数给子组件
provide('isMenuExpanded', isMenuExpanded)
provide('toggleSubmenu', toggleSubmenu)
</script>

<template>
  <header class="modern-header">
    <div class="header-container">
      <!-- 左侧：Logo 和移动端菜单 -->
      <div class="header-start">
        <div class="mobile-menu-wrapper">
          <button class="mobile-menu-btn">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </button>
          <div class="mobile-menu-dropdown">
            <MenuItems :menu-items="menuItems" />
          </div>
        </div>
        <a href="/" class="brand-link">{{ website_name }}</a>
      </div>

      <!-- 右侧：时间、模型选择、用户菜单 -->
      <div class="header-end">
        <div class="header-actions">
          <Time format="yyyy-mm-dd hh:MM:ss" class="time-display"/>
          <Models class="models-selector" />

          <!-- 用户头像显示区域 -->
          <div class="user-menu" v-if="userInfo?.username">
            <button class="user-avatar-btn">
              <div class="avatar-wrapper">
                <img alt="用户头像" :src="avatar" class="avatar-img" />
              </div>
            </button>
            <div class="user-dropdown">
              <div v-for="(item, index) in userMenuItems" :key="index" v-show="!item.hide" class="dropdown-item" @click="item.event">
                <span>{{ item.title }}</span>
                <span v-if="item.badge" class="item-badge">{{ item.badge }}</span>
              </div>
            </div>
          </div>

          <!-- 未登录状态 -->
          <div v-else class="auth-buttons">
            <button class="auth-btn login-btn" @click="router.push('/auth/login')">
              {{ t('header.login') }}
            </button>
            <button class="auth-btn register-btn" @click="router.push('/auth/register')">
              {{ t('header.register') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.modern-header {
  background: rgb(var(--bg-elevated));
  border-bottom: 1px solid rgb(var(--border));
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  height: 4rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header-start {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mobile-menu-wrapper {
  position: relative;
  display: block;
}

@media (min-width: 1024px) {
  .mobile-menu-wrapper {
    display: none;
  }
}

.mobile-menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-md);
  background: transparent;
  border: none;
  color: rgb(var(--text));
  cursor: pointer;
  transition: all 0.2s ease;
}

.mobile-menu-btn:hover {
  background: rgb(var(--bg-muted));
}

.mobile-menu-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  background: rgb(var(--bg-elevated));
  border: 1px solid rgb(var(--border));
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  min-width: 13rem;
  padding: 0.5rem;
  z-index: 50;
  display: none;
}

.mobile-menu-wrapper:hover .mobile-menu-dropdown {
  display: block;
}

.brand-link {
  font-size: 1.25rem;
  font-weight: 600;
  color: rgb(var(--text));
  text-decoration: none;
  transition: color 0.2s ease;
}

.brand-link:hover {
  color: rgb(var(--primary));
}

.header-end {
  display: flex;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.time-display {
  font-size: 0.875rem;
  color: rgb(var(--text-secondary));
  font-weight: 500;
}

.models-selector {
  /* 样式由子组件处理 */
}

.user-menu {
  position: relative;
}

.user-avatar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-avatar-btn:hover {
  transform: scale(1.05);
}

.avatar-wrapper {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgb(var(--border));
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: rgb(var(--bg-elevated));
  border: 1px solid rgb(var(--border));
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  min-width: 13rem;
  padding: 0.5rem;
  z-index: 50;
  display: none;
}

.user-menu:hover .user-dropdown {
  display: block;
}

.dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  color: rgb(var(--text));
}

.dropdown-item:hover {
  background: rgb(var(--bg-muted));
}

.item-badge {
  background: rgb(var(--primary));
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  font-weight: 500;
}

.auth-buttons {
  display: flex;
  gap: 0.5rem;
}

.auth-btn {
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 7rem;
}

.login-btn {
  background: rgb(var(--success));
  color: white;
}

.login-btn:hover {
  background: rgb(5 150 105 / 0.9);
}

.register-btn {
  background: rgb(var(--warning));
  color: white;
}

.register-btn:hover {
  background: rgb(217 119 6 / 0.9);
}
</style>
