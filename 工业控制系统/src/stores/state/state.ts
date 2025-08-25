import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义停车场位置类型
export interface ParkingLocation {
  id: number
  code: string
  name: string
  shortCode: string
}

// 定义状态store
export const useStateStore = defineStore('state', () => {
  // 停车场位置列表
  const parkingLocations = ref<ParkingLocation[]>([
    { id: 1, code: 'A', name: '停车场入口', shortCode: '入口' },
    { id: 2, code: 'B', name: '停车场出口', shortCode: '出口' },
  ])
  
  // 当前选中的停车场位置
  const currentLocation = ref<string>('入口')
  
  // 获取当前位置信息
  const getCurrentLocationInfo = () => {
    return parkingLocations.value.find(location => location.shortCode === currentLocation.value)
  }
  
  // 切换停车场位置
  const setCurrentLocation = (locationCode: string) => {
    const location = parkingLocations.value.find(loc => loc.shortCode === locationCode)
    if (location) {
      currentLocation.value = locationCode
      console.log('切换到停车场位置:', locationCode)
    }
  }
  
  // 重置为默认位置
  const resetLocation = () => {
    currentLocation.value = '入口'
  }
  
  return {
    // 状态
    currentLocation,
    parkingLocations,
    
    // 方法
    getCurrentLocationInfo,
    setCurrentLocation,
    resetLocation
  }
})