// 停车场仪表板API类型定义

// 停车场概览数据
export interface ParkingOverview {
  total_spots: number
  occupied_spots: number
  available_spots: number
  occupancy_rate: number
}

// 区域统计数据
export interface AreaStats {
  id: number
  occupied_spots: number
  available_spots: number
  occupancy_rate: number
  name: string
  description: string
  total_spots: number
  is_active: boolean
  created_time: string
  updated_time: string
}

// 今日统计数据
export interface TodayStats {
  total_detections: number
  enter_count: number
  exit_count: number
  revenue: number
}

// 每日趋势数据
export interface DailyTrend {
  date: string
  detections: number
  revenue: number
}

// 活跃会话数据
export interface ActiveSession {
  session_id: string
  license_plate: string
  spot: string
  enter_time: string
  duration_hours: number
}

// 仪表板响应数据
export interface DashboardResponse {
  overview: ParkingOverview
  area_stats: AreaStats[]
  today_stats: TodayStats
  daily_trends: DailyTrend[]
  active_sessions: ActiveSession[]
}

// API响应基础类型
export interface ApiResponse<T = any> {
  code?: number
  message?: string
  data?: T
  success?: boolean
}

// 停车位数据
export interface ParkingSpot {
  id: number
  area: number
  area_name: string
  spot_number: string
  status: 'occupied' | 'available' | 'reserved' | 'maintenance'
  is_active: boolean
  created_time: string
  updated_time: string
}

// 停车位列表响应数据
export interface ParkingSpotsResponse {
  spots: ParkingSpot[]
  total_count: number
}

// 仪表板API响应类型
export type DashboardApiResponse = ApiResponse<DashboardResponse>

// 停车位API响应类型
export type ParkingSpotsApiResponse = ApiResponse<ParkingSpotsResponse>

// 停车场布局数据
export interface ParkingLayoutDetectionInfo {
  vehicle_type: string
  confidence: number
  detection_time: string
}

export interface ParkingLayoutSpot {
  id: number
  spot_number: string
  status: 'occupied' | 'available'
  detection_info: ParkingLayoutDetectionInfo | null
}

export interface ParkingLayoutArea {
  area_name: string
  area_id: number
  total_spots: number
  occupied_spots: number
  available_spots: number
  occupancy_rate: number
  spots: ParkingLayoutSpot[]
}

export interface ParkingLayoutResponse {
  layout: ParkingLayoutArea[]
  last_updated: string
}

// 停车场布局API响应类型 - 直接返回layout数组
export type ParkingLayoutApiResponse = ApiResponse<ParkingLayoutArea[]>

// 停车区域管理相关类型
export interface ParkingArea {
  id: number
  name: string
  description: string
  total_spots: number
  occupied_spots: number
  available_spots: number
  occupancy_rate: number
  is_active: boolean
  created_time: string
}

export interface ParkingAreasResponse {
  areas: ParkingArea[]
  total_areas: number
  total_spots: number
  total_occupied: number
  total_available: number
}

export type ParkingAreasApiResponse = ApiResponse<ParkingAreasResponse>

// 检测记录相关类型
export interface DetectionRecord {
  id: number
  detection_time: string
  detection_type: string
  detection_type_display: string
  vehicle_type: string
  vehicle_type_display: string
  confidence: number
  license_plate: string
  image_url: string | null
  spot: number
  spot_info: string
}

export interface DetectionRecordsResponse {
  records: DetectionRecord[]
  pagination: {
    current_page: number
    total_pages: number
    total_count: number
    page_size: number
    has_next: boolean
    has_previous: boolean
  }
}

export type DetectionRecordsApiResponse = ApiResponse<DetectionRecordsResponse>

// 检测统计类型
export interface VehicleTypeStat {
  vehicle_type: string
  count: number
}

export interface HourlyStat {
  hour: string
  count: number
}

export interface DetectionStats {
  period_days: number
  total_detections: number
  enter_count: number
  exit_count: number
  vehicle_type_stats: VehicleTypeStat[]
  hourly_stats: HourlyStat[]
  avg_confidence: number
}

export type DetectionStatsApiResponse = ApiResponse<DetectionStats>

// 费用计算相关类型
export interface FeeCalculationRequest {
  entry_time: string
  exit_time: string
  vehicle_type: string
  area_id: number
}

export interface FeeCalculationResponse {
  total_fee: number
  duration_hours: number
  fee_breakdown: {
    base_fee: number
    hourly_fee: number
  }
  currency: string
}

export type FeeCalculationApiResponse = ApiResponse<FeeCalculationResponse>

// 支付订单相关类型
export interface PaymentOrder {
  id: string
  order_id: string
  amount: number
  payment_method: string
  status: 'pending' | 'completed' | 'failed'
  created_time: string
  license_plate: string
}

export interface PaymentOrdersResponse {
  orders: PaymentOrder[]
  total_count: number
  page: number
  page_size: number
}

export type PaymentOrdersApiResponse = ApiResponse<PaymentOrdersResponse>

// 支付统计类型
export interface PaymentMethodStat {
  payment_method: string
  count: number
  revenue: number
}

export interface DailyStat {
  date: string
  orders: number
  revenue: number
}

export interface PaymentStats {
  period_days: number
  total_orders: number
  paid_orders: number
  total_revenue: number
  avg_order_amount: number
  success_rate: number
  payment_method_stats: PaymentMethodStat[]
  daily_stats: DailyStat[]
}

export type PaymentStatsApiResponse = ApiResponse<PaymentStats>

// 系统日志相关类型
export interface SystemLog {
  id: number
  timestamp: string
  level: 'INFO' | 'WARNING' | 'ERROR'
  module: string
  message: string
  user_id?: number
  ip_address: string
}

export interface SystemLogsResponse {
  logs: SystemLog[]
  total_count: number
  page: number
  page_size: number
}

export type SystemLogsApiResponse = ApiResponse<SystemLogsResponse>

// 系统警报相关类型
export interface SystemAlert {
  id: number
  alert_type: string
  title: string
  message: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'active' | 'resolved'
  spot_id?: number
  license_plate?: string
  created_at: string
  resolved_at?: string
}

export interface SystemAlertsResponse {
  alerts: SystemAlert[]
  total_count: number
  page: number
  page_size: number
}

export type SystemAlertsApiResponse = ApiResponse<SystemAlertsResponse>

// 系统健康状态类型
export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical'
  uptime: string | number
  database_status: 'connected' | 'disconnected' | 'healthy'
  cache_status: 'active' | 'inactive'
  disk_usage: number
  memory_usage: number
  cpu_usage: number
  active_sessions: number
  last_check: string
  overall_status: 'healthy' | 'warning' | 'critical'
  network_status: 'connected' | 'disconnected'
  api_response_time: number
  active_connections: number
  error_rate: number
}

export type SystemHealthApiResponse = ApiResponse<SystemHealth>

// 用户停车偏好类型
export interface UserParkingPreference {
  license_plate: string
  preferred_area: string
  is_member: boolean
  member_since?: string
  auto_assign: boolean
}

export type UserParkingPreferenceApiResponse = ApiResponse<UserParkingPreference>

// 用户会员状态类型
export interface UserMembership {
  is_member: boolean
  license_plate: string
  membership_type?: 'monthly' | 'yearly'
  start_date?: string
  end_date?: string
}

export type UserMembershipApiResponse = ApiResponse<UserMembership>

// 自动分配停车位响应类型
export interface AutoAssignParkingSpotResponse {
  success: boolean
  message: string
  assigned_spot: {
    id: number
    number: string
    area_name: string
  }
  session_id: number
  spot_number?: string
  distance?: string
  walk_time?: string
}

export type AutoAssignParkingSpotApiResponse = ApiResponse<AutoAssignParkingSpotResponse>

// ==================== 费用配置管理相关类型 ====================

// 费用配置数据
export interface FeeConfig {
  id: number
  name: string
  base_fee: number
  base_hours: number
  hourly_rate: number
  daily_max_fee: number
  free_minutes: number
  is_active: boolean
  created_time: string
  updated_time?: string
}

// 费用配置列表响应
export interface FeeConfigsResponse {
  fee_configs: FeeConfig[]
  total_count: number
}

// 费用配置API响应类型
export type FeeConfigsApiResponse = ApiResponse<FeeConfigsResponse>
export type FeeConfigApiResponse = ApiResponse<FeeConfig>

// 创建/更新费用配置请求
export interface CreateFeeConfigRequest {
  name: string
  base_fee: number
  base_hours: number
  hourly_rate: number
  daily_max_fee: number
  free_minutes: number
}

export interface UpdateFeeConfigRequest extends Partial<CreateFeeConfigRequest> {
  is_active?: boolean
}

// 费用模板数据
export interface FeeTemplate {
  id: number
  name: string
  description: string
  base_fee: number
  base_hours: number
  hourly_rate: number
  daily_max_fee: number
  free_minutes: number
  template_type: 'standard' | 'night' | 'weekend' | 'holiday'
  is_default: boolean
}

// 费用模板列表响应
export interface FeeTemplatesResponse {
  templates: FeeTemplate[]
  total_count: number
}

// 费用模板API响应类型
export type FeeTemplatesApiResponse = ApiResponse<FeeTemplatesResponse>
