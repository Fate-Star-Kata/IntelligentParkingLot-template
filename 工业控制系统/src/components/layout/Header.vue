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

//默认头像 适配无图片 - 工业控制系统深色主题
const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120">
    <circle cx="60" cy="60" r="58" fill="#1a1a2e" stroke="#00d4ff" stroke-width="2"/>
    <text
      x="60"
      y="70"
      text-anchor="middle"
      font-family="Arial, sans-serif"
      font-size="48"
      fill="#00d4ff"
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
  <div class="industrial-header">
    <div class="header-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="mobile-menu-btn lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </div>
      </div>
      <a href="/" class="system-title">{{ website_name }}</a>
    </div>

    <div class="header-end">
      <div class="control-panel">
        <Time format="yyyy-mm-dd hh:MM:ss" class="time-display" />
        <Models class="mode-selector" />

        <!-- 用户头像显示区域 -->
        <div class="dropdown dropdown-end" v-if="userInfo?.username">
          <div tabindex="0" role="button" class="user-avatar-btn">
            <div class="avatar-container">
              <img alt="用户头像" :src="avatar" />
              <div class="status-indicator"></div>
            </div>
          </div>
          <ul tabindex="0" class="user-dropdown-menu">
            <li v-for="(item, index) in userMenuItems" :key="index" v-show="!item.hide">
              <a :class="item.class" :title="item.title" @click="item.event">
                {{ item.title }}
                <span v-if="item.badge" class="status-badge">{{ item.badge }}</span>
              </a>
            </li>
          </ul>
        </div>

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
</template>

<style lang='stylus' scoped>
.industrial-header
  display flex
  align-items center
  justify-content space-between
  padding 0 1.5rem
  height 4rem
  background linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)
  border-bottom 2px solid #00d4ff
  box-shadow 0 4px 20px rgba(0, 212, 255, 0.1)
  position relative
  z-index 1000

  &::before
    content ''
    position absolute
    top 0
    left 0
    right 0
    bottom 0
    background-image radial-gradient(circle at 20% 50%, rgba(0, 212, 255, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(0, 255, 157, 0.05) 0%, transparent 50%)
    pointer-events none

.header-start
  display flex
  align-items center
  gap 1rem

.system-title
  font-size 1.5rem
  font-weight bold
  color #00d4ff
  text-decoration none
  text-shadow 0 0 10px rgba(0, 212, 255, 0.5)
  transition all 0.3s ease

  &:hover
    color #00ff9d
    text-shadow 0 0 15px rgba(0, 255, 157, 0.7)

.mobile-menu-btn
  background rgba(0, 212, 255, 0.1)
  border 1px solid rgba(0, 212, 255, 0.3)
  color #00d4ff
  padding 0.5rem
  border-radius 0.5rem
  cursor pointer
  transition all 0.3s ease

  &:hover
    background rgba(0, 212, 255, 0.2)
    border-color #00d4ff

.industrial-dropdown-menu
  background rgba(15, 15, 35, 0.95)
  border 1px solid rgba(0, 212, 255, 0.3)
  border-radius 0.5rem
  backdrop-filter blur(10px)
  box-shadow 0 8px 32px rgba(0, 0, 0, 0.3)
  margin-top 0.75rem
  width 13rem
  padding 0.5rem
  z-index 10

.header-end
  display flex
  align-items center

.control-panel
  display flex
  align-items center
  gap 1rem

.time-display
  color #00d4ff
  font-family 'Courier New', monospace
  font-weight 500
  text-shadow 0 0 5px rgba(0, 212, 255, 0.3)

.mode-selector
  // 模式选择器样式由Models组件内部处理

.user-avatar-btn
  background rgba(0, 212, 255, 0.1)
  border 1px solid rgba(0, 212, 255, 0.3)
  border-radius 50%
  padding 0.25rem
  cursor pointer
  transition all 0.3s ease
  position relative

  &:hover
    background rgba(0, 212, 255, 0.2)
    border-color #00d4ff
    box-shadow 0 0 15px rgba(0, 212, 255, 0.4)

.avatar-container
  position relative
  width 2.5rem
  height 2.5rem

  img
    width 100%
    height 100%
    border-radius 50%
    object-fit cover

.status-indicator
  position absolute
  bottom 0
  right 0
  width 0.75rem
  height 0.75rem
  background #00ff9d
  border 2px solid #0f0f23
  border-radius 50%
  box-shadow 0 0 8px rgba(0, 255, 157, 0.6)
  animation pulse 2s infinite

.user-dropdown-menu
  background rgba(15, 15, 35, 0.95)
  border 1px solid rgba(0, 212, 255, 0.3)
  border-radius 0.5rem
  backdrop-filter blur(10px)
  box-shadow 0 8px 32px rgba(0, 0, 0, 0.3)
  margin-top 0.75rem
  width 13rem
  padding 0.5rem
  z-index 10

  li
    margin 0.25rem 0

    a
      display flex
      align-items center
      justify-content space-between
      padding 0.75rem 1rem
      color #e0e6ed
      text-decoration none
      border-radius 0.375rem
      transition all 0.3s ease

      &:hover
        background rgba(0, 212, 255, 0.1)
        color #00d4ff
        transform translateX(4px)

.status-badge
  background linear-gradient(45deg, #00d4ff, #00ff9d)
  color #0f0f23
  font-size 0.75rem
  font-weight bold
  padding 0.25rem 0.5rem
  border-radius 1rem
  text-shadow none

.auth-buttons
  display flex
  gap 0.5rem

.auth-btn
  padding 0.5rem 1.5rem
  border none
  border-radius 0.375rem
  font-weight 500
  cursor pointer
  transition all 0.3s ease
  text-transform uppercase
  letter-spacing 0.5px

  &.login-btn
    background linear-gradient(45deg, #00d4ff, #0099cc)
    color #ffffff

    &:hover
      background linear-gradient(45deg, #00b8e6, #0088bb)
      box-shadow 0 4px 15px rgba(0, 212, 255, 0.3)
      transform translateY(-2px)

  &.register-btn
    background linear-gradient(45deg, #00ff9d, #00cc7a)
    color #0f0f23

    &:hover
      background linear-gradient(45deg, #00e68a, #00b366)
      box-shadow 0 4px 15px rgba(0, 255, 157, 0.3)
      transform translateY(-2px)

@keyframes pulse
  0%
    box-shadow 0 0 8px rgba(0, 255, 157, 0.6)
  50%
    box-shadow 0 0 15px rgba(0, 255, 157, 0.9)
  100%
    box-shadow 0 0 8px rgba(0, 255, 157, 0.6)
</style>
