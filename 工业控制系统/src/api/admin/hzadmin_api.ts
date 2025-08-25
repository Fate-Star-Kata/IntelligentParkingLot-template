import type {
    DashboardResponse,
    ParkingSpotsResponse,
    ParkingLayoutResponse,
    ParkingLayoutArea,
    ParkingAreasResponse,
    DetectionRecordsResponse,
    DetectionStats,
    FeeCalculationRequest,
    FeeCalculationResponse,
    PaymentOrdersResponse,
    PaymentStats,
    SystemLogsResponse,
    SystemAlertsResponse,
    SystemHealth,
    UserParkingPreference,
    UserMembership,
    ApiResponse,
    FeeConfigsResponse,
    FeeConfig,
    CreateFeeConfigRequest,
    UpdateFeeConfigRequest,
    FeeTemplatesResponse,
    AutoAssignParkingSpotResponse
} from '@/types/apis/hzadmin_api_T'
import serviceAxios from '@/http'

// ==================== 仪表板相关接口 ====================

// 获取仪表板完整数据
export function getDashboardData(): Promise<DashboardResponse> {
    return serviceAxios({
        url: '/hzsystem_parking/dashboard/',
        method: 'get'
    })
}

// 获取停车场布局
export function getParkingLayout(): Promise<ParkingLayoutResponse> {
    return serviceAxios({
        url: '/hzsystem_parking/dashboard/layout/',
        method: 'get'
    })
}

// ==================== 停车位管理接口 ====================

// 获取停车位列表
export function getParkingSpots(params?: {
    area_id?: number
    status?: 'available' | 'occupied' | 'reserved' | 'maintenance'
    vehicle_type?: string
    page?: number
    page_size?: number
}): Promise<ParkingSpotsResponse> {
    return serviceAxios({
        url: '/hzsystem_parking/parking/spots/',
        method: 'get',
        params
    })
}

// 创建停车位
export function createParkingSpot(data: {
    spot_number: string
    area: number
    spot_type: string
}): Promise<ApiResponse<any>> {
    return serviceAxios({
        url: '/hzsystem_parking/parking/spots/',
        method: 'post',
        data
    })
}

// 获取停车位详情
export function getParkingSpotDetail(spotId: number): Promise<ApiResponse<any>> {
    return serviceAxios({
        url: `/hzsystem_parking/parking/spots/${spotId}/`,
        method: 'get'
    })
}

// 删除停车位
export function deleteParkingSpot(spotId: number): Promise<ApiResponse<any>> {
    return serviceAxios({
        url: `/hzsystem_parking/parking/spots/${spotId}/`,
        method: 'delete'
    })
}

// 更新停车位状态
export function updateParkingSpotStatus(spotId: number, data: {
    status: 'occupied' | 'available' | 'reserved' | 'maintenance'
    vehicle_type?: string
    license_plate?: string
}): Promise<ApiResponse<any>> {
    return serviceAxios({
        url: `/hzsystem_parking/parking/spots/${spotId}/status/`,
        method: 'post',
        data
    })
}

// 自动分配停车位
export function autoAssignParkingSpot(data: {
    user_id: number
    vehicle_type: string
    license_plate: string
    preferred_area?: string
    spot_number?: string
}): Promise<AutoAssignParkingSpotResponse> {
    return serviceAxios({
        url: '/hzsystem_parking/parking/auto-assign/',
        method: 'post',
        data
    })
}

// ==================== 停车区域管理接口 ====================

// 获取停车区域列表
export function getParkingAreas(): Promise<ParkingAreasResponse> {
    return serviceAxios({
        url: '/hzsystem_parking/parking/areas/',
        method: 'get'
    })
}

// 创建停车区域
export function createParkingArea(data: {
    name: string
    description: string
    total_spots: number
}): Promise<ApiResponse<any>> {
    return serviceAxios({
        url: '/hzsystem_parking/parking/areas/',
        method: 'post',
        data
    })
}

// 获取停车区域详情
export function getParkingAreaDetail(areaId: number): Promise<ApiResponse<any>> {
    return serviceAxios({
        url: `/hzsystem_parking/parking/areas/${areaId}/`,
        method: 'get'
    })
}

// 更新停车区域
export function updateParkingArea(areaId: number, data: {
    name?: string
    description?: string
    total_spots?: number
}): Promise<ApiResponse<any>> {
    return serviceAxios({
        url: `/hzsystem_parking/parking/areas/${areaId}/`,
        method: 'put',
        data
    })
}

// 删除停车区域
export function deleteParkingArea(areaId: number): Promise<ApiResponse<any>> {
    return serviceAxios({
        url: `/hzsystem_parking/parking/areas/${areaId}/`,
        method: 'delete'
    })
}

// ==================== 检测记录管理接口 ====================

// 获取检测记录列表
export function getDetectionRecords(params?: {
    start_date?: string
    end_date?: string
    license_plate?: string
    detection_type?: string
    vehicle_type?: string
    spot_id?: number
    page?: number
    page_size?: number
}): Promise<DetectionRecordsResponse> {
    return serviceAxios({
        url: '/hzsystem_parking/detection/records/',
        method: 'get',
        params
    })
}

// 获取检测统计
export function getDetectionStats(): Promise<DetectionStats> {
    return serviceAxios({
        url: '/hzsystem_parking/detection/stats/',
        method: 'get'
    })
}

// 实时监控
export function getRealtimeDetection(): Promise<DetectionStats> {
    return serviceAxios({
        url: '/hzsystem_parking/detection/realtime/',
        method: 'get'
    })
}

// ==================== 费用管理接口 ====================

// 获取费用配置列表
export function getFeeConfigs(): Promise<FeeConfigsResponse> {
    return serviceAxios({
        url: '/hzsystem_parking/fee/configs/',
        method: 'get'
    })
}

// 创建费用配置
export function createFeeConfig(data: CreateFeeConfigRequest): Promise<FeeConfig> {
    return serviceAxios({
        url: '/hzsystem_parking/fee/configs/',
        method: 'post',
        data
    })
}

// 获取费用配置详情
export function getFeeConfigDetail(configId: number): Promise<FeeConfig> {
    return serviceAxios({
        url: `/hzsystem_parking/fee/configs/${configId}/`,
        method: 'get'
    })
}

// 更新费用配置
export function updateFeeConfig(configId: number, data: UpdateFeeConfigRequest): Promise<FeeConfig> {
    return serviceAxios({
        url: `/hzsystem_parking/fee/configs/${configId}/`,
        method: 'put',
        data
    })
}

// 删除费用配置
export function deleteFeeConfig(configId: number): Promise<ApiResponse<any>> {
    return serviceAxios({
        url: `/hzsystem_parking/fee/configs/${configId}/`,
        method: 'delete'
    })
}

// 费用计算
export function calculateFee(data: FeeCalculationRequest): Promise<FeeCalculationResponse> {
    return serviceAxios({
        url: '/hzsystem_parking/fee/calculate/',
        method: 'post',
        data
    })
}

// 获取费用模板
export function getFeeTemplates(): Promise<FeeTemplatesResponse> {
    return serviceAxios({
        url: '/hzsystem_parking/fee/templates/',
        method: 'get'
    })
}

// ==================== 支付管理接口 ====================

// 获取支付订单列表
export function getPaymentOrders(params?: {
    page?: number
    page_size?: number
    status?: string
    start_date?: string
    end_date?: string
}): Promise<PaymentOrdersResponse> {
    return serviceAxios({
        url: '/hzsystem_parking/payment/orders/',
        method: 'get',
        params
    })
}

// 处理支付
export function processPayment(data: {
    order_id: string
    payment_method: string
    amount: number
}): Promise<ApiResponse<any>> {
    return serviceAxios({
        url: '/hzsystem_parking/payment/process/',
        method: 'post',
        data
    })
}

// 支付统计
export function getPaymentStats(): Promise<PaymentStats> {
    return serviceAxios({
        url: '/hzsystem_parking/payment/stats/',
        method: 'get'
    })
}

// 退款处理
export function processRefund(data: {
    order_id: string
    reason?: string
}): Promise<ApiResponse<any>> {
    return serviceAxios({
        url: '/hzsystem_parking/payment/refund/',
        method: 'post',
        data
    })
}

// ==================== 系统日志管理接口 ====================

// 获取系统日志列表
export function getSystemLogs(params?: {
    start_date?: string
    end_date?: string
    log_level?: 'INFO' | 'WARNING' | 'ERROR'
    module?: string
    page?: number
    page_size?: number
}): Promise<SystemLogsResponse> {
    return serviceAxios({
        url: '/hzsystem_parking/system/logs/',
        method: 'get',
        params
    })
}

// 获取系统日志详情
export function getSystemLogDetail(logId: number): Promise<ApiResponse<any>> {
    return serviceAxios({
        url: `/hzsystem_parking/system/logs/${logId}/`,
        method: 'get'
    })
}

// 获取日志统计
export function getSystemLogStats(): Promise<ApiResponse<any>> {
    return serviceAxios({
        url: '/hzsystem_parking/system/logs/stats/',
        method: 'get'
    })
}

// ==================== 停车警报管理接口 ====================

// 获取停车警报列表
export function getSystemAlerts(params?: {
    alert_type?: string
    status?: 'active' | 'resolved'
    priority?: 'low' | 'medium' | 'high' | 'critical'
    start_date?: string
    end_date?: string
    page?: number
    page_size?: number
}): Promise<SystemAlertsResponse> {
    return serviceAxios({
        url: '/hzsystem_parking/system/alerts/',
        method: 'get',
        params
    })
}

// 获取警报详情
export function getSystemAlertDetail(alertId: number): Promise<ApiResponse<any>> {
    return serviceAxios({
        url: `/hzsystem_parking/system/alerts/${alertId}/`,
        method: 'get'
    })
}

// 获取系统健康状态
export function getSystemHealth(): Promise<SystemHealth> {
    return serviceAxios({
        url: '/hzsystem_parking/system/health/',
        method: 'get'
    })
}

// ==================== 用户管理接口 ====================

// 获取用户停车偏好
export function getUserParkingPreference(): Promise<UserParkingPreference> {
    return serviceAxios({
        url: '/hzadmin_api/parking-preference/',
        method: 'get'
    })
}

// 更新用户停车偏好
export function updateUserParkingPreference(data: {
    license_plate: string
    preferred_area: string
    auto_assign: boolean
}): Promise<ApiResponse<any>> {
    return serviceAxios({
        url: '/hzadmin_api/parking-preference/',
        method: 'post',
        data
    })
}

// 获取用户会员状态
export function getUserMembership(): Promise<UserMembership> {
    return serviceAxios({
        url: '/hzadmin_api/membership/',
        method: 'get'
    })
}

// 更新用户会员状态
export function updateUserMembership(data: {
    is_member: boolean
    license_plate: string
}): Promise<ApiResponse<any>> {
    return serviceAxios({
        url: '/hzadmin_api/membership/',
        method: 'post',
        data
    })
}
