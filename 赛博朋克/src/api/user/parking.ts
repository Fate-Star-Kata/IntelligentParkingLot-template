import  http  from '@/http'
import type { UserParkingPreference, ParkingAreasResponse, ParkingLayoutResponse, AutoAssignParkingSpotResponse } from '@/types/apis/hzadmin_api_T'

// 停车偏好设置相关接口

/**
 * 获取用户停车偏好设置
 */
export const getParkingPreference = (): Promise<UserParkingPreference> => {
  return http.get('/hzadmin_api/parking-preference/').then(res => res.data)
}

/**
 * 更新用户停车偏好设置
 * @param data 停车偏好数据
 */
export const updateParkingPreference = (data: {
  license_plate: string
  preferred_area: string
  auto_assign: boolean
}): Promise<UserParkingPreference> => {
  return http.post('/hzadmin_api/parking-preference/', data)
}

/**
 * 获取用户会员状态
 */
export const getMembershipStatus = () => {
  return http.get('/hzadmin_api/membership/')
}

/**
 * 更新用户会员状态
 * @param data 会员状态数据
 */
export const updateMembershipStatus = (data: {
  is_member: boolean
  license_plate: string
}) => {
  return http.post('/hzadmin_api/membership/', data)
}

// 停车位自动分配接口
/**
 * 自动分配停车位
 * @param data 分配请求数据
 */
export const autoAssignParkingSpot = (data: {
  user_id: number
  vehicle_type: string
  license_plate: string
  preferred_area?: string
  spot_number?: string
}): Promise<AutoAssignParkingSpotResponse> => {
  return http.post('/hzsystem_parking/parking/auto-assign/', data)
}

/**
 * 获取停车场布局信息
 */
export const getParkingLayout = (): Promise<ParkingLayoutResponse> => {
  return http.get('/hzsystem_parking/dashboard/layout/')
}

/**
 * 获取停车区域列表
 */
export const getParkingAreas = (): Promise<ParkingAreasResponse> => {
  return http.get('/hzsystem_parking/parking/areas/')
}
