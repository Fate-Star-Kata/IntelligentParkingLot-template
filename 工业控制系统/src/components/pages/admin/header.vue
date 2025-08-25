<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'

interface Props {
  isCollapse: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  toggleSidebar: []
}>()

const router = useRouter()

// 用户信息
const userInfo = ref({
  name: '管理员',
  avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  role: '超级管理员'
})

// 面包屑数据
const breadcrumbs = ref([
  { label: '首页', path: '/' },
  { label: '仪表板', path: '/admin/dashboard' }
])

// 切换侧边栏
function handleToggleSidebar() {
  emit('toggleSidebar')
}

// 用户下拉菜单命令处理
function handleCommand(command: string) {
  switch (command) {
    case 'profile':
      ElMessage.info('个人中心功能开发中')
      break
    case 'settings':
      ElMessage.info('设置功能开发中')
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 退出登录
function handleLogout() {
  ElMessageBox.confirm(
    '确定要退出登录吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    ElMessage.success('退出成功')
    router.push('/auth/login')
  }).catch(() => {
    // 用户取消
  })
}

// 全屏切换
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
</script>

<template>
  <div class="admin-header flex items-center justify-between px-6 h-full">
    <!-- 左侧区域 -->
    <div class="flex items-center">
      <!-- 菜单切换按钮 -->
      <el-button type="text" size="large" @click="handleToggleSidebar" class="mr-4">
        <el-icon size="18">
          <Fold v-if="!isCollapse" />
          <Expand v-else />
        </el-icon>
      </el-button>

      <!-- 面包屑导航 -->
      <el-breadcrumb separator="/" class="text-sm">
        <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index" :to="item.path || undefined">
          {{ item.label }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 右侧区域 -->
    <div class="flex items-center space-x-4">
      <!-- 搜索框 -->
      <el-input placeholder="搜索菜单" size="small" style="width: 200px" prefix-icon="Search" clearable />

      <!-- 全屏按钮 -->
      <el-tooltip content="全屏" placement="bottom">
        <el-button type="text" size="large" @click="toggleFullscreen">
          <el-icon size="18">
            <FullScreen />
          </el-icon>
        </el-button>
      </el-tooltip>

      <!-- 通知按钮 -->
      <el-tooltip content="通知" placement="bottom">
        <el-badge :value="5" class="item" :offset="[-10, 10]">
          <el-button type="text" size="large">
            <el-icon size="18">
              <Bell />
            </el-icon>
          </el-button>
        </el-badge>
      </el-tooltip>

      <!-- 用户信息下拉菜单 -->
      <el-dropdown @command="handleCommand" trigger="click">
        <div class="flex items-center cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
          <el-avatar :size="32" :src="userInfo.avatar" class="mr-2" />
          <div class="text-sm">
            <div class="font-medium text-gray-900">{{ userInfo.name }}</div>
            <div class="text-gray-500 text-xs">{{ userInfo.role }}</div>
          </div>
          <el-icon class="ml-2 text-gray-400">
            <ArrowDown />
          </el-icon>
        </div>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon class="mr-2">
                <User />
              </el-icon>
              个人中心
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <el-icon class="mr-2">
                <Setting />
              </el-icon>
              设置
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon class="mr-2">
                <SwitchButton />
              </el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped>
.admin-header {
  border-bottom: 1px solid #f0f0f0;
}

.item {
  margin-right: 8px;
}
</style>