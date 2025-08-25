<template>
    <div class="w-full h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <!-- 背景装饰元素 -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
        </div>

        <div class="relative w-full h-full flex gap-6 p-6">
            <!-- 左侧摄像头区域 -->
            <div class="h-full w-1/2">
                <div class="w-full h-full flex flex-col p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500">
                    <!-- 标题和提示 -->
                    <div class="mb-8 text-center relative">
                        <!-- 装饰性图标 -->
                        <div class="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>

                        <div class="flex items-center justify-center mb-4">
                            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                            <h2 class="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">入场车牌识别</h2>
                        </div>

                        <div class="relative">
                            <p class="text-xl text-gray-600 font-medium">请将车辆停在摄像头前方</p>
                        </div>
                    </div>
                    <!-- 摄像头选择器 -->
                    <div class="mb-6">
                        <label class="flex items-center text-sm font-semibold text-gray-700 mb-3">
                            <div class="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mr-2 flex items-center justify-center">
                                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            选择摄像头设备
                        </label>
                        <div class="relative">
                            <select
                                v-model="selectedDeviceId"
                                @change="switchCamera"
                                class="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border-2 border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 appearance-none cursor-pointer hover:border-blue-400/50"
                            >
                                <option value="">🎥 请选择摄像头设备</option>
                                <option
                                    v-for="device in videoDevices"
                                    :key="device.deviceId"
                                    :value="device.deviceId"
                                >
                                    📹 {{ device.label || `摄像头 ${device.deviceId.slice(0, 8)}` }}
                                </option>
                            </select>
                            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <!-- 视频显示区域 -->
                    <div class="flex-1 relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-inner border-2 border-gray-200/50">
                        <video
                            ref="videoRef"
                            autoplay
                            playsinline
                            muted
                            class="w-full h-full object-cover"
                            v-show="isVideoActive"
                        ></video>



                        <!-- 角落装饰 -->
                        <div class="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-blue-400 opacity-60" v-show="isVideoActive"></div>
                        <div class="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-blue-400 opacity-60" v-show="isVideoActive"></div>
                        <div class="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-blue-400 opacity-60" v-show="isVideoActive"></div>
                        <div class="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-blue-400 opacity-60" v-show="isVideoActive"></div>



                        <!-- 加载状态 -->
                        <div
                            v-if="isLoading"
                            class="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-purple-900/80 backdrop-blur-sm flex items-center justify-center"
                        >
                            <div class="text-white text-center">
                                <div class="relative mb-6">
                                    <div class="animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-white mx-auto"></div>
                                    <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 animate-spin" style="animation-duration: 1.5s; animation-direction: reverse;"></div>
                                </div>
                                <div class="space-y-2">
                                    <p class="text-lg font-semibold">🎥 正在启动摄像头</p>
                                    <p class="text-sm text-blue-200">请稍候，正在连接设备...</p>
                                </div>
                            </div>
                        </div>

                        <!-- 错误状态 -->
                        <div
                            v-if="error"
                            class="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center"
                        >
                            <div class="text-center text-red-600 max-w-md mx-auto p-6">
                                <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                    </svg>
                                </div>
                                <h3 class="text-xl font-bold mb-4">⚠️ 摄像头启动失败</h3>
                                
                                <!-- 错误信息显示 -->
                                <div class="text-left text-sm text-red-600 mb-6 bg-red-50 p-4 rounded-lg border border-red-200">
                                    <div v-if="error.includes('\n')" class="space-y-2">
                                        <div v-for="(line, index) in error.split('\n')" :key="index" class="flex items-start">
                                            <span v-if="line.match(/^\d+\./)"
                                                  class="inline-block w-full text-left font-medium">{{ line }}</span>
                                            <span v-else class="inline-block w-full text-left"
                                                  :class="index === 0 ? 'font-semibold text-red-700' : ''">{{ line }}</span>
                                        </div>
                                    </div>
                                    <div v-else class="font-medium">{{ error }}</div>
                                </div>
                                
                                <!-- 操作按钮 -->
                                <div class="space-y-2">
                                    <div class="flex space-x-2 justify-center">
                                        <button
                                            @click="initCamera"
                                            class="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                                        >
                                            🔄 重新申请权限
                                        </button>
                                        <button
                                            @click="refreshPage"
                                            class="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                                        >
                                            🔃 刷新页面
                                        </button>
                                    </div>
                                    
                                    <!-- 额外的帮助按钮 -->
                                    <div class="text-center">
                                        <button
                                            @click="showCameraHelp"
                                            class="text-blue-600 hover:text-blue-800 text-xs underline transition-colors duration-200"
                                        >
                                            📖 查看详细帮助
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            v-if="!isVideoActive && !isLoading && !error"
                            class="absolute inset-0 flex items-center justify-center bg-gray-100"
                        >
                            <p class="text-gray-500">请选择摄像头</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 右侧区域 -->
            <div class="h-full w-1/2">
                <div class="w-full h-full flex flex-col p-5 bg-white rounded-lg shadow-md">
                    <!-- 上部分：车牌识别结果和分配车位 (1/3) -->
                    <div class="h-1/3 flex gap-4 mb-4">
                    <!-- 左侧卡片：车牌识别结果 -->
                    <div class="w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg p-3 border border-blue-200 overflow-hidden">
                        <div class="flex items-center mb-2">
                            <div
                                class="w-6 h-6 rounded-full flex items-center justify-center mr-2 transition-all duration-300"
                                :class="isDetecting ? 'bg-yellow-500 animate-pulse' : licensePlate ? 'bg-green-500' : 'bg-blue-500'"
                            >
                                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path v-if="isDetecting" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    <path v-else-if="licensePlate" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                            </div>
                            <h3 class="text-lg font-bold text-gray-800">
                                {{ isDetecting ? '正在识别...' : licensePlate ? '识别完成' : '车牌识别结果' }}
                            </h3>
                        </div>

                        <!-- 车牌号码显示 -->
                        <div class="bg-white rounded-lg p-2 mb-2 shadow-inner border-2 border-dashed border-blue-300">
                            <div class="text-center">
                                <div class="text-xl font-bold text-blue-700 tracking-wider font-mono">
                                    {{ licensePlate || '等待识别...' }}
                                </div>
                                <div class="text-xs text-gray-500">License Plate Number</div>
                            </div>
                        </div>

                        <!-- 详细信息 -->
                        <div class="space-y-1">
                            <div class="flex items-center justify-between bg-white/60 rounded-lg p-2">
                                <span class="text-xs font-medium text-gray-700">识别可信度</span>
                                <div class="flex items-center">
                                    <div class="w-12 h-1.5 bg-gray-200 rounded-full mr-1">
                                        <div
                                            class="h-1.5 rounded-full transition-all duration-300"
                                            :class="confidence >= 80 ? 'bg-green-500' : confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'"
                                            :style="{ width: `${Math.min(confidence, 100)}%` }"
                                        ></div>
                                    </div>
                                    <span
                                        class="text-xs font-bold"
                                        :class="confidence >= 80 ? 'text-green-600' : confidence >= 60 ? 'text-yellow-600' : 'text-red-600'"
                                    >
                                        {{ confidence }}%
                                    </span>
                                </div>
                            </div>

                            <div class="flex items-center justify-between bg-white/60 rounded-lg p-2">
                                <span class="text-xs font-medium text-gray-700">车辆类型</span>
                                <span
                                    class="text-xs font-semibold px-2 py-1 rounded-full"
                                    :class="vehicleType === '新能源汽车' ? 'text-green-600 bg-green-100' : 'text-blue-600 bg-blue-100'"
                                >
                                    {{ vehicleType || '未识别' }}
                                </span>
                            </div>

                            <div class="flex items-center justify-between bg-white/60 rounded-lg p-2">
                                <span class="text-xs font-medium text-gray-700">进场时间</span>
                                <span class="text-xs font-mono text-gray-800">
                                    {{ entryTime || '--' }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- 右侧卡片：分配车位 -->
                    <div
                        class="w-1/2 rounded-xl shadow-lg p-3 border overflow-hidden transition-all duration-300"
                        :class="assignedSpot ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-200' : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'"
                    >
                        <div class="flex items-center mb-2">
                            <div
                                class="w-6 h-6 rounded-full flex items-center justify-center mr-2 transition-all duration-300"
                                :class="assignedSpot ? 'bg-green-500' : 'bg-gray-400'"
                            >
                                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path v-if="assignedSpot" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                    <path v-if="assignedSpot" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h3
                                class="text-lg font-bold transition-all duration-300"
                                :class="assignedSpot ? 'text-gray-800' : 'text-gray-600'"
                            >
                                {{ assignedSpot ? '为您分配的车位' : '等待分配车位' }}
                            </h3>
                        </div>

                        <!-- 车位号码显示 -->
                        <div class="bg-white rounded-lg p-3 mb-2 shadow-inner border-2 border-dashed border-green-300">
                            <div class="text-center">
                                <div class="text-2xl font-bold text-green-700 tracking-wider font-mono">
                                    {{ assignedSpot || '--' }}
                                </div>
                                <div class="text-xs text-gray-500">Assigned Parking Space</div>
                            </div>
                        </div>

                        <!-- 详细信息 -->
                        <div class="space-y-1">
                            <div class="flex items-center justify-between bg-white/60 rounded-lg p-2">
                                <span class="text-xs font-medium text-gray-700">距离入口</span>
                                <div class="flex items-center">
                                    <svg class="w-3 h-3 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                    </svg>
                                    <span class="text-xs font-bold text-green-600">
                                        {{ spotDistance || '--' }}
                                    </span>
                                </div>
                            </div>

                            <div class="flex items-center justify-between bg-white/60 rounded-lg p-2">
                                <span class="text-xs font-medium text-gray-700">预计步行时间</span>
                                <span class="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                    {{ walkTime || '--' }}
                                </span>
                            </div>

                            <div class="flex items-center justify-between bg-white/60 rounded-lg p-2">
                                <span class="text-xs font-medium text-gray-700">车位状态</span>
                                <div class="flex items-center">
                                    <div
                                        class="w-2 h-2 rounded-full mr-1"
                                        :class="spotStatus ? 'bg-green-500 animate-pulse' : 'bg-gray-400'"
                                    ></div>
                                    <span class="text-xs font-mono text-green-700">
                                        {{ spotStatus || '等待分配' }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 下部分：停车场缩略图 (2/3) -->
                <div class="flex-1 bg-gray-50 rounded-lg p-2 overflow-hidden">
                    <h3 class="text-sm font-bold text-gray-800 mb-2">停车场布局图</h3>
                    <div class="w-full h-full bg-gray-100 rounded-lg relative overflow-hidden p-2">
                        <!-- 停车场缩略图内容 - 与admin dashboard保持一致 -->
                        <div class="parking-layout-thumbnail h-full">
                            <!-- 入口标识 -->
                            <div class="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
                                入口
                            </div>

                            <!-- 停车区域布局 -->
                            <div class="grid grid-cols-2 gap-4 h-full pt-2 pb-6">
                                <!-- A区 -->
                                <div class="area-section">
                                    <h4 class="text-xs font-medium text-gray-600 mb-2 text-center">A区</h4>
                                    <div class="flex justify-center gap-1 flex-wrap">
                                        <div v-for="i in 5" :key="'A' + i"
                                             class="parking-space-mini"
                                             :class="getSpotClass(`A${String(i).padStart(3, '0')}`)">
                                            <div class="space-content-mini">
                                                <div class="space-id-mini">A{{ String(i).padStart(2, '0') }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- B区 -->
                                <div class="area-section">
                                    <h4 class="text-xs font-medium text-gray-600 mb-2 text-center">B区</h4>
                                    <div class="flex justify-center gap-1 flex-wrap">
                                        <div v-for="i in 5" :key="'B' + i"
                                             class="parking-space-mini"
                                             :class="getSpotClass(`B${String(i).padStart(3, '0')}`)">
                                            <div class="space-content-mini">
                                                <div class="space-id-mini">B{{ String(i).padStart(2, '0') }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- C区 -->
                                <div class="area-section">
                                    <h4 class="text-xs font-medium text-gray-600 mb-2 text-center">C区</h4>
                                    <div class="flex justify-center gap-1 flex-wrap">
                                        <div v-for="i in 5" :key="'C' + i"
                                             class="parking-space-mini"
                                             :class="getSpotClass(`C${String(i).padStart(3, '0')}`)">
                                            <div class="space-content-mini">
                                                <div class="space-id-mini">C{{ String(i).padStart(2, '0') }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- D区 -->
                                <div class="area-section">
                                    <h4 class="text-xs font-medium text-gray-600 mb-2 text-center">D区</h4>
                                    <div class="flex justify-center gap-1 flex-wrap">
                                        <div v-for="i in 5" :key="'D' + i"
                                             class="parking-space-mini"
                                             :class="getSpotClass(`D${String(i).padStart(3, '0')}`)">
                                            <div class="space-content-mini">
                                                <div class="space-id-mini">D{{ String(i).padStart(2, '0') }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, inject } from 'vue'
import WebSocketClient from '@/http/WebSocket'
import { autoAssignParkingSpot, getParkingLayout } from '@/api/user/parking'
import { useUserStore } from '@/stores/auth/user'

// 响应式数据
const videoRef = ref<HTMLVideoElement | null>(null)
const videoDevices = ref<MediaDeviceInfo[]>([])
const selectedDeviceId = ref<string>('')
const currentStream = ref<MediaStream | null>(null)
const isVideoActive = ref(false)
const isLoading = ref(false)
const error = ref<string>('')

// WebSocket相关
const wsClient = ref<WebSocketClient | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
let frameInterval: number | null = null

// 车牌检测结果相关
const detectionResult = ref<any>(null)
const licensePlate = ref<string>('')
const confidence = ref<number>(0)
const vehicleType = ref<string>('')
const entryTime = ref<string>('')
const assignedSpot = ref<string>('')
const spotDistance = ref<string>('')
const walkTime = ref<string>('')
const spotStatus = ref<string>('')
const sessionId = ref<string>('')
const isDetecting = ref<boolean>(false)

// 停车场布局信息
const parkingLayout = ref({
    A: ['A01', 'A02', 'A03', 'A04', 'A05', 'A06', 'A07', 'A08'],
    B: ['B01', 'B02', 'B03', 'B04', 'B05', 'B06', 'B07', 'B08'],
    C: ['C01', 'C02', 'C03', 'C04', 'C05', 'C06', 'C07', 'C08'],
    D: ['D01', 'D02', 'D03', 'D04', 'D05', 'D06', 'D07', 'D08']
})

// 获取父组件的用户信息
const parentUserInfo = inject('userMembershipInfo', ref({
    is_member: false,
    license_plate: '',
    preferred_area: ''
}))

// 获取用户存储
const userStore = useUserStore()

// 获取车位样式类
const getSpotClass = (spotId: string) => {
    // 转换为标准格式进行比较（去掉前导零）
    const normalizedSpotId = spotId.replace(/0+/, '')
    const normalizedAssignedSpot = assignedSpot.value?.replace(/0+/, '')

    // 如果是分配的车位，使用黄色底色
    if (normalizedAssignedSpot && normalizedSpotId === normalizedAssignedSpot) {
        return 'assigned'
    }

    // 模拟一些已占用的车位（红色）
    const occupiedSpots = ['B03', 'A02', 'C04']
    if (occupiedSpots.includes(normalizedSpotId)) {
        return 'occupied'
    }

    // 其他为可用车位（绿色）
    return 'available'
}

// 申请摄像头权限
const requestCameraPermission = async () => {
    try {
        // 检查浏览器是否支持 getUserMedia
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            error.value = '您的浏览器不支持摄像头功能，请使用现代浏览器（Chrome、Firefox、Safari等）'
            return false
        }

        // 先申请一个基本的摄像头权限，这样可以获取到设备标签
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        // 立即停止这个临时流
        stream.getTracks().forEach(track => track.stop())
        return true
    } catch (err) {
        console.error('申请摄像头权限失败:', err)
        if (err instanceof Error) {
            if (err.name === 'NotAllowedError') {
                error.value = '摄像头权限被拒绝。请按以下步骤操作：\n1. 点击地址栏左侧的摄像头图标\n2. 选择"允许"访问摄像头\n3. 刷新页面重试'
            } else if (err.name === 'NotFoundError') {
                error.value = '未找到摄像头设备，请确保：\n1. 摄像头已正确连接\n2. 没有被其他应用占用\n3. 驱动程序已安装'
            } else if (err.name === 'NotReadableError') {
                error.value = '摄像头被其他应用占用，请：\n1. 关闭其他使用摄像头的应用\n2. 重新连接摄像头\n3. 刷新页面重试'
            } else if (err.name === 'OverconstrainedError') {
                error.value = '摄像头不支持请求的配置，请尝试使用其他摄像头设备'
            } else {
                error.value = `权限申请失败: ${err.message}`
            }
        } else {
            error.value = '权限申请失败，请检查摄像头设备和浏览器设置'
        }
        return false
    }
}

// 获取摄像头设备列表
const getVideoDevices = async () => {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        videoDevices.value = devices.filter(device => device.kind === 'videoinput')

        // 如果有摄像头且没有选中的设备，自动选择第一个
        if (videoDevices.value.length > 0 && !selectedDeviceId.value) {
            selectedDeviceId.value = videoDevices.value[0].deviceId
        }
    } catch (err) {
        console.error('获取摄像头设备失败:', err)
        error.value = '无法获取摄像头设备列表'
    }
}

// 停止当前视频流
const stopCurrentStream = () => {
    if (currentStream.value) {
        currentStream.value.getTracks().forEach(track => track.stop())
        currentStream.value = null
    }
    isVideoActive.value = false
    stopFrameCapture()
}

// 启动摄像头
const startCamera = async (deviceId: string) => {
    try {
        isLoading.value = true
        error.value = ''

        // 停止当前流
        stopCurrentStream()

        // 获取新的视频流
        const constraints: MediaStreamConstraints = {
            video: {
                deviceId: deviceId ? { exact: deviceId } : undefined,
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        }

        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        currentStream.value = stream

        // 将流绑定到video元素
        if (videoRef.value) {
            videoRef.value.srcObject = stream
            isVideoActive.value = true

            // 等待视频加载完成后开始帧捕获
            videoRef.value.onloadedmetadata = () => {
                if (wsClient.value?.isConnected()) {
                    startFrameCapture()
                }
            }
        }

    } catch (err) {
        console.error('启动摄像头失败:', err)
        if (err instanceof Error) {
            if (err.name === 'NotAllowedError') {
                error.value = '摄像头权限被拒绝，请允许访问摄像头'
            } else if (err.name === 'NotFoundError') {
                error.value = '未找到摄像头设备'
            } else if (err.name === 'NotReadableError') {
                error.value = '摄像头被其他应用占用'
            } else {
                error.value = `摄像头启动失败: ${err.message}`
            }
        } else {
            error.value = '摄像头启动失败'
        }
    } finally {
        isLoading.value = false
    }
}

// 切换摄像头
const switchCamera = () => {
    if (selectedDeviceId.value) {
        startCamera(selectedDeviceId.value)
    }
}

// 刷新页面
const refreshPage = () => {
    window.location.reload()
}

// 显示摄像头帮助信息
const showCameraHelp = () => {
    const helpMessage = `摄像头权限问题解决方案：

🌐 Chrome浏览器：
1. 点击地址栏左侧的锁形图标或摄像头图标
2. 将摄像头权限设置为"允许"
3. 刷新页面

🦊 Firefox浏览器：
1. 点击地址栏左侧的盾牌图标
2. 关闭"阻止摄像头访问"
3. 刷新页面

🧭 Safari浏览器：
1. 在菜单栏选择"Safari" > "网站设置"
2. 找到摄像头选项，设置为"允许"
3. 刷新页面

💡 其他解决方案：
• 确保摄像头设备正常连接
• 关闭其他使用摄像头的应用程序
• 重启浏览器或计算机
• 检查防火墙和安全软件设置

如果问题仍然存在，请联系技术支持。`
    
    alert(helpMessage)
}

// 初始化摄像头
const initCamera = async () => {
    // 首先申请摄像头权限
    const hasPermission = await requestCameraPermission()
    if (!hasPermission) {
        return
    }

    // 权限申请成功后获取设备列表
    await getVideoDevices()
    if (selectedDeviceId.value) {
        await startCamera(selectedDeviceId.value)
    }
}

// 初始化WebSocket连接
const initWebSocket = () => {
    wsClient.value = new WebSocketClient('ws://192.168.124.3:8002/ws/vehicle-detection/', {
        onOpen: () => {
            console.log('WebSocket连接成功')
            startFrameCapture()
        },
        onMessage: (data) => {
            console.log('收到WebSocket消息:', data)
            handleWebSocketMessage(data)
        },
        onClose: (event) => {
            console.log('WebSocket连接关闭:', event)
            stopFrameCapture()
        },
        onError: (event) => {
            console.error('WebSocket连接错误:', event)
        }
    }, {
        reconnectInterval: 3000,
        maxReconnectAttempts: 5,
        heartbeatInterval: 30000
    })

    wsClient.value.connect()
}

// 捕获视频帧并转换为base64
const captureFrame = (): string | null => {
    if (!videoRef.value || !isVideoActive.value) {
        return null
    }

    // 创建canvas元素（如果不存在）
    if (!canvasRef.value) {
        canvasRef.value = document.createElement('canvas')
    }

    const canvas = canvasRef.value
    const video = videoRef.value
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        return null
    }

    // 设置canvas尺寸与视频相同
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // 绘制当前视频帧到canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // 转换为base64
    try {
        return canvas.toDataURL('image/jpeg', 0.8).split(',')[1] // 移除data:image/jpeg;base64,前缀
    } catch (err) {
        console.error('转换图像为base64失败:', err)
        return null
    }
}

// 开始帧捕获（每秒5次）
const startFrameCapture = () => {
    if (frameInterval) {
        clearInterval(frameInterval)
    }

    frameInterval = setInterval(() => {
        const frameBase64 = captureFrame()
        if (frameBase64 && wsClient.value?.isConnected()) {
            const message = {
                type: 'video_frame',
                frame: frameBase64
            }
            wsClient.value.send(message)
        }
    }, 200) // 每200ms发送一次，即每秒5次
}

// 停止帧捕获
const stopFrameCapture = () => {
    if (frameInterval) {
        clearInterval(frameInterval)
        frameInterval = null
    }
}

// 处理WebSocket消息
const handleWebSocketMessage = (data: any) => {
    try {
        const message = typeof data === 'string' ? JSON.parse(data) : data

        switch (message.type) {
            case 'connection_established':
                console.log('连接已建立:', message.message)
                sessionId.value = message.session_id || ''
                break

            case 'detection_result':
                handleDetectionResult(message)
                break

            case 'spot_assignment':
                handleSpotAssignment(message)
                break

            case 'error':
                console.error('WebSocket错误:', message.message)
                break

            default:
                console.log('未知消息类型:', message.type)
        }
    } catch (err) {
        console.error('解析WebSocket消息失败:', err)
    }
}

// 处理车牌检测结果
const handleDetectionResult = async (message: any) => {
    isDetecting.value = true
    detectionResult.value = message

    // 更新车牌信息
    if (message.license_plates && message.license_plates.length > 0) {
        licensePlate.value = message.license_plates[0]
    }

    // 更新检测详情
    if (message.detections && message.detections.length > 0) {
        const detection = message.detections[0]
        confidence.value = Math.round(detection.confidence * 100)

        // 根据检测类型设置车辆类型
        switch (detection.class_name) {
            case 'blue':
            case 'license_plate':
                vehicleType.value = '小型汽车'
                break
            case 'green':
                vehicleType.value = '新能源汽车'
                break
            default:
                vehicleType.value = '未知类型'
        }
    }

    // 更新进场时间
    entryTime.value = new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    })

    // 进行车位分配
    await performParkingSpotAssignment()
}

// 处理车位分配结果
const handleSpotAssignment = (message: any) => {
    if (message.assigned_spot) {
        assignedSpot.value = message.assigned_spot.number || ''
        spotDistance.value = message.distance || ''
        walkTime.value = message.walk_time || ''
        spotStatus.value = '已分配'
    }
}

// 执行车位分配逻辑
const performParkingSpotAssignment = async () => {
    try {
        const userInfo = parentUserInfo.value
        const detectedPlate = licensePlate.value

        // 判断是否为注册用户且车牌匹配
        const isRegisteredUser = userInfo.is_member &&
                                userInfo.license_plate &&
                                userInfo.license_plate === detectedPlate

        let assignedSpotInfo

        if (isRegisteredUser && userInfo.preferred_area) {
            // 注册用户且车牌匹配，优先分配偏好区域
            assignedSpotInfo = await assignSpotByPreference(userInfo.preferred_area)
        } else {
            // 非注册用户或车牌不匹配，随机分配
            assignedSpotInfo = await assignRandomSpot()
        }

        if (assignedSpotInfo) {
            assignedSpot.value = assignedSpotInfo.spot_number
            spotDistance.value = assignedSpotInfo.distance || `${Math.floor(Math.random() * 200 + 50)}米`
            walkTime.value = assignedSpotInfo.walk_time || `${Math.floor(Math.random() * 3 + 1)}分钟`
            spotStatus.value = '已分配'
        }

    } catch (error) {
        console.error('车位分配失败:', error)
        // 分配失败时使用默认逻辑
        await assignRandomSpot()
    }
}

// 根据偏好区域分配车位
const assignSpotByPreference = async (preferredArea: string) => {
    try {
        const userInfo = userStore.getUserInfo()
        if (!userInfo?.user_id) {
            console.error('用户信息不完整，缺少 user_id')
            return await assignRandomSpot()
        }

        const response = await autoAssignParkingSpot({
            user_id: userInfo.user_id,
            license_plate: licensePlate.value,
            preferred_area: preferredArea,
            vehicle_type: vehicleType.value
        })

        // 根据自定义指令，Axios 返回的是 res.data，直接使用 response
        if (response && response.success) {
            return {
                spot_number: response.assigned_spot.number,
                distance: response.distance || `${Math.floor(Math.random() * 200 + 50)}米`,
                walk_time: response.walk_time || `${Math.floor(Math.random() * 3 + 1)}分钟`
            }
        }

        // 如果偏好区域没有空位，尝试其他区域
        return await assignRandomSpot()

    } catch (error) {
        console.error('偏好区域分配失败:', error)
        return await assignRandomSpot()
    }
}

// 随机分配车位
const assignRandomSpot = async () => {
    try {
        const userInfo = userStore.getUserInfo()
        if (!userInfo?.user_id) {
            console.error('用户信息不完整，缺少 user_id')
            return null
        }

        // 获取停车场布局信息
        const layoutResponse = await getParkingLayout()
        let availableSpots = []

        // 根据自定义指令，Axios 返回的是 res.data，直接使用 layoutResponse
        if (layoutResponse && layoutResponse.layout) {
            // 从API获取可用车位
            const allAreas = layoutResponse.layout
            availableSpots = allAreas.flatMap(area =>
                area.spots.filter(spot => spot.status === 'available').map(spot => spot.spot_number)
            )
        } else {
            // 如果API失败，使用本地布局信息随机选择
            const allSpots = Object.values(parkingLayout.value).flat()
            availableSpots = allSpots.filter(spot => spot !== 'B03') // 排除已占用的车位
        }

        if (availableSpots.length > 0) {
            const randomSpot = availableSpots[Math.floor(Math.random() * availableSpots.length)]

            // 调用分配API
            const response = await autoAssignParkingSpot({
                user_id: userInfo.user_id,
                license_plate: licensePlate.value,
                vehicle_type: vehicleType.value,
                spot_number: randomSpot
            })

            // 根据自定义指令，Axios 返回的是 res.data，直接使用 response
            if (response && response.success) {
                return {
                    spot_number: response.assigned_spot.number,
                    distance: response.distance || `${Math.floor(Math.random() * 200 + 50)}米`,
                    walk_time: response.walk_time || `${Math.floor(Math.random() * 3 + 1)}分钟`
                }
            } else {
                // API调用失败，返回本地生成的信息
                return {
                    spot_number: randomSpot,
                    distance: `${Math.floor(Math.random() * 200 + 50)}米`,
                    walk_time: `${Math.floor(Math.random() * 3 + 1)}分钟`
                }
            }
        }

        return null

    } catch (error) {
        console.error('随机分配车位失败:', error)
        return null
    }
}

// 关闭WebSocket连接
const closeWebSocket = () => {
    stopFrameCapture()
    if (wsClient.value) {
        wsClient.value.close()
        wsClient.value = null
    }
}

// 组件挂载时初始化
onMounted(() => {
    initCamera()
    initWebSocket()
})

// 组件卸载时清理资源
onUnmounted(() => {
    stopCurrentStream()
    closeWebSocket()
})
</script>

<style scoped lang="scss">
/* 停车场缩略图样式 - 与admin dashboard保持一致 */
.parking-layout-thumbnail {
  position: relative;
}

.area-section {
  /* 区域样式 */
}

.parking-space-mini {
  width: 40px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border: 2px solid transparent;
}

.parking-space-mini.available {
  background-color: #10b981;
  color: white;
  border-color: #059669;
}

.parking-space-mini.occupied {
  background-color: #ef4444;
  color: white;
  border-color: #dc2626;
}

.parking-space-mini.assigned {
  background-color: #fbbf24;
  color: #92400e;
  border-color: #f59e0b;
  animation: pulse-yellow 2s infinite;
  box-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
}

.parking-space-mini:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.space-content-mini {
  text-align: center;
  font-size: 10px;
  font-weight: 600;
}

.space-id-mini {
  font-size: 10px;
  line-height: 1;
}

/* 黄色脉冲动画 */
@keyframes pulse-yellow {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

/* 响应式优化 */
@media (max-width: 768px) {
  .parking-space-mini {
    width: 32px;
    height: 24px;
  }

  .space-id-mini {
    font-size: 8px;
  }
}
</style>
