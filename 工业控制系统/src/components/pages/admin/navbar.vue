<script setup lang="ts">
import type { AdminHeader } from '@/types/factory';
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

interface Props {
  isCollapse: boolean
}

defineProps<Props>()

const router = useRouter()
const route = useRoute()

// 菜单数据
const menuItems = ref<AdminHeader[]>([
  {
    id: '1',
    title: '仪表板',
    icon: 'Odometer',
    path: '/admin/dashboard',
  },
  {
    id: '2',
    title: '用户管理',
    icon: 'User',
    path: '/admin/userManage',
    // children: [
    //   { id: '2-1', title: '用户列表', icon: 'UserFilled', path: '/admin/userManage' },
    // ]
  },
  {
    id: '3',
    title: '内容管理',
    icon: 'Document',
    path: '/admin/content',
    // children: [
    //   { id: '3-1', title: '通知管理', icon: 'Bell', path: '/admin/content/' },
    // ]
  },
  {
    id: '4',
    title: '系统设置',
    icon: 'Setting',
    path: '/admin/settings',
    children: [
      { id: '4-1', title: '基础设置', icon: 'Tools', path: '/admin/settings/basic' },
    ]
  }
])

// 当前激活的菜单项
const activeMenu = computed(() => route.path)

// 默认展开的父菜单
const defaultOpeneds = computed(() => {
  const matched = menuItems.value.find(item =>
    item.children?.some(child => child.path === route.path)
  )
  return matched ? [matched.id] : []
})

// 处理菜单点击
function handleMenuClick(path: string) {
  if (path && path !== route.path) {
    router.push(path)
  }
}

// 监听路由变化更新
watch(() => route.path, () => {
  // 这里不用手动赋值，computed 会自动更新 activeMenu
})
</script>

<template>
  <div class="admin-navbar h-full bg-gray-800">
    <!-- Logo -->
    <div class="logo-container flex items-center justify-center h-16 border-b-2 border-cyan-500">
      <div v-if="!isCollapse" class="flex items-center">
        <div
          class="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mr-3">
          <el-icon size="20" class="text-white">
            <Platform />
          </el-icon>
        </div>
        <span class="text-cyan-400 text-lg font-bold">工控系统</span>
      </div>
      <div v-else class="flex items-center">
        <div class="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
          <el-icon size="18" class="text-white">
            <Platform />
          </el-icon>
        </div>
      </div>
    </div>

    <!-- 菜单 -->
    <div class="menu-container flex-1 overflow-y-auto">
      <el-menu :default-active="activeMenu" :default-openeds="defaultOpeneds" :collapse="isCollapse"
        :unique-opened="true" background-color="#1f2937" text-color="#9ca3af" active-text-color="#06b6d4"
        class="border-none">
        <template v-for="item in menuItems" :key="item.id">
          <template v-if="!item.hide">
            <!-- 无子菜单 -->
            <el-menu-item v-if="!item.children || item.children.length === 0" :index="item.path"
              @click="handleMenuClick(item.path)">
              <el-icon>
                <component :is="item.icon" />
              </el-icon>
              <template #title>{{ item.title }}</template>
            </el-menu-item>

            <!-- 有子菜单 -->
            <el-sub-menu v-else :index="item.id">
              <template #title>
                <el-icon>
                  <component :is="item.icon" />
                </el-icon>
                <span>{{ item.title }}</span>
              </template>

              <el-menu-item v-for="child in item.children" :key="child.id" :index="child.path" v-show="!child.hide"
                @click="handleMenuClick(child.path)">
                <el-icon v-if="child.icon" style="margin-right: 0;">
                  <component :is="child.icon" />
                </el-icon>
                <span>{{ child.title }}</span>
              </el-menu-item>
            </el-sub-menu>
          </template>
        </template>
      </el-menu>
    </div>

    <!-- 底部 -->
    <div v-if="!isCollapse" class="footer-info p-4 border-t-2 border-cyan-500">
      <div class="text-center text-gray-400 text-xs">
        <div class="font-medium text-cyan-400">工控系统 v1.0.0</div>
        <div class="mt-1 text-gray-500">© 2024 Industrial Control</div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.admin-navbar {
  background: linear-gradient(180deg, #1f2937 0%, #111827 100%);
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 12px rgba(6, 182, 212, 0.2), inset -1px 0 0 rgba(6, 182, 212, 0.3);
  border-right: 1px solid rgba(6, 182, 212, 0.3);
}

.logo-container {
  background: rgba(6, 182, 212, 0.1);
  box-shadow: 0 2px 8px rgba(6, 182, 212, 0.2);
}

.menu-container {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
  background: rgba(0, 0, 0, 0.2);
}

.menu-container::-webkit-scrollbar {
  width: 6px;
}

.menu-container::-webkit-scrollbar-track {
  background: rgba(6, 182, 212, 0.1);
  border-radius: 3px;
}

.menu-container::-webkit-scrollbar-thumb {
  background: rgba(6, 182, 212, 0.5);
  border-radius: 3px;
}

.menu-container::-webkit-scrollbar-thumb:hover {
  background: rgba(6, 182, 212, 0.7);
}

:deep(.el-menu) {
  border-right: none;
  padding: 0 12px;
  background: transparent !important;
}

:deep(.el-menu-item) {
  height: 44px;
  line-height: 44px;
  margin: 2px 0;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  background: rgba(6, 182, 212, 0.05) !important;
}

:deep(.el-sub-menu .el-sub-menu__title) {
  height: 44px;
  line-height: 44px;
  margin: 2px 0;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  background: rgba(6, 182, 212, 0.05) !important;
}

:deep(.el-menu-item:hover) {
  background: rgba(6, 182, 212, 0.2) !important;
  color: #06b6d4 !important;
  border-color: rgba(6, 182, 212, 0.5);
  box-shadow: 0 0 10px rgba(6, 182, 212, 0.3);
  transform: translateX(3px);
}

:deep(.el-menu-item.is-active) {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.3) 0%, rgba(8, 145, 178, 0.4) 100%) !important;
  color: #06b6d4 !important;
  border-color: #06b6d4;
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

:deep(.el-sub-menu__title:hover) {
  background: rgba(6, 182, 212, 0.2) !important;
  color: #06b6d4 !important;
  border-color: rgba(6, 182, 212, 0.5);
  box-shadow: 0 0 10px rgba(6, 182, 212, 0.3);
  transform: translateX(3px);
}

:deep(.el-sub-menu .el-menu-item) {
  margin-left: 20px;
  background: rgba(6, 182, 212, 0.03) !important;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 36px !important;
  line-height: 36px !important;
  border: 1px solid transparent;
  border-radius: 6px;
}

:deep(.el-sub-menu .el-menu-item:hover) {
  background: rgba(6, 182, 212, 0.15) !important;
  color: #06b6d4 !important;
  border-color: rgba(6, 182, 212, 0.4);
  box-shadow: 0 0 8px rgba(6, 182, 212, 0.2);
}

:deep(.el-sub-menu .el-menu-item.is-active) {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.25) 0%, rgba(8, 145, 178, 0.3) 100%) !important;
  color: #06b6d4 !important;
  border-color: #06b6d4;
  box-shadow: 0 0 12px rgba(6, 182, 212, 0.4);
}

:deep(.el-menu-item .el-icon) {
  margin-right: 8px;
  font-size: 16px;
  color: inherit;
}

.footer-info {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(17, 24, 39, 0.8) 100%);
  box-shadow: 0 -2px 8px rgba(6, 182, 212, 0.2);
}
</style>
