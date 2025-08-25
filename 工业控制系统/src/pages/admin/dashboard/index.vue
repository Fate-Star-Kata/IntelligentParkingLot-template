<script setup lang="ts">
import { reactive, computed, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Motion } from 'motion-v'
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import {
  getDashboardData,
  getParkingSpots,
  getParkingLayout,
  getDetectionStats,
  getPaymentStats,
  getSystemHealth,
  getParkingAreas,
  getDetectionRecords
} from '@/api/admin/hzadmin_api'
import type {
  DashboardResponse,
  ParkingOverview,
  AreaStats,
  TodayStats,
  DailyTrend,
  ActiveSession,
  ParkingSpotsResponse,
  ParkingSpot,
  ParkingLayoutResponse,
  ParkingLayoutArea,
  ParkingLayoutSpot,
  DetectionStats,
  PaymentStats,
  SystemHealth,
  ParkingAreasResponse,
  DetectionRecordsResponse
} from '@/types/apis/hzadmin_api_T'

// 注册ECharts组件
use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  LineChart,
  CanvasRenderer
])

// API响应数据
const loading = ref(false)
const dashboardResponse = ref<DashboardResponse | null>(null)
const overview = ref<ParkingOverview>({ total_spots: 0, occupied_spots: 0, available_spots: 0, occupancy_rate: 0 })
const areaStats = ref<AreaStats[]>([])
const todayStats = ref<TodayStats>({ total_detections: 0, enter_count: 0, exit_count: 0, revenue: 0 })
const dailyTrends = ref<DailyTrend[]>([])
const activeSessions = ref<ActiveSession[]>([])
const parkingSpotsResponse = ref<ParkingSpotsResponse | null>(null)
const parkingSpots = ref<ParkingSpot[]>([])
const parkingLayoutData = ref<ParkingLayoutArea[]>([])
const detectionStatsData = ref<DetectionStats | null>(null)
const paymentStatsData = ref<PaymentStats | null>(null)
const systemHealthData = ref<SystemHealth | null>(null)
const parkingAreasData = ref<ParkingAreasResponse | null>(null)
const recentDetectionRecords = ref<DetectionRecordsResponse | null>(null)

// 停车位布局数据（基于停车场布局API数据）
const parkingLayout = computed(() => {
  console.log("parkingLayoutData length:", parkingLayoutData.value.length)
  console.log("parkingLayoutData content:", parkingLayoutData.value)
  console.log("parkingSpots length:", parkingSpots.value.length)
  if (parkingLayoutData.value.length > 0) {
    return {
      title: '停车场布局 - YOLO实时检测状态',
      areas: parkingLayoutData.value.map(area => ({
        id: area.area_id.toString(),
        name: area.area_name,
        spaces: area.spots.map(spot => ({
          id: spot.spot_number,
          status: spot.status,
          vehicle: spot.status === 'occupied' ? (spot.detection_info?.vehicle_type || 'Vehicle') : undefined
        }))
      }))
    }
  }

  // 如果布局API数据为空，回退到使用停车位列表数据
  const areaGroups = parkingSpots.value.reduce((groups, spot) => {
    const areaName = spot.area_name
    if (!groups[areaName]) {
      groups[areaName] = []
    }
    groups[areaName].push(spot)
    return groups
  }, {} as Record<string, ParkingSpot[]>)

  return {
    title: '停车场布局 - YOLO实时检测状态',
    areas: Object.entries(areaGroups).map(([areaName, spots]) => ({
      id: spots[0]?.area.toString() || '0',
      name: areaName,
      spaces: spots.map(spot => ({
        id: spot.spot_number,
        status: spot.status,
        vehicle: spot.status === 'occupied' ? 'Vehicle' : undefined
      }))
    }))
  }
})

// 计算属性
const availableSpaces = computed(() => overview.value.available_spots)
const occupancyRate = computed(() => overview.value.occupancy_rate.toFixed(1))

// 最近检测活动数据计算属性
const recentActivities = computed(() => {
  if (recentDetectionRecords.value && recentDetectionRecords.value.records) {
    return recentDetectionRecords.value.records.map(record => {
      const time = new Date(record.detection_time).toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      })

      // 根据detection_type确定动作
      let action = '未知'
      if (record.detection_type === 'vehicle_enter') {
        action = '进入'
      } else if (record.detection_type === 'vehicle_exit') {
        action = '离开'
      } else if (record.detection_type === 'license_plate_recognition') {
        action = '识别'
      }

      // 使用API返回的vehicle_type_display或进行映射
      const vehicle = record.vehicle_type_display || record.vehicle_type

      return {
        time,
        action,
        vehicle,
        space: record.spot_info,
        licensePlate: record.license_plate
      }
    })
  }

  // 后备数据
  return [
    { time: '13:33', action: '离开', vehicle: 'SUV', space: 'A01', licensePlate: '川E33333' },
    { time: '13:28', action: '进入', vehicle: '轿车', space: 'B03', licensePlate: '粤D22222' },
    { time: '13:25', action: '离开', vehicle: '货车', space: 'A05', licensePlate: '沪C11111' },
    { time: '13:20', action: '进入', vehicle: 'SUV', space: 'A02', licensePlate: '京B67890' },
    { time: '13:15', action: '离开', vehicle: '轿车', space: 'B01', licensePlate: '京A12345' },
    { time: '13:10', action: '进入', vehicle: 'MPV', space: 'B04', licensePlate: '川E33333' }
  ]
})

// 仪表板数据
const dashboardData = reactive({
  title: '智能停车场管理系统',
  refreshButton: '刷新数据',
  statsCards: [
    {
      id: 1,
      title: '总车位数',
      value: computed(() => overview.value.total_spots.toString()),
      icon: 'Grid',
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      valueColor: 'text-blue-900',
      iconColor: 'text-blue-500'
    },
    {
      id: 2,
      title: '已占用',
      value: computed(() => overview.value.occupied_spots.toString()),
      icon: 'Lock',
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      valueColor: 'text-red-900',
      iconColor: 'text-red-500'
    },
    {
      id: 3,
      title: '可用车位',
      value: computed(() => availableSpaces.value.toString()),
      icon: 'Unlock',
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      valueColor: 'text-green-900',
      iconColor: 'text-green-500'
    },
    {
      id: 4,
      title: '占用率',
      value: computed(() => `${occupancyRate.value}%`),
      icon: 'TrendCharts',
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      valueColor: 'text-purple-900',
      iconColor: 'text-purple-500'
    },
    {
      id: 5,
      title: '今日收入',
      value: computed(() => `¥${todayStats.value.revenue}`),
      icon: 'Money',
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      valueColor: 'text-yellow-900',
      iconColor: 'text-yellow-500'
    },
    {
      id: 6,
      title: '今日检测',
      value: computed(() => todayStats.value.total_detections.toString()),
      icon: 'View',
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      valueColor: 'text-indigo-900',
      iconColor: 'text-indigo-500'
    }
  ],
  charts: [
    {
      id: 1,
      title: '今日车流量统计',
      icon: 'TrendCharts',
      type: 'line',
      data: {
        hours: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
        inFlow: [2, 1, 0, 3, 12, 25, 18, 22, 15, 28, 20, 8],
        outFlow: [1, 2, 1, 2, 8, 20, 15, 18, 20, 25, 22, 12]
      }
    },
    {
      id: 2,
      title: '最近检测活动',
      icon: 'Monitor',
      type: 'activity',
      data: recentActivities
    }
  ]
})

// 动画配置
const cardVariants = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  whileHover: {
    scale: 1.02,
    y: -5,
    transition: { duration: 0.2, ease: 'easeOut' } as any,
  },
  transition: { duration: 0.4, ease: 'easeOut' } as any,
}

const statsCardVariants = {
  initial: { opacity: 0, y: 40, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1 },
  whileHover: {
    scale: 1.05,
    y: -8,
    transition: { duration: 0.3, ease: 'easeOut' } as any,
  },
  transition: { duration: 0.5, ease: 'easeOut' } as any,
}

const iconVariants = {
  initial: { scale: 0, rotate: -180 },
  animate: { scale: 1, rotate: 0 },
  whileHover: {
    scale: 1.2,
    rotate: 10,
    transition: { duration: 0.2, ease: 'easeOut' } as any,
  },
  transition: { duration: 0.6, delay: 0.3, ease: 'easeOut' } as any,
}

// 加载停车场布局数据
const loadParkingLayoutData = async () => {
  try {
    const response = await getParkingLayout()
    console.log('API调用返回数据:', response)
    if (response && response.layout && Array.isArray(response.layout)) {
      parkingLayoutData.value = response.layout
      console.log('停车场布局数据加载成功:', response.layout)
      console.log('停车场区域数据:', response.layout)
    }
  } catch (error: unknown) {
    console.error('加载停车场布局数据失败:', error)
    // API调用失败时使用模拟布局数据
    const mockLayoutData: ParkingLayoutArea[] = [
      {
        area_name: 'A区',
        area_id: 1,
        total_spots: 10,
        occupied_spots: 2,
        available_spots: 8,
        occupancy_rate: 20,
        spots: [
          { id: 1, spot_number: 'A001', status: 'occupied', detection_info: { vehicle_type: '轿车', confidence: 0.85, detection_time: '2025-08-13T15:30:15.545676' } },
          { id: 2, spot_number: 'A002', status: 'available', detection_info: null },
          { id: 3, spot_number: 'A003', status: 'available', detection_info: null },
          { id: 4, spot_number: 'A004', status: 'occupied', detection_info: { vehicle_type: 'SUV', confidence: 0.92, detection_time: '2025-08-13T15:30:15.567676' } },
          { id: 5, spot_number: 'A005', status: 'available', detection_info: null }
        ]
      },
      {
        area_name: 'B区',
        area_id: 2,
        total_spots: 10,
        occupied_spots: 1,
        available_spots: 9,
        occupancy_rate: 10,
        spots: [
          { id: 11, spot_number: 'B001', status: 'available', detection_info: null },
          { id: 12, spot_number: 'B002', status: 'occupied', detection_info: { vehicle_type: '货车', confidence: 0.93, detection_time: '2025-08-13T15:30:15.570676' } },
          { id: 13, spot_number: 'B003', status: 'available', detection_info: null },
          { id: 14, spot_number: 'B004', status: 'available', detection_info: null },
          { id: 15, spot_number: 'B005', status: 'available', detection_info: null }
        ]
      }
    ]
    parkingLayoutData.value = mockLayoutData
    console.log('使用模拟停车场布局数据，数据长度:', mockLayoutData.length)
    console.log('模拟数据内容:', mockLayoutData)
    ElMessage.warning('无法连接到布局服务器，使用模拟数据显示')
  }
}

// 加载检测统计数据
const loadDetectionStats = async () => {
  try {
    const response = await getDetectionStats()
    detectionStatsData.value = response
  } catch (error: unknown) {
    console.error('加载检测统计数据失败:', error)
    // 使用模拟数据作为后备
    detectionStatsData.value = {
      period_days: 7,
      total_detections: 1250,
      enter_count: 625,
      exit_count: 555,
      vehicle_type_stats: [
        { vehicle_type: 'car', count: 850 },
        { vehicle_type: 'truck', count: 250 },
        { vehicle_type: 'suv', count: 150 }
      ],
      hourly_stats: [
        { hour: '08:00', count: 45 },
        { hour: '09:00', count: 78 },
        { hour: '10:00', count: 92 },
        { hour: '11:00', count: 85 },
        { hour: '12:00', count: 110 },
        { hour: '13:00', count: 95 },
        { hour: '14:00', count: 88 },
        { hour: '15:00', count: 102 },
        { hour: '16:00', count: 125 },
        { hour: '17:00', count: 140 },
        { hour: '18:00', count: 98 },
        { hour: '19:00', count: 67 }
      ],
      avg_confidence: 0.944
    }
  }
}

// 加载支付统计数据
const loadPaymentStats = async () => {
  try {
    const response = await getPaymentStats()
    paymentStatsData.value = response
  } catch (error: unknown) {
    console.error('加载支付统计数据失败:', error)
    // 使用模拟数据作为后备
    paymentStatsData.value = {
      period_days: 7,
      total_orders: 342,
      paid_orders: 325,
      total_revenue: 15680.50,
      avg_order_amount: 45.8,
      success_rate: 95.0,
      payment_method_stats: [
        { payment_method: 'wechat', count: 180, revenue: 8240.0 },
        { payment_method: 'alipay', count: 145, revenue: 6640.5 },
        { payment_method: 'cash', count: 17, revenue: 800.0 }
      ],
      daily_stats: [
        { date: '2024-01-10', orders: 45, revenue: 1250.00 },
        { date: '2024-01-11', orders: 52, revenue: 1380.50 },
        { date: '2024-01-12', orders: 38, revenue: 1150.00 },
        { date: '2024-01-13', orders: 48, revenue: 1420.00 },
        { date: '2024-01-14', orders: 55, revenue: 1680.00 },
        { date: '2024-01-15', orders: 62, revenue: 1800.00 },
        { date: '2024-01-16', orders: 42, revenue: 6000.00 }
      ]
    }
  }
}

// 加载系统健康状态
const loadSystemHealth = async () => {
  try {
    const response = await getSystemHealth()
    systemHealthData.value = response
  } catch (error: unknown) {
    console.error('加载系统健康状态失败:', error)
    // 使用模拟数据作为后备
    systemHealthData.value = {
      status: 'healthy',
      overall_status: 'healthy',
      cpu_usage: 45.2,
      memory_usage: 68.5,
      disk_usage: 32.1,
      network_status: 'connected',
      database_status: 'healthy',
      cache_status: 'active',
      api_response_time: 120,
      active_connections: 25,
      active_sessions: 25,
      error_rate: 0.5,
      uptime: 99.8,
      last_check: '2024-01-15T10:30:00Z'
    }
  }
}

// 加载停车区域数据
const loadParkingAreas = async () => {
  try {
    // 使用layout API获取实时数据
    const response = await getParkingLayout()
    if (response && response.layout && Array.isArray(response.layout)) {
      // 将layout数据转换为areas格式
      const areas = response.layout.map(area => ({
        id: area.area_id,
        name: area.area_name,
        description: `停车区域 - ${area.area_name}`,
        total_spots: area.total_spots,
        occupied_spots: area.occupied_spots,
        available_spots: area.available_spots,
        occupancy_rate: area.occupancy_rate,
        is_active: true,
        created_time: '2024-01-01T00:00:00Z'
      }))

      // 计算总计数据
      const total_areas = areas.length
      const total_spots = areas.reduce((sum, area) => sum + area.total_spots, 0)
      const total_occupied = areas.reduce((sum, area) => sum + area.occupied_spots, 0)
      const total_available = areas.reduce((sum, area) => sum + area.available_spots, 0)

      parkingAreasData.value = {
        areas,
        total_areas,
        total_spots,
        total_occupied,
        total_available
      }
    }
  } catch (error: unknown) {
    console.error('加载停车区域数据失败:', error)
    // 使用模拟数据作为后备
    parkingAreasData.value = {
      areas: [
        {
          id: 1,
          name: 'A区',
          description: '地下一层停车区域',
          total_spots: 10,
          occupied_spots: 4,
          available_spots: 6,
          occupancy_rate: 40.0,
          is_active: true,
          created_time: '2024-01-01T00:00:00Z'
        },
        {
          id: 2,
          name: 'B区',
          description: '地下二层停车区域',
          total_spots: 15,
          occupied_spots: 3,
          available_spots: 12,
          occupancy_rate: 20.0,
          is_active: true,
          created_time: '2024-01-01T00:00:00Z'
        }
      ],
      total_areas: 2,
      total_spots: 25,
      total_occupied: 7,
      total_available: 18
    }
  }
}

// 加载最近检测记录
const loadRecentDetectionRecords = async () => {
  try {
    const response = await getDetectionRecords({
      page: 1,
      page_size: 10
    })
    recentDetectionRecords.value = response
  } catch (error: unknown) {
    console.error('加载最近检测记录失败:', error)
    // 使用模拟数据作为后备
    recentDetectionRecords.value = {
      records: [
        {
          id: 1,
          detection_time: '2024-01-15T13:33:00Z',
          detection_type: 'vehicle_exit',
          detection_type_display: 'vehicle_exit',
          vehicle_type: 'suv',
          vehicle_type_display: 'SUV',
          confidence: 0.95,
          license_plate: '川E33333',
          image_url: null,
          spot: 1,
          spot_info: 'A区-A01'
        },
        {
          id: 2,
          detection_time: '2024-01-15T13:28:00Z',
          detection_type: 'vehicle_enter',
          detection_type_display: 'vehicle_enter',
          vehicle_type: 'car',
          vehicle_type_display: '轿车',
          confidence: 0.88,
          license_plate: '粤D22222',
          image_url: null,
          spot: 3,
          spot_info: 'B区-B03'
        },
        {
          id: 3,
          detection_time: '2024-01-15T13:25:00Z',
          detection_type: 'vehicle_exit',
          detection_type_display: 'vehicle_exit',
          vehicle_type: 'truck',
          vehicle_type_display: '货车',
          confidence: 0.92,
          license_plate: '沪C11111',
          image_url: null,
          spot: 5,
          spot_info: 'A区-A05'
        },
        {
          id: 4,
          detection_time: '2024-01-15T13:20:00Z',
          detection_type: 'vehicle_enter',
          detection_type_display: 'vehicle_enter',
          vehicle_type: 'suv',
          vehicle_type_display: 'SUV',
          confidence: 0.90,
          license_plate: '京B67890',
          image_url: null,
          spot: 2,
          spot_info: 'A区-A02'
        },
        {
          id: 5,
          detection_time: '2024-01-15T13:15:00Z',
          detection_type: 'vehicle_exit',
          detection_type_display: 'vehicle_exit',
          vehicle_type: 'car',
          vehicle_type_display: '轿车',
          confidence: 0.87,
          license_plate: '京A12345',
          image_url: null,
          spot: 1,
          spot_info: 'B区-B01'
        },
        {
          id: 6,
          detection_time: '2024-01-15T13:10:00Z',
          detection_type: 'vehicle_enter',
          detection_type_display: 'vehicle_enter',
          vehicle_type: 'mpv',
          vehicle_type_display: 'MPV',
          confidence: 0.93,
          license_plate: '川E33333',
          image_url: null,
          spot: 4,
          spot_info: 'B区-B04'
        }
      ],
      pagination: {
        current_page: 1,
        total_pages: 1,
        total_count: 6,
        page_size: 10,
        has_next: false,
        has_previous: false
      }
    }
  }
}

// 加载停车位数据
const loadParkingSpotsData = async () => {
  try {
    const response = await getParkingSpots()

    if (response) {
      parkingSpotsResponse.value = response
      parkingSpots.value = response.spots
    }
  } catch (error: unknown) {
    console.error('加载停车位数据失败:', error)
    ElMessage.error('加载停车位数据失败，请稍后重试')
  }
}

// 数据加载函数
const loadDashboardData = async () => {
  try {
    loading.value = true
    const response = await getDashboardData()

    if (response) {
      dashboardResponse.value = response
      overview.value = response.overview
      areaStats.value = response.area_stats
      todayStats.value = response.today_stats
      dailyTrends.value = response.daily_trends
      activeSessions.value = response.active_sessions
    }
  } catch (error: unknown) {
    console.error('加载仪表板数据失败:', error)
    ElMessage.error('加载数据失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 刷新数据
const refreshData = async () => {
  await Promise.all([
    loadDashboardData(),
    loadParkingLayoutData(),
    loadParkingSpotsData(),
    loadDetectionStats(),
    loadPaymentStats(),
    loadSystemHealth(),
    loadParkingAreas(),
    loadRecentDetectionRecords()
  ])
}

// ECharts配置
const trafficChartOption = computed(() => ({
  title: {
    text: '最近7天趋势统计',
    left: 'center',
    textStyle: {
      fontSize: 16,
      fontWeight: 'normal'
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
  },
  legend: {
    data: ['检测次数', '收入'],
    bottom: 10
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: dailyTrends.value.map(item => item.date),
    axisLabel: {
      rotate: 45
    }
  },
  yAxis: [
    {
      type: 'value',
      name: '检测次数',
      position: 'left'
    },
    {
      type: 'value',
      name: '收入 (¥)',
      position: 'right'
    }
  ],
  series: [
    {
      name: '检测次数',
      type: 'line',
      yAxisIndex: 0,
      data: dailyTrends.value.map(item => item.detections),
      smooth: true,
      itemStyle: {
        color: '#67C23A'
      },
      lineStyle: {
        color: '#67C23A'
      }
    },
    {
      name: '收入',
      type: 'line',
      yAxisIndex: 1,
      data: dailyTrends.value.map(item => item.revenue),
      smooth: true,
      itemStyle: {
        color: '#E6A23C'
      },
      lineStyle: {
        color: '#E6A23C'
      }
    }
  ]
}))

// 组件挂载时加载数据
onMounted(async () => {
  await Promise.all([
    loadDashboardData(),
    loadParkingLayoutData(),
    loadParkingSpotsData(),
    loadDetectionStats(),
    loadPaymentStats(),
    loadSystemHealth(),
    loadParkingAreas(),
    loadRecentDetectionRecords()
  ])
})
</script>

<template>
  <div class="dashboard">
    <!-- 仪表板页面 -->
    <Motion :initial="cardVariants.initial" :animate="cardVariants.animate" :whileHover="cardVariants.whileHover"
      :transition="{ ...cardVariants.transition, delay: 0.3 }">
      <el-card class="mb-6">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-lg font-medium">{{ dashboardData.title }}</span>
            <Motion :initial="{ scale: 0.8, opacity: 0 }" :animate="{ scale: 1, opacity: 1 }"
              :whileHover="{ scale: 1.05 }" :transition="{ duration: 0.3, delay: 0.5 }">
              <el-button type="primary" size="small" :loading="loading" @click="refreshData">{{
                dashboardData.refreshButton }}</el-button>
            </Motion>
          </div>
        </template>

        <!-- 统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Motion v-for="(card, index) in dashboardData.statsCards" :key="card.id" :initial="statsCardVariants.initial"
            :animate="statsCardVariants.animate" :whileHover="statsCardVariants.whileHover"
            :transition="{ ...statsCardVariants.transition, delay: 0.4 + index * 0.1 }"
            :class="`${card.bgColor} p-6 rounded-lg cursor-pointer`">
            <div class="flex items-center justify-between">
              <div>
                <p :class="`${card.textColor} text-sm font-medium`">{{ card.title }}</p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.6 + index * 0.1 }">
                  <p :class="`text-2xl font-bold ${card.valueColor}`">{{ card.value }}</p>
                </Motion>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover"
                :transition="{ ...iconVariants.transition, delay: 0.5 + index * 0.1 }" :class="card.iconColor">
                <el-icon size="32">
                  <component :is="card.icon" />
                </el-icon>
              </Motion>
            </div>
          </Motion>
        </div>
      </el-card>
    </Motion>

    <!-- 停车位布局图 -->
    <Motion :initial="cardVariants.initial" :animate="cardVariants.animate" :whileHover="cardVariants.whileHover"
      :transition="{ ...cardVariants.transition, delay: 0.7 }">
      <el-card class="mb-6">
        <template #header>
          <span class="text-lg font-medium">{{ parkingLayout.title }}</span>
        </template>

        <div class="parking-layout">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div v-for="area in parkingLayout.areas" :key="area.id" class="area-section">
              <h3 class="text-center text-gray-600 font-medium mb-4">{{ area.name }}</h3>
              <div class="flex justify-center gap-2 flex-wrap">
                <Motion v-for="(space, index) in area.spaces" :key="space.id" :initial="{ opacity: 0, scale: 0.8 }"
                  :animate="{ opacity: 1, scale: 1 }" :whileHover="{ scale: 1.05, y: -2 }"
                  :transition="{ duration: 0.3, delay: 0.8 + index * 0.1 }" class="parking-space" :class="{
                    'occupied': space.status === 'occupied',
                    'available': space.status === 'available'
                  }">
                  <div class="space-content">
                    <div class="space-id">{{ space.id }}</div>
                    <div v-if="space.vehicle" class="vehicle-info">{{ space.vehicle }}</div>
                  </div>
                </Motion>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </Motion>

    <!-- 检测统计和支付统计 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- 检测统计 -->
      <Motion :initial="cardVariants.initial" :animate="cardVariants.animate" :whileHover="cardVariants.whileHover"
        :transition="{ ...cardVariants.transition, delay: 0.8 }">
        <el-card>
          <template #header>
            <span class="font-medium">检测统计</span>
          </template>
          <div v-if="detectionStatsData" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600">{{ detectionStatsData.total_detections }}</div>
                <div class="text-sm text-gray-500">总检测次数</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-green-600">{{ (detectionStatsData.avg_confidence * 100).toFixed(1)
                  }}%
                </div>
                <div class="text-sm text-gray-500">平均置信度</div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div class="text-center p-2 bg-blue-50 rounded">
                <div class="font-semibold">{{ detectionStatsData.enter_count }}</div>
                <div class="text-gray-600">入场次数</div>
              </div>
              <div class="text-center p-2 bg-green-50 rounded">
                <div class="font-semibold">{{ detectionStatsData.exit_count }}</div>
                <div class="text-gray-600">出场次数</div>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-gray-500">加载中...</div>
        </el-card>
      </Motion>

      <!-- 支付统计 -->
      <Motion :initial="cardVariants.initial" :animate="cardVariants.animate" :whileHover="cardVariants.whileHover"
        :transition="{ ...cardVariants.transition, delay: 0.85 }">
        <el-card>
          <template #header>
            <span class="font-medium">支付统计</span>
          </template>
          <div v-if="paymentStatsData" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-green-600">¥{{ paymentStatsData.total_revenue.toFixed(2) }}</div>
                <div class="text-sm text-gray-500">总收入</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600">{{ paymentStatsData.success_rate }}%</div>
                <div class="text-sm text-gray-500">支付成功率</div>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-2 text-sm">
              <div v-for="method in paymentStatsData.payment_method_stats" :key="method.payment_method"
                class="text-center p-2 rounded" :class="{
                  'bg-green-50': method.payment_method === 'wechat',
                  'bg-blue-50': method.payment_method === 'alipay',
                  'bg-gray-50': method.payment_method === 'cash'
                }">
                <div class="font-semibold">{{ method.count }}</div>
                <div class="text-gray-600">
                  {{ method.payment_method === 'wechat' ? '微信支付' :
                    method.payment_method === 'alipay' ? '支付宝' :
                      method.payment_method === 'cash' ? '现金' : method.payment_method }}
                </div>
                <div class="text-xs text-gray-500">¥{{ method.revenue.toFixed(2) }}</div>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-gray-500">加载中...</div>
        </el-card>
      </Motion>
    </div>

    <!-- 系统健康状态和停车区域 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- 系统健康状态 -->
      <Motion :initial="cardVariants.initial" :animate="cardVariants.animate" :whileHover="cardVariants.whileHover"
        :transition="{ ...cardVariants.transition, delay: 0.9 }">
        <el-card>
          <template #header>
            <span class="font-medium">系统健康状态</span>
          </template>
          <div v-if="systemHealthData" class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">整体状态</span>
              <span :class="[
                'px-2 py-1 rounded-full text-xs font-medium',
                systemHealthData.overall_status === 'healthy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              ]">
                {{ systemHealthData.overall_status === 'healthy' ? '健康' : '异常' }}
              </span>
            </div>
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span>CPU使用率</span>
                <span class="font-medium">{{ systemHealthData.cpu_usage }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-blue-600 h-2 rounded-full" :style="{ width: systemHealthData.cpu_usage + '%' }"></div>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span>内存使用率</span>
                <span class="font-medium">{{ systemHealthData.memory_usage }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-green-600 h-2 rounded-full" :style="{ width: systemHealthData.memory_usage + '%' }">
                </div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div class="text-center">
                <div class="font-semibold text-blue-600">{{ systemHealthData.uptime }}%</div>
                <div class="text-gray-600">系统正常运行时间</div>
              </div>
              <div class="text-center">
                <div class="font-semibold text-green-600">{{ systemHealthData.api_response_time }}ms</div>
                <div class="text-gray-600">API响应时间</div>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-gray-500">加载中...</div>
        </el-card>
      </Motion>

      <!-- 停车区域概览 -->
      <Motion :initial="cardVariants.initial" :animate="cardVariants.animate" :whileHover="cardVariants.whileHover"
        :transition="{ ...cardVariants.transition, delay: 0.95 }">
        <el-card>
          <template #header>
            <span class="font-medium">停车区域概览</span>
          </template>
          <div v-if="parkingAreasData" class="space-y-3">
            <div v-for="area in parkingAreasData.areas" :key="area.id" class="border rounded-lg p-3">
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-medium">{{ area.name }}</h4>
                <span class="text-sm text-gray-500">{{ area.occupancy_rate.toFixed(1) }}%</span>
              </div>
              <div class="text-sm text-gray-600 mb-2">{{ area.description }}</div>
              <div class="flex items-center justify-between text-sm">
                <span>{{ area.occupied_spots }}/{{ area.total_spots }}</span>
                <div class="w-20 bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-600 h-2 rounded-full" :style="{ width: area.occupancy_rate + '%' }"></div>
                </div>
              </div>
            </div>
            <div class="mt-4 pt-3 border-t">
              <div class="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <div class="font-semibold text-blue-600">{{ parkingAreasData.total_areas }}</div>
                  <div class="text-gray-600">总区域</div>
                </div>
                <div>
                  <div class="font-semibold text-green-600">{{ parkingAreasData.total_available }}</div>
                  <div class="text-gray-600">可用车位</div>
                </div>
                <div>
                  <div class="font-semibold text-red-600">{{ parkingAreasData.total_occupied }}</div>
                  <div class="text-gray-600">已占用</div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-gray-500">加载中...</div>
        </el-card>
      </Motion>
    </div>

    <!-- 图表区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Motion :initial="cardVariants.initial" :animate="cardVariants.animate" :whileHover="cardVariants.whileHover"
        :transition="{ ...cardVariants.transition, delay: 0.8 }">
        <el-card>
          <template #header>
            <span class="font-medium">{{ dashboardData.charts[0].title }}</span>
          </template>
          <div class="h-80">
            <VChart :option="trafficChartOption" class="w-full h-full" />
          </div>
        </el-card>
      </Motion>

      <Motion :initial="cardVariants.initial" :animate="cardVariants.animate" :whileHover="cardVariants.whileHover"
        :transition="{ ...cardVariants.transition, delay: 0.9 }">
        <el-card>
          <template #header>
            <span class="font-medium">{{ dashboardData.charts[1].title }}</span>
          </template>
          <div class="h-80 overflow-y-auto">
            <div class="space-y-3">
              <Motion v-for="(activity, index) in recentActivities" :key="index" :initial="{ opacity: 0, x: -20 }"
                :animate="{ opacity: 1, x: 0 }" :transition="{ duration: 0.3, delay: 1.0 + index * 0.1 }"
                class="activity-item p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <span class="text-sm text-gray-500 font-mono">{{ activity.time }}</span>
                    <span class="text-sm font-medium" :class="{
                      'text-green-600': activity.action === '进入',
                      'text-red-600': activity.action === '离开',
                      'text-orange-600': activity.action === '识别'
                    }">
                      {{ activity.vehicle }}{{ activity.action }}
                    </span>
                    <span class="text-sm text-purple-600 font-medium">{{ activity.licensePlate }}</span>
                    <span class="text-sm text-blue-600 font-semibold">{{ activity.space }}</span>
                  </div>
                  <el-icon class="text-gray-400">
                    <Monitor />
                  </el-icon>
                </div>
              </Motion>
            </div>
          </div>
        </el-card>
      </Motion>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  width: 100%;
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  min-height: 100vh;
  padding: 20px;
  position: relative;
}

.dashboard::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
  animation: grid-move 20s linear infinite;
}

/* 统计卡片增强样式 */
.cursor-pointer {
  cursor: pointer;
  background: rgba(6, 182, 212, 0.1) !important;
  border: 1px solid rgba(6, 182, 212, 0.3) !important;
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  color: #e5e7eb !important;
}

.cursor-pointer:hover {
  box-shadow: 0 8px 25px rgba(6, 182, 212, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border-color: rgba(6, 182, 212, 0.6) !important;
  transform: translateY(-2px);
}

/* 停车位布局样式 */
.parking-layout {
  padding: 20px 0;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  border: 1px solid rgba(6, 182, 212, 0.3);
}

.area-section {
  /* 移除margin-bottom，使用grid gap代替 */
}

.area-section h3 {
  color: #06b6d4 !important;
  text-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
}

.parking-space {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 2px solid transparent;
}

.parking-space.available {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.8) 0%, rgba(5, 150, 105, 0.9) 100%);
  color: white;
  border-color: #10b981;
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
}

.parking-space.occupied {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.8) 0%, rgba(220, 38, 38, 0.9) 100%);
  color: white;
  border-color: #ef4444;
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.4);
}

.parking-space:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 20px rgba(6, 182, 212, 0.3);
}

.space-content {
  text-align: center;
  font-size: 12px;
  font-weight: 600;
}

.space-id {
  font-size: 14px;
  margin-bottom: 2px;
}

.vehicle-info {
  font-size: 10px;
  opacity: 0.9;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 2px 4px;
  border-radius: 4px;
  margin-top: 2px;
}

/* 响应式动画优化 */
@media (prefers-reduced-motion: reduce) {

  .cursor-pointer,
  .parking-space {
    transition: none;
  }
}

/* 增强卡片视觉效果 */
:deep(.el-card) {
  border-radius: 12px;
  border: 1px solid rgba(6, 182, 212, 0.3);
  background: rgba(31, 41, 55, 0.8) !important;
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

:deep(.el-card:hover) {
  box-shadow: 0 8px 25px rgba(6, 182, 212, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border-color: rgba(6, 182, 212, 0.5);
}

:deep(.el-card__header) {
  background: rgba(6, 182, 212, 0.1);
  border-bottom: 1px solid rgba(6, 182, 212, 0.3);
  color: #06b6d4;
  font-weight: 600;
}

:deep(.el-card__body) {
  background: transparent;
  color: #e5e7eb;
}

/* 活动项样式 */
.activity-item {
  border-left: 3px solid transparent;
  transition: all 0.3s ease;
  background: rgba(6, 182, 212, 0.05) !important;
  border: 1px solid rgba(6, 182, 212, 0.2);
  color: #e5e7eb;
}

.activity-item:hover {
  border-left-color: #06b6d4;
  background: rgba(6, 182, 212, 0.15) !important;
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.3);
  transform: translateX(3px);
}

/* 网格动画 */
@keyframes grid-move {
  0% {
    transform: translate(0, 0);
  }

  100% {
    transform: translate(50px, 50px);
  }
}

/* Element Plus 组件深度样式覆盖 */
:deep(.el-row) {
  margin: 0 !important;
}

:deep(.el-col) {
  padding: 10px;
}

:deep(.el-statistic__content) {
  color: #06b6d4 !important;
  font-weight: 600;
}

:deep(.el-statistic__number) {
  color: #06b6d4 !important;
  text-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
}

:deep(.el-statistic__title) {
  color: #e5e7eb !important;
  font-weight: 500;
}

:deep(.el-icon) {
  color: #06b6d4 !important;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .dashboard {
    padding: 10px;
  }

  .parking-space {
    width: 60px;
    height: 60px;
    font-size: 12px;
  }

  .space-id {
    font-size: 10px;
  }

  .vehicle-info {
    font-size: 8px;
  }

  .activity-item {
    padding: 8px;
  }

  :deep(.el-col) {
    padding: 5px;
  }
}
</style>
