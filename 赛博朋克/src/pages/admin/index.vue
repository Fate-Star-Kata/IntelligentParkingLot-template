<!-- 关闭这个页面 Motion 组件的所有ts检测 -->
<script setup lang="ts">
import { ref } from 'vue'
import { Motion } from 'motion-v'
import AdminHeader from '@/components/pages/admin/header.vue'
import AdminNavbar from '@/components/pages/admin/navbar.vue'

// 侧边栏折叠状态
const isCollapse = ref(false)

// 切换侧边栏折叠状态
function toggleSidebar() {
  isCollapse.value = !isCollapse.value
}

// 动画配置
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' } as any
}

const sidebarVariants = {
  initial: { x: -200, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.5, ease: 'easeOut' } as any
}

// 侧边栏宽度动画配置
const sidebarWidthVariants = {
  expanded: { width: '240px' },
  collapsed: { width: '64px' },
  transition: { duration: 0.3, ease: 'easeOut' } as any
}

const headerVariants = {
  initial: { y: -60, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.5, delay: 0.2, ease: 'easeOut' } as any
}

const cardVariants = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  whileHover: {
    scale: 1.02,
    y: -5,
    transition: { duration: 0.2, ease: 'easeOut' } as any
  },
  transition: { duration: 0.4, ease: 'easeOut' } as any
}
</script>

<template>
  <div class="app-shell theme-modern">
    <div class="modern-admin-layout">
      <Motion :initial="pageVariants.initial" :animate="pageVariants.animate" :transition="pageVariants.transition"
        class="admin-container">
        <!-- 侧边栏 -->
        <Motion :animate="isCollapse ? sidebarWidthVariants.collapsed : sidebarWidthVariants.expanded"
          :transition="sidebarWidthVariants.transition" class="sidebar-container">
          <div class="sidebar-wrapper">
            <Motion :initial="sidebarVariants.initial" :animate="sidebarVariants.animate"
              :transition="sidebarVariants.transition">
              <AdminNavbar :is-collapse="isCollapse" />
            </Motion>
          </div>
        </Motion>

        <!-- 主内容区域 -->
        <div class="main-container">
          <!-- 头部 -->
          <div class="header-container">
            <Motion :initial="headerVariants.initial" :animate="headerVariants.animate"
              :transition="headerVariants.transition" style="width: 100%;">
              <AdminHeader @toggle-sidebar="toggleSidebar" :is-collapse="isCollapse" />
            </Motion>
          </div>

          <!-- 主要内容 -->
          <div class="content-container">
            <div class="content-wrapper">
              <!-- 子路由内容 -->
              <Motion :initial="cardVariants.initial" :animate="cardVariants.animate"
                :transition="{ ...cardVariants.transition, delay: 0.2 }" class="route-content">
                <router-view />
              </Motion>
            </div>
          </div>
        </div>
      </Motion>
    </div>
  </div>
</template>

<style scoped>
.modern-admin-layout {
  height: 100vh;
  background: rgb(var(--bg));
  overflow: hidden;
}

.admin-container {
  display: flex;
  height: 100vh;
  width: 100%;
}

/* 侧边栏样式 */
.sidebar-container {
  background: rgb(var(--bg-elevated));
  border-right: 1px solid rgb(var(--border));
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
  z-index: 100;
}

.sidebar-wrapper {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
}

/* 主内容区域 */
.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: rgb(var(--bg));
}

/* 头部样式 */
.header-container {
  background: rgb(var(--bg-elevated));
  border-bottom: 1px solid rgb(var(--border));
  box-shadow: var(--shadow-sm);
  position: relative;
  z-index: 50;
  height: 64px;
  display: flex;
  align-items: center;
}

/* 内容区域 */
.content-container {
  flex: 1;
  background: rgb(var(--bg-muted));
  overflow-y: auto;
  overflow-x: hidden;
}

.content-wrapper {
  padding: 1.5rem;
  min-height: 100%;
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 1rem;
  }
}

.route-content {
  background: rgb(var(--bg-elevated));
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  min-height: calc(100vh - 64px - 3rem);
  overflow: hidden;
}

@media (max-width: 768px) {
  .route-content {
    min-height: calc(100vh - 64px - 2rem);
    border-radius: var(--radius-lg);
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .sidebar-container {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 200;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .sidebar-container.show {
    transform: translateX(0);
  }

  .main-container {
    margin-left: 0;
  }
}

@media (max-width: 640px) {
  .header-container {
    height: 56px;
  }

  .route-content {
    min-height: calc(100vh - 56px - 2rem);
  }
}

/* 滚动条样式 */
.content-container::-webkit-scrollbar {
  width: 6px;
}

.content-container::-webkit-scrollbar-track {
  background: rgb(var(--bg-muted));
}

.content-container::-webkit-scrollbar-thumb {
  background: rgb(var(--border));
  border-radius: 3px;
}

.content-container::-webkit-scrollbar-thumb:hover {
  background: rgb(var(--text-secondary));
}

/* 动画过渡 */
.main-container {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 卡片增强样式 */
.route-content {
  transition: all 0.3s ease;
}

.route-content:hover {
  box-shadow: var(--shadow-lg);
}

/* 禁用动画的用户偏好 */
@media (prefers-reduced-motion: reduce) {
  .main-container {
    transition: none;
  }

  .route-content {
    transition: none;
  }

  .route-content:hover {
    transform: none;
    box-shadow: var(--shadow-md);
  }

  .sidebar-container {
    transition: none;
  }
}

/* 深色主题适配 */
@media (prefers-color-scheme: dark) {
  .content-container::-webkit-scrollbar-track {
    background: rgb(var(--bg));
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .sidebar-container {
    border-right: 2px solid rgb(var(--border));
  }

  .header-container {
    border-bottom: 2px solid rgb(var(--border));
  }
}

/* 焦点可见性 */
.route-content:focus-visible {
  outline: 2px solid rgb(var(--primary));
  outline-offset: 2px;
}
</style>
