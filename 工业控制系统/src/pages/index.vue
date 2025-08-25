<template>
  <div class="min-h-full h-full bg-gray-900 text-white relative overflow-hidden">
    <!-- 工业控制系统背景网格 -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute inset-0" style="background-image: linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px); background-size: 20px 20px;"></div>
    </div>
    
    <!-- 顶部控制面板 -->
    <div class="relative z-10 bg-gray-800 border-b-2 border-cyan-500 shadow-lg">
      <div class="flex items-center justify-between px-6 py-4">
        <!-- 左侧系统标题 -->
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-cyan-400">智能停车场控制系统</h1>
            <p class="text-sm text-gray-400">Industrial Parking Management System</p>
          </div>
        </div>
        
        <!-- 中间模式切换器 -->
        <div class="flex items-center space-x-2 bg-gray-700 rounded-lg p-2 border border-gray-600">
          <div class="text-sm text-gray-300 mr-2">操作模式:</div>
          <button 
            v-for="location in parkingLocations" 
            :key="location.id"
            @click="handleModeSwitch(location.shortCode)"
            class="px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 relative overflow-hidden"
            :class="currentMode?.id === location.id 
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg transform scale-105' 
              : 'bg-gray-600 text-gray-300 hover:bg-gray-500 hover:text-white'"
          >
            <span class="relative z-10">{{ location.name }}</span>
            <div v-if="currentMode?.id === location.id" class="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 animate-pulse"></div>
          </button>
        </div>
        
        <!-- 右侧状态指示器 -->
        <div class="flex items-center space-x-4">
          <!-- 系统状态 -->
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
            <span class="text-sm text-gray-300">系统正常</span>
          </div>
          
          <!-- 时间显示 -->
          <div class="text-sm text-gray-300 font-mono bg-gray-700 px-3 py-1 rounded border border-gray-600">
            {{ currentTime }}
          </div>
          
          <!-- 用户状态 -->
          <div class="flex items-center space-x-2 bg-gray-700 px-3 py-1 rounded border border-gray-600">
            <div class="w-2 h-2 rounded-full" :class="userMembershipInfo.is_member ? 'bg-green-400' : 'bg-yellow-400'"></div>
            <span class="text-xs text-gray-300">{{ userMembershipInfo.is_member ? '会员用户' : '访客用户' }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="relative z-10 h-full">
      <!-- 入场模式 -->
      <div v-if="currentMode?.id === 1" class="h-full">
        <div class="flex h-full">
          <!-- 左侧信息面板 -->
          <div class="w-80 bg-gray-800 border-r-2 border-cyan-500 p-4 space-y-4">
            <!-- 天气信息卡片 -->
            <div class="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-4 border border-cyan-500/30">
              <div class="flex items-center mb-3">
                <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-cyan-400">天气信息</h3>
                  <p class="text-xs text-gray-400">Weather Information</p>
                </div>
              </div>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-400">当前天气:</span>
                  <span class="text-blue-400 font-mono">晴朗</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">温度:</span>
                  <span class="text-blue-400">22°C</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">湿度:</span>
                  <span class="text-blue-400">65%</span>
                </div>
              </div>
            </div>
            
            <!-- 系统监控 -->
            <div class="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-4 border border-cyan-500/30">
              <h4 class="text-sm font-bold text-cyan-400 mb-3">系统监控</h4>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-400">CPU使用率:</span>
                  <span class="text-lg font-bold text-green-400 font-mono">{{ systemStatus.cpu }}%</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-400">内存使用:</span>
                  <span class="text-lg font-bold text-blue-400 font-mono">{{ systemStatus.memory }}%</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-400">存储空间:</span>
                  <span class="text-lg font-bold text-yellow-400 font-mono">{{ systemStatus.storage }}%</span>
                </div>
              </div>
            </div>
            
            <!-- 系统日志 -->
            <div class="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-4 border border-cyan-500/30 flex-1">
              <h4 class="text-sm font-bold text-cyan-400 mb-3">系统日志</h4>
              <div class="space-y-2 text-xs max-h-40 overflow-y-auto">
                <div v-for="(log, index) in systemLogs" :key="index" class="flex items-start space-x-2">
                  <div class="w-2 h-2 bg-green-400 rounded-full mt-1 flex-shrink-0"></div>
                  <div class="flex-1">
                    <div class="text-gray-300">{{ log.message }}</div>
                    <div class="text-gray-500 font-mono">{{ log.time }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 右侧主要内容 -->
          <div class="flex-1">
            <Entrance />
          </div>
        </div>
      </div>
      
      <!-- 出场模式 -->
      <div v-if="currentMode?.id === 2" class="h-full">
        <div class="flex h-full">
          <!-- 左侧信息面板 -->
          <div class="w-80 bg-gray-800 border-r-2 border-orange-500 p-4 space-y-4">
            <!-- 设备状态卡片 -->
            <div class="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-4 border border-orange-500/30">
              <div class="flex items-center mb-3">
                <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-orange-400">设备状态</h3>
                  <p class="text-xs text-gray-400">Device Status</p>
                </div>
              </div>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-400">摄像头:</span>
                  <span class="text-green-400 font-mono">在线</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">闸机:</span>
                  <span class="text-green-400">正常</span>
                </div>
              </div>
            </div>
            
            <!-- 网络状态 -->
            <div class="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-4 border border-orange-500/30">
              <h4 class="text-sm font-bold text-orange-400 mb-3">网络状态</h4>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-400">延迟:</span>
                  <span class="text-lg font-bold text-green-400 font-mono">12ms</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-400">带宽:</span>
                  <span class="text-lg font-bold text-blue-400 font-mono">100Mbps</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-400">连接状态:</span>
                  <span class="text-lg font-bold text-green-400 font-mono">稳定</span>
                </div>
              </div>
            </div>
            
            <!-- 系统日志 -->
            <div class="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-4 border border-orange-500/30 flex-1">
              <h4 class="text-sm font-bold text-orange-400 mb-3">系统日志</h4>
              <div class="space-y-2 text-xs max-h-40 overflow-y-auto">
                <div v-for="(log, index) in systemLogs" :key="index" class="flex items-start space-x-2">
                  <div class="w-2 h-2 bg-orange-400 rounded-full mt-1 flex-shrink-0"></div>
                  <div class="flex-1">
                    <div class="text-gray-300">{{ log.message }}</div>
                    <div class="text-gray-500 font-mono">{{ log.time }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 右侧主要内容 -->
          <div class="flex-1">
            <Export />
          </div>
        </div>
      </div>
    </div>
    
    <!-- 底部状态栏 -->
    <div class="absolute bottom-0 left-0 right-0 bg-gray-800 border-t-2 border-cyan-500 px-6 py-2 z-20">
      <div class="flex items-center justify-between text-xs">
        <div class="flex items-center space-x-4">
          <span class="text-gray-400">系统版本: v2.1.0</span>
          <span class="text-gray-400">|</span>
          <span class="text-gray-400">设备ID: PMS-001</span>
          <span class="text-gray-400">|</span>
          <span class="text-gray-400">网络状态: 
            <span class="text-green-400">已连接</span>
          </span>
        </div>
        <div class="flex items-center space-x-4">
          <span class="text-gray-400">CPU: {{ systemStatus.cpu }}%</span>
          <span class="text-gray-400">内存: {{ systemStatus.memory }}%</span>
          <span class="text-gray-400">存储: {{ systemStatus.storage }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, provide, onUnmounted } from 'vue'
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

// 停车场位置列表
const { parkingLocations } = stateStore

// 计算属性：获取当前模式
const currentMode = computed(() => {
  return stateStore.getCurrentLocationInfo()
})

// 当前时间
const currentTime = ref('')
let timeInterval: NodeJS.Timeout | null = null

// 系统状态
const systemStatus = ref({
  cpu: 45,
  memory: 62,
  storage: 78
})

// 统计数据
const todayEntryCount = ref(156)
const todayExitCount = ref(142)
const availableSpots = ref(48)
const occupancyRate = ref(76)
const pendingPayment = ref(8)
const todayRevenue = ref(2840)

// 系统日志
const systemLogs = ref([
  { message: '车辆 京A12345 成功入场', time: '14:32:15' },
  { message: '摄像头设备连接正常', time: '14:31:42' },
  { message: '车位A001状态更新', time: '14:30:18' },
  { message: '系统自检完成', time: '14:28:55' },
  { message: '网络连接稳定', time: '14:27:33' }
])

// 更新当前时间
const updateCurrentTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 模式切换处理
const handleModeSwitch = (locationCode: string) => {
  stateStore.setCurrentLocation(locationCode)
  
  // 添加系统日志
  const now = new Date()
  const timeStr = now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  
  const modeText = locationCode === '入口' ? '入场模式' : '出场模式'
  systemLogs.value.unshift({
    message: `切换到${modeText}`,
    time: timeStr
  })
  
  // 保持日志数量在合理范围内
  if (systemLogs.value.length > 10) {
    systemLogs.value = systemLogs.value.slice(0, 10)
  }
}

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

// 模拟系统状态更新
const updateSystemStatus = () => {
  systemStatus.value.cpu = Math.floor(Math.random() * 20) + 40
  systemStatus.value.memory = Math.floor(Math.random() * 15) + 55
  systemStatus.value.storage = Math.floor(Math.random() * 10) + 75
}

// 组件挂载时的初始化
onMounted(() => {
  checkMembershipStatus()
  updateCurrentTime()
  
  // 设置定时器更新时间
  timeInterval = setInterval(() => {
    updateCurrentTime()
    updateSystemStatus()
  }, 1000)
})

// 组件卸载时清理定时器
onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})

// 向子组件提供用户信息
provide('userMembershipInfo', userMembershipInfo)

</script>

<style scoped>
/* 工业控制系统样式 */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: #374151;
}

::-webkit-scrollbar-thumb {
  background: #06b6d4;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: #0891b2;
}

/* 网格背景动画 */
@keyframes grid-move {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(20px, 20px);
  }
}

.grid-bg {
  animation: grid-move 10s linear infinite;
}
</style>
