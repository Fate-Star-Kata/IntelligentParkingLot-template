<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  getFeeConfigs,
  createFeeConfig,
  updateFeeConfig,
  deleteFeeConfig,
  getFeeTemplates,
  getParkingAreas,
  createParkingArea,
  updateParkingArea,
  deleteParkingArea,
  getParkingSpots,
  createParkingSpot,
  updateParkingSpotStatus,
  deleteParkingSpot
} from '@/api/admin/hzadmin_api'
import type {
  FeeConfig,
  CreateFeeConfigRequest,
  UpdateFeeConfigRequest,
  FeeTemplate,
  ParkingArea,
  ParkingSpot
} from '@/types/apis/hzadmin_api_T'



// 费用配置数据
const feeConfigs = ref<FeeConfig[]>([])
const feeTemplates = ref<FeeTemplate[]>([])
const loading = ref(false)
const selectedConfigId = ref<number | null>(null)

// 分页相关
const feePagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

const areaPagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

const spotPagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 停车区域管理
const parkingAreas = ref<ParkingArea[]>([])
const showCreateAreaForm = ref(false)
const editingAreaId = ref<number | null>(null)
const createAreaFormRef = ref<FormInstance>()
const editAreaFormRef = ref<FormInstance>()

// 停车位管理
const parkingSpots = ref<ParkingSpot[]>([])
const showCreateSpotForm = ref(false)
const editingSpotId = ref<number | null>(null)
const createSpotFormRef = ref<FormInstance>()
const editSpotFormRef = ref<FormInstance>()
const selectedAreaId = ref<number | null>(null)

// 当前编辑的费用配置
const currentConfig = reactive<Partial<FeeConfig>>({
  name: '',
  base_fee: 0,
  base_hours: 1,
  hourly_rate: 0,
  daily_max_fee: 0,
  free_minutes: 0,
  is_active: true
})

// 新建费用配置表单
const newConfigForm = reactive<CreateFeeConfigRequest>({
  name: '',
  base_fee: 0,
  base_hours: 1,
  hourly_rate: 0,
  daily_max_fee: 0,
  free_minutes: 0
})

// 新建停车区域表单
const newAreaForm = reactive({
  name: '',
  description: '',
  total_spots: 10
})

// 当前编辑的停车区域
const currentArea = reactive<Partial<ParkingArea>>({
  id: undefined,
  name: '',
  description: '',
  total_spots: 10,
  is_active: true
})

// 新建停车位表单
const newSpotForm = reactive({
  spot_number: '',
  area_id: null as number | null,
  spot_type: 'standard'
})

// 当前编辑的停车位
const currentSpot = reactive<Partial<ParkingSpot>>({
  id: undefined,
  spot_number: '',
  area: undefined,
  status: 'available' as 'available' | 'occupied' | 'maintenance',
  is_active: true
})

// 显示状态
const showCreateForm = ref(false)
const editingConfigId = ref<number | null>(null)

// 表单验证规则
const formRules: FormRules = {
  name: [
    { required: true, message: '请输入配置名称', trigger: 'blur' },
    { min: 2, max: 50, message: '配置名称长度应在2-50字符之间', trigger: 'blur' }
  ],
  base_fee: [
    { required: true, message: '请输入基础费用', trigger: 'blur' },
    { type: 'number', min: 0, max: 1000, message: '基础费用应在0-1000元之间', trigger: 'blur' }
  ],
  base_hours: [
    { required: true, message: '请输入基础时长', trigger: 'blur' },
    { type: 'number', min: 0.5, max: 24, message: '基础时长应在0.5-24小时之间', trigger: 'blur' }
  ],
  hourly_rate: [
    { required: true, message: '请输入小时费率', trigger: 'blur' },
    { type: 'number', min: 0, max: 100, message: '小时费率应在0-100元之间', trigger: 'blur' }
  ],
  daily_max_fee: [
    { required: true, message: '请输入每日最高费用', trigger: 'blur' },
    { type: 'number', min: 0, max: 1000, message: '每日最高费用应在0-1000元之间', trigger: 'blur' }
  ],
  free_minutes: [
    { required: true, message: '请输入免费时长', trigger: 'blur' },
    { type: 'number', min: 0, max: 120, message: '免费时长应在0-120分钟之间', trigger: 'blur' }
  ]
}

// 停车区域表单验证规则
const areaFormRules: FormRules = {
  name: [{ required: true, message: '请输入区域名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入区域描述', trigger: 'blur' }],
  total_spots: [{ required: true, message: '请输入总车位数', trigger: 'blur' }]
}

// 停车位表单验证规则
const spotFormRules: FormRules = {
  spot_number: [{ required: true, message: '请输入车位编号', trigger: 'blur' }],
  area_id: [{ required: true, message: '请选择所属区域', trigger: 'change' }],
  spot_type: [{ required: true, message: '请选择车位类型', trigger: 'change' }]
}

// 表单引用
const formRef = ref()
const createFormRef = ref()

// 加载费用配置列表
const loadFeeConfigs = async (page = 1) => {
  try {
    loading.value = true
    const response = await getFeeConfigs()
    feeConfigs.value = response.fee_configs || []
    feePagination.total = response.total_count || 0
    feePagination.currentPage = page
  } catch (error) {
    console.error('加载费用配置失败:', error)
    ElMessage.error('加载费用配置失败')
  } finally {
    loading.value = false
  }
}

// 费用配置分页处理
const handleFeePageChange = (page: number) => {
  loadFeeConfigs(page)
}

const handleFeeSizeChange = (size: number) => {
  feePagination.pageSize = size
  loadFeeConfigs(1)
}

// 计算属性：分页后的费用配置
const paginatedFeeConfigs = computed(() => {
  return feeConfigs.value
})

// 加载费用模板
const loadFeeTemplates = async () => {
  try {
    const response = await getFeeTemplates()
    feeTemplates.value = response.templates || []
  } catch (error) {
    console.error('加载费用模板失败:', error)
    ElMessage.error('加载费用模板失败')
  }
}

// ==================== 停车区域管理方法 ====================

// 加载停车区域列表
const loadParkingAreas = async (page = 1) => {
  try {
    loading.value = true
    const response = await getParkingAreas()
    console.log('停车区域API响应:', response)
    if (response) {
      parkingAreas.value = response.areas || []
      console.log('停车区域数据:', parkingAreas.value)
      areaPagination.total = response.total_areas || 0
      areaPagination.currentPage = page
    }
  } catch (error) {
    console.error('加载停车区域失败:', error)
    ElMessage.error('加载停车区域失败')
  } finally {
    loading.value = false
  }
}

// 停车区域分页处理
const handleAreaPageChange = (page: number) => {
  loadParkingAreas(page)
}

const handleAreaSizeChange = (size: number) => {
  areaPagination.pageSize = size
  loadParkingAreas(1)
}

// 计算属性：分页后的停车区域
const paginatedParkingAreas = computed(() => {
  return parkingAreas.value
})

// 创建停车区域
const createArea = async () => {
  if (!createAreaFormRef.value) return

  try {
    await createAreaFormRef.value.validate()
    loading.value = true

    await createParkingArea({
      name: newAreaForm.name,
      description: newAreaForm.description,
      total_spots: newAreaForm.total_spots
    })

    ElMessage.success('停车区域创建成功')
    showCreateAreaForm.value = false
    resetCreateAreaForm()
    await loadParkingAreas()
  } catch (error) {
    console.error('创建停车区域失败:', error)
    ElMessage.error('创建停车区域失败')
  } finally {
    loading.value = false
  }
}

// 编辑停车区域
const editArea = (area: ParkingArea) => {
  editingAreaId.value = area.id
  Object.assign(currentArea, area)
}

// 更新停车区域
const updateArea = async (areaId: number) => {
  // 简单验证
  if (!currentArea.name || !currentArea.description || !currentArea.total_spots) {
    ElMessage.error('请填写完整的区域信息')
    return
  }

  try {
    loading.value = true

    await updateParkingArea(areaId, {
      name: currentArea.name,
      description: currentArea.description,
      total_spots: currentArea.total_spots
    })

    ElMessage.success('停车区域更新成功')
    cancelEditArea()
    await loadParkingAreas()
  } catch (error) {
    console.error('更新停车区域失败:', error)
    ElMessage.error('更新停车区域失败')
  } finally {
    loading.value = false
  }
}

// 删除停车区域
const deleteArea = async (areaId: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这个停车区域吗？', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    loading.value = true
    await deleteParkingArea(areaId)

    ElMessage.success('停车区域删除成功')
    await loadParkingAreas()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除停车区域失败:', error)
      ElMessage.error('删除停车区域失败')
    }
  } finally {
    loading.value = false
  }
}

// 取消编辑停车区域
const cancelEditArea = () => {
  editingAreaId.value = null
  Object.assign(currentArea, {
    id: undefined,
    name: '',
    description: '',
    total_spots: 10,
    is_active: true
  })
}

// 重置创建停车区域表单
const resetCreateAreaForm = () => {
  Object.assign(newAreaForm, {
    name: '',
    description: '',
    total_spots: 10
  })
  createAreaFormRef.value?.resetFields()
}

// ==================== 停车位管理方法 ====================

// 加载停车位列表
const loadParkingSpots = async (areaId?: number) => {
  try {
    loading.value = true
    const params = {
      ...(areaId ? { area_id: areaId } : {})
    }
    const response = await getParkingSpots(params)
    if (response) {
      parkingSpots.value = response.spots || []
      spotPagination.total = response.spots?.length || 0
      spotPagination.currentPage = 1
    }
  } catch (error) {
    console.error('加载停车位失败:', error)
    ElMessage.error('加载停车位失败')
  } finally {
    loading.value = false
  }
}

// 停车位分页处理
const handleSpotPageChange = (page: number) => {
  spotPagination.currentPage = page
}

const handleSpotSizeChange = (size: number) => {
  spotPagination.pageSize = size
  spotPagination.currentPage = 1
}

// 计算属性：分页后的停车位
const paginatedParkingSpots = computed(() => {
  const start = (spotPagination.currentPage - 1) * spotPagination.pageSize
  const end = start + spotPagination.pageSize
  return parkingSpots.value.slice(start, end)
})

// 创建停车位
const createSpot = async () => {
  if (!createSpotFormRef.value) return

  try {
    await createSpotFormRef.value.validate()
    loading.value = true

    await createParkingSpot({
      spot_number: newSpotForm.spot_number,
      area: newSpotForm.area_id!,
      spot_type: newSpotForm.spot_type
    })

    ElMessage.success('停车位创建成功')
    showCreateSpotForm.value = false
    resetCreateSpotForm()
    await loadParkingSpots(selectedAreaId.value || undefined)
  } catch (error) {
    console.error('创建停车位失败:', error)
    ElMessage.error('创建停车位失败')
  } finally {
    loading.value = false
  }
}

// 编辑停车位
const editSpot = (spot: ParkingSpot) => {
  editingSpotId.value = spot.id
  Object.assign(currentSpot, {
    id: spot.id,
    spot_number: spot.spot_number,
    area: spot.area,
    status: spot.status,
    is_active: spot.is_active
  })
}

// 更新停车位状态
const updateSpotStatus = async (spotId: number) => {
  // 简单验证
  if (!currentSpot.status) {
    ElMessage.error('请选择停车位状态')
    return
  }

  try {
    loading.value = true

    await updateParkingSpotStatus(spotId, {
      status: currentSpot.status as 'occupied' | 'available' | 'reserved' | 'maintenance'
    })

    ElMessage.success('停车位状态更新成功')
    cancelEditSpot()
    await loadParkingSpots(selectedAreaId.value || undefined)
  } catch (error) {
    console.error('更新停车位状态失败:', error)
    ElMessage.error('更新停车位状态失败')
  } finally {
    loading.value = false
  }
}

// 删除停车位
const deleteSpot = async (spotId: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这个停车位吗？', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    loading.value = true
    await deleteParkingSpot(spotId)

    ElMessage.success('停车位删除成功')
    await loadParkingSpots(selectedAreaId.value || undefined)
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除停车位失败:', error)
      ElMessage.error('删除停车位失败')
    }
  } finally {
    loading.value = false
  }
}

// 取消编辑停车位
const cancelEditSpot = () => {
  editingSpotId.value = null
  Object.assign(currentSpot, {
    id: undefined,
    spot_number: '',
    area: null,
    status: 'available',
    is_active: true
  })
}

// 重置创建停车位表单
const resetCreateSpotForm = () => {
  Object.assign(newSpotForm, {
    spot_number: '',
    area_id: null,
    spot_type: 'standard'
  })
  createSpotFormRef.value?.resetFields()
}

// 根据区域筛选停车位
const filterSpotsByArea = (areaId: number | null) => {
  selectedAreaId.value = areaId
  spotPagination.currentPage = 1
  loadParkingSpots(areaId || undefined)
}

// 创建费用配置
const createConfig = async () => {
  try {
    await createFormRef.value?.validate()
    loading.value = true
    await createFeeConfig(newConfigForm)
    ElMessage.success('费用配置创建成功！')
    showCreateForm.value = false
    resetCreateForm()
    await loadFeeConfigs()
  } catch (error) {
    console.error('创建费用配置失败:', error)
    ElMessage.error('创建费用配置失败')
  } finally {
    loading.value = false
  }
}

// 更新费用配置
const updateConfig = async (configId: number) => {
  try {
    await formRef.value?.validate()
    loading.value = true
    const updateData: UpdateFeeConfigRequest = {
      name: currentConfig.name,
      base_fee: currentConfig.base_fee,
      base_hours: currentConfig.base_hours,
      hourly_rate: currentConfig.hourly_rate,
      daily_max_fee: currentConfig.daily_max_fee,
      free_minutes: currentConfig.free_minutes,
      is_active: currentConfig.is_active
    }
    await updateFeeConfig(configId, updateData)
    ElMessage.success('费用配置更新成功！')
    editingConfigId.value = null
    await loadFeeConfigs()
  } catch (error) {
    console.error('更新费用配置失败:', error)
    ElMessage.error('更新费用配置失败')
  } finally {
    loading.value = false
  }
}

// 删除费用配置
const deleteConfig = async (configId: number, configName: string) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除费用配置 "${configName}" 吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    loading.value = true
    await deleteFeeConfig(configId)
    ElMessage.success('费用配置删除成功！')
    await loadFeeConfigs()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除费用配置失败:', error)
      ElMessage.error('删除费用配置失败')
    }
  } finally {
    loading.value = false
  }
}

// 编辑费用配置
const editConfig = (config: FeeConfig) => {
  editingConfigId.value = config.id
  Object.assign(currentConfig, {
    ...config,
    base_fee: config.base_fee ?? 0,
    base_hours: config.base_hours ?? 1,
    hourly_rate: config.hourly_rate ?? 0,
    daily_max_fee: config.daily_max_fee ?? 0,
    free_minutes: config.free_minutes ?? 0,
    is_active: config.is_active ?? true
  })
}

// 取消编辑
const cancelEdit = () => {
  editingConfigId.value = null
  Object.assign(currentConfig, {
    name: '',
    base_fee: 0,
    base_hours: 1,
    hourly_rate: 0,
    daily_max_fee: 0,
    free_minutes: 0,
    is_active: true
  })
}

// 重置创建表单
const resetCreateForm = () => {
  Object.assign(newConfigForm, {
    name: '',
    base_fee: 0,
    base_hours: 1,
    hourly_rate: 0,
    daily_max_fee: 0,
    free_minutes: 0
  })
  createFormRef.value?.resetFields()
}

// 应用费用模板
const applyTemplate = (template: FeeTemplate) => {
  if (editingConfigId.value) {
    // 编辑模式下应用模板
    Object.assign(currentConfig, {
      name: template.name || '',
      base_fee: template.base_fee ?? 0,
      base_hours: template.base_hours ?? 1,
      hourly_rate: template.hourly_rate ?? 0,
      daily_max_fee: template.daily_max_fee ?? 0,
      free_minutes: template.free_minutes ?? 0
    })
  } else {
    // 创建模式下应用模板
    Object.assign(newConfigForm, {
      name: template.name || '',
      base_fee: template.base_fee ?? 0,
      base_hours: template.base_hours ?? 1,
      hourly_rate: template.hourly_rate ?? 0,
      daily_max_fee: template.daily_max_fee ?? 0,
      free_minutes: template.free_minutes ?? 0
    })
  }
  ElMessage.success(`已应用模板：${template.name}`)
}

// 组件挂载时加载数据
onMounted(() => {
  loadFeeConfigs()
  loadFeeTemplates()
  loadParkingAreas()
  loadParkingSpots()
})

// 格式化时间显示
const formatDateTime = (dateTime: string) => {
  if (!dateTime) return '-'
  return new Date(dateTime).toLocaleString('zh-CN')
}

// 格式化费用显示
const formatCurrency = (amount: number | undefined | null) => {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return '¥0.00'
  }
  return `¥${Number(amount).toFixed(2)}`
}
</script>

<template>
  <div class="settings-page">
    <el-form ref="formRef" :model="currentConfig" :rules="formRules" label-width="120px">
      <!-- 费用配置管理 -->
      <el-card>
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <span class="text-lg font-medium">费用配置管理</span>
              <p class="text-sm text-gray-500 mt-1">管理停车场的费用配置模板</p>
            </div>
            <div>
              <el-button type="primary" @click="showCreateForm = true" :loading="loading">
                新建配置
              </el-button>
              <el-button @click="loadFeeConfigs" :loading="loading">
                刷新
              </el-button>
            </div>
          </div>
        </template>

        <!-- 费用模板快速应用 -->
        <div v-if="feeTemplates.length > 0" class="mb-6">
          <h4 class="text-sm font-medium text-gray-700 mb-3">快速应用模板</h4>
          <div class="flex flex-wrap gap-2">
            <el-button v-for="template in feeTemplates" :key="template.id" size="small"
              @click="applyTemplate(template)">
              {{ template.name }}
            </el-button>
          </div>
        </div>

        <!-- 配置列表 -->
        <div v-loading="loading" class="w-full">
          <el-table :data="paginatedFeeConfigs" stripe class="modern-table" style="width: 100%">
            <el-table-column prop="name" label="配置名称" width="150" />
            <el-table-column prop="base_fee" label="基础费用" width="120">
              <template #default="{ row }">
                {{ formatCurrency(row.base_fee) }}
              </template>
            </el-table-column>
            <el-table-column prop="base_hours" label="基础时长" width="120">
              <template #default="{ row }">
                {{ row.base_hours }}小时
              </template>
            </el-table-column>
            <el-table-column prop="hourly_rate" label="超时费率" width="120">
              <template #default="{ row }">
                {{ formatCurrency(row.hourly_rate) }}/小时
              </template>
            </el-table-column>
            <el-table-column prop="daily_max_fee" label="日最高费用" width="120">
              <template #default="{ row }">
                {{ formatCurrency(row.daily_max_fee) }}
              </template>
            </el-table-column>
            <el-table-column prop="free_minutes" label="免费时长" width="200">
              <template #default="{ row }">
                {{ row.free_minutes }}分钟
              </template>
            </el-table-column>
            <el-table-column prop="is_active" label="状态" width="180">
              <template #default="{ row }">
                <el-tag :type="row.is_active ? 'success' : 'info'">
                  {{ row.is_active ? '启用' : '禁用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="created_at" label="创建时间" width="150">
              <template #default="{ row }">
                {{ formatDateTime(row.created_at) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button size="small" @click="editConfig(row)" :disabled="editingConfigId === row.id">
                  编辑
                </el-button>
                <el-button size="small" type="danger" @click="deleteConfig(row.id, row.name)" :loading="loading">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <div class="pagination-container">
            <el-pagination v-model:current-page="feePagination.currentPage" v-model:page-size="feePagination.pageSize"
              :page-sizes="[10, 20, 50, 100]" :total="feePagination.total"
              layout="total, sizes, prev, pager, next, jumper" @size-change="handleFeeSizeChange"
              @current-change="handleFeePageChange" />
          </div>
        </div>

        <!-- 编辑表单 -->
        <div v-if="editingConfigId" class="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 class="text-lg font-medium mb-4">编辑费用配置</h4>
          <el-form ref="formRef" :model="currentConfig" :rules="formRules" label-width="120px">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <el-form-item label="配置名称" prop="name">
                <el-input v-model="currentConfig.name" placeholder="请输入配置名称" />
              </el-form-item>
              <el-form-item label="基础费用" prop="base_fee">
                <div class="flex items-center space-x-2">
                  <el-input-number v-model="currentConfig.base_fee" :min="0" :max="1000" :step="0.1" class="flex-1" />
                  <span class="text-gray-500">元</span>
                </div>
              </el-form-item>
              <el-form-item label="基础时长" prop="base_hours">
                <div class="flex items-center space-x-2">
                  <el-input-number v-model="currentConfig.base_hours" :min="0.5" :max="24" :step="0.5" class="flex-1" />
                  <span class="text-gray-500">小时</span>
                </div>
              </el-form-item>
              <el-form-item label="小时费率" prop="hourly_rate">
                <div class="flex items-center space-x-2">
                  <el-input-number v-model="currentConfig.hourly_rate" :min="0" :max="100" :step="0.1" class="flex-1" />
                  <span class="text-gray-500">元/小时</span>
                </div>
              </el-form-item>
              <el-form-item label="每日最高费用" prop="daily_max_fee">
                <div class="flex items-center space-x-2">
                  <el-input-number v-model="currentConfig.daily_max_fee" :min="0" :max="1000" :step="1"
                    class="flex-1" />
                  <span class="text-gray-500">元</span>
                </div>
              </el-form-item>
              <el-form-item label="免费时长" prop="free_minutes">
                <div class="flex items-center space-x-2">
                  <el-input-number v-model="currentConfig.free_minutes" :min="0" :max="120" :step="5" class="flex-1" />
                  <span class="text-gray-500">分钟</span>
                </div>
              </el-form-item>
            </div>
            <el-form-item label="启用状态">
              <el-switch v-model="currentConfig.is_active" active-text="启用" inactive-text="禁用" />
            </el-form-item>
            <div class="flex justify-end space-x-2">
              <el-button @click="cancelEdit">取消</el-button>
              <el-button type="primary" @click="updateConfig(editingConfigId)" :loading="loading">
                保存
              </el-button>
            </div>
          </el-form>
        </div>
      </el-card>

      <!-- 创建费用配置对话框 -->
      <el-dialog v-model="showCreateForm" title="新建费用配置" width="600px">
        <el-form ref="createFormRef" :model="newConfigForm" :rules="formRules" label-width="120px">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <el-form-item label="配置名称" prop="name">
              <el-input v-model="newConfigForm.name" placeholder="请输入配置名称" />
            </el-form-item>
            <el-form-item label="基础费用" prop="base_fee">
              <div class="flex items-center space-x-2">
                <el-input-number v-model="newConfigForm.base_fee" :min="0" :max="1000" :step="0.1" class="flex-1" />
                <span class="text-gray-500">元</span>
              </div>
            </el-form-item>
            <el-form-item label="基础时长" prop="base_hours">
              <div class="flex items-center space-x-2">
                <el-input-number v-model="newConfigForm.base_hours" :min="0.5" :max="24" :step="0.5" class="flex-1" />
                <span class="text-gray-500">小时</span>
              </div>
            </el-form-item>
            <el-form-item label="小时费率" prop="hourly_rate">
              <div class="flex items-center space-x-2">
                <el-input-number v-model="newConfigForm.hourly_rate" :min="0" :max="100" :step="0.1" class="flex-1" />
                <span class="text-gray-500">元/小时</span>
              </div>
            </el-form-item>
            <el-form-item label="每日最高费用" prop="daily_max_fee">
              <div class="flex items-center space-x-2">
                <el-input-number v-model="newConfigForm.daily_max_fee" :min="0" :max="1000" :step="1" class="flex-1" />
                <span class="text-gray-500">元</span>
              </div>
            </el-form-item>
            <el-form-item label="免费时长" prop="free_minutes">
              <div class="flex items-center space-x-2">
                <el-input-number v-model="newConfigForm.free_minutes" :min="0" :max="120" :step="5" class="flex-1" />
                <span class="text-gray-500">分钟</span>
              </div>
            </el-form-item>
          </div>
        </el-form>
        <template #footer>
          <div class="flex justify-end space-x-2">
            <el-button @click="showCreateForm = false; resetCreateForm()">取消</el-button>
            <el-button type="primary" @click="createConfig" :loading="loading">
              创建
            </el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 停车区域管理 -->
      <el-card class="mb-6">
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">停车区域管理</h3>
            <div class="space-x-2">
              <el-button type="primary" @click="showCreateAreaForm = true">
                <i class="fas fa-plus mr-2"></i>新建区域
              </el-button>
              <el-button @click="loadParkingAreas" :loading="loading">
                <i class="fas fa-sync-alt mr-2"></i>刷新
              </el-button>
            </div>
          </div>
        </template>

        <!-- 停车区域列表 -->
        <el-table :data="paginatedParkingAreas" v-loading="loading" stripe class="modern-table" style="width: 100%">
          <el-table-column prop="name" label="区域名称" width="150">
            <template #default="{ row }">
              <el-input v-if="editingAreaId === row.id" v-model="currentArea.name" size="small" />
              <span v-else>{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述">
            <template #default="{ row }">
              <el-input v-if="editingAreaId === row.id" v-model="currentArea.description" type="textarea" :rows="2"
                size="small" />
              <span v-else>{{ row.description }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="total_spots" label="总车位数" width="120" align="center">
            <template #default="{ row }">
              <el-input-number v-if="editingAreaId === row.id" v-model="currentArea.total_spots" :min="1" :max="1000"
                size="small" />
              <span v-else>{{ row.total_spots }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="available_spots" label="可用车位" width="100" align="center" />
          <el-table-column prop="occupied_spots" label="已占用" width="100" align="center" />
          <el-table-column prop="occupancy_rate" label="占用率" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.occupancy_rate > 80 ? 'danger' : row.occupancy_rate > 60 ? 'warning' : 'success'">
                {{ row.occupancy_rate.toFixed(1) }}%
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="is_active" label="状态" width="80" align="center">
            <template #default="{ row }">
              <el-tag :type="row.is_active ? 'success' : 'danger'">
                {{ row.is_active ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="created_time" label="创建时间" width="180">
            <template #default="{ row }">
              {{ formatDateTime(row.created_time) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template #default="{ row }">
              <div v-if="editingAreaId === row.id" class="space-x-1">
                <el-button type="primary" size="small" @click="updateArea(row.id)" :loading="loading">
                  保存
                </el-button>
                <el-button size="small" @click="cancelEditArea">
                  取消
                </el-button>
              </div>
              <div v-else class="space-x-1">
                <el-button type="primary" size="small" @click="editArea(row)">
                  编辑
                </el-button>
                <el-button type="danger" size="small" @click="deleteArea(row.id)">
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination v-model:current-page="areaPagination.currentPage" v-model:page-size="areaPagination.pageSize"
            :page-sizes="[10, 20, 50, 100]" :total="areaPagination.total"
            layout="total, sizes, prev, pager, next, jumper" @size-change="handleAreaSizeChange"
            @current-change="handleAreaPageChange" />
        </div>


      </el-card>

      <!-- 创建停车区域对话框 -->
      <el-dialog v-model="showCreateAreaForm" title="新建停车区域" width="600px">
        <el-form ref="createAreaFormRef" :model="newAreaForm" :rules="areaFormRules" label-width="120px">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <el-form-item label="区域名称" prop="name">
              <el-input v-model="newAreaForm.name" placeholder="请输入区域名称" />
            </el-form-item>
            <el-form-item label="总车位数" prop="total_spots">
              <el-input-number v-model="newAreaForm.total_spots" :min="1" :max="1000" class="w-full" />
            </el-form-item>
          </div>
          <el-form-item label="区域描述" prop="description">
            <el-input v-model="newAreaForm.description" type="textarea" :rows="3" placeholder="请输入区域描述" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="flex justify-end space-x-2">
            <el-button @click="showCreateAreaForm = false; resetCreateAreaForm()">取消</el-button>
            <el-button type="primary" @click="createArea" :loading="loading">
              创建
            </el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 停车位管理 -->
      <el-card class="mb-6">
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">停车位管理</h3>
            <div class="flex items-center gap-3">
              <el-select v-model="selectedAreaId" placeholder="选择区域"
                @change="filterSpotsByArea(selectedAreaId)" class="w-44">
                <el-option label="全部区域" :value="null" />
                <el-option v-for="area in parkingAreas" :key="area.id" :label="area.name" :value="area.id" />
              </el-select>
              <!-- 调试信息:  -->
              <span style="color: #fff; ">selectedAreaId={{ selectedAreaId }}, parkingAreas.length={{ parkingAreas.length }}</span>
              <el-button type="primary" @click="showCreateSpotForm = true">
                <i class="fas fa-plus mr-2"></i>新建车位
              </el-button>
              <el-button @click="loadParkingSpots(selectedAreaId || undefined)" :loading="loading">
                <i class="fas fa-sync-alt mr-2"></i>刷新
              </el-button>
            </div>
          </div>
        </template>

        <!-- 停车位列表 -->
        <el-table :data="paginatedParkingSpots" v-loading="loading" stripe style="width: 100%">
          <el-table-column prop="spot_number" label="车位编号" />
          <el-table-column prop="area_name" label="所属区域" />
          <el-table-column prop="status" label="状态" align="center" width="120">
            <template #default="{ row }">
              <el-select v-if="editingSpotId === row.id" v-model="currentSpot.status" size="small" style="width: 100px">
                <el-option label="🟢 可用" value="available" />
                <el-option label="🔴 占用" value="occupied" />
                <el-option label="🟡 维护" value="maintenance" />
              </el-select>
              <el-tag v-else
                :type="row.status === 'available' ? 'success' : row.status === 'occupied' ? 'danger' : 'warning'">
                {{ row.status === 'available' ? '可用' : row.status === 'occupied' ? '占用' : '维护' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="is_active" label="启用状态" align="center">
            <template #default="{ row }">
              <el-tag :type="row.is_active ? 'success' : 'danger'">
                {{ row.is_active ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="created_time" label="创建时间">
            <template #default="{ row }">
              {{ formatDateTime(row.created_time) }}
            </template>
          </el-table-column>
          <el-table-column prop="updated_time" label="更新时间">
            <template #default="{ row }">
              {{ formatDateTime(row.updated_time) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="180">
            <template #default="{ row }">
              <div v-if="editingSpotId === row.id" class="space-x-1">
                <el-button type="primary" size="small" @click="updateSpotStatus(row.id)" :loading="loading">
                  保存
                </el-button>
                <el-button size="small" @click="cancelEditSpot">
                  取消
                </el-button>
              </div>
              <div v-else class="space-x-1">
                <el-button type="primary" size="small" @click="editSpot(row)">
                  编辑状态
                </el-button>
                <el-button type="danger" size="small" @click="deleteSpot(row.id)">
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination v-model:current-page="spotPagination.currentPage" v-model:page-size="spotPagination.pageSize"
            :page-sizes="[10, 20, 50, 100]" :total="spotPagination.total"
            layout="total, sizes, prev, pager, next, jumper" @size-change="handleSpotSizeChange"
            @current-change="handleSpotPageChange" />
        </div>


      </el-card>

      <!-- 创建停车位对话框 -->
      <el-dialog v-model="showCreateSpotForm" title="新建停车位" width="600px">
        <el-form ref="createSpotFormRef" :model="newSpotForm" :rules="spotFormRules" label-width="120px">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <el-form-item label="车位编号" prop="spot_number">
              <el-input v-model="newSpotForm.spot_number" placeholder="请输入车位编号" />
            </el-form-item>
            <el-form-item label="所属区域" prop="area_id">
              <el-select v-model="newSpotForm.area_id" placeholder="请选择区域">
                <el-option v-for="area in parkingAreas" :key="area.id" :label="area.name" :value="area.id" />
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="车位类型" prop="spot_type">
            <el-select v-model="newSpotForm.spot_type" placeholder="请选择车位类型">
              <el-option label="标准车位" value="standard" />
              <el-option label="大型车位" value="large" />
              <el-option label="紧凑车位" value="compact" />
              <el-option label="无障碍车位" value="accessible" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="flex justify-end space-x-2">
            <el-button @click="showCreateSpotForm = false; resetCreateSpotForm()">取消</el-button>
            <el-button type="primary" @click="createSpot" :loading="loading">
              创建
            </el-button>
          </div>
        </template>
      </el-dialog>

    </el-form>
  </div>
</template>

<style scoped>
.settings-page {
  width: 100%;
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
  color: #333;
}

.el-card {
  margin-bottom: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  background: white;
}

.modern-table {
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.modern-table .el-table__header {
  background: #409eff;
}

.modern-table .el-table__header th {
  background: transparent;
  color: white;
  font-weight: 600;
  border-bottom: none;
  padding: 12px;
}

.modern-table .el-table__row:hover {
  background: #f5f7fa;
}

.modern-table .el-table__cell {
  padding: 12px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding: 15px;
  background: white;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

/* 编辑表单样式 */
.edit-form-container {
  margin-top: 20px;
  background: white;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.edit-form-header {
  background: #409eff;
  padding: 15px 20px;
  color: white;
}

.edit-form-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.modern-form {
  padding: 20px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #e0e0e0;
}

.cancel-btn {
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  color: #666;
}

.cancel-btn:hover {
  background: #e8e8e8;
  border-color: #bbb;
}

.save-btn {
  background: #409eff;
  border: none;
  color: white;
}

.save-btn:hover {
  background: #337ecc;
}

.disabled-input {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
}

.status-select {
  width: 100%;
}

/* 按钮美化 */
.el-button {
  border-radius: 4px;
  font-weight: 500;
}

.el-button--primary {
  background: #409eff;
  border: none;
}

.el-button--primary:hover {
  background: #337ecc;
}

/* 标签美化 */
.el-tag {
  border-radius: 4px;
  font-weight: 500;
  padding: 4px 8px;
}

.el-tag--success {
  background: #67c23a;
  border: none;
  color: white;
}

.el-tag--danger {
  background: #f56c6c;
  border: none;
  color: white;
}

.el-tag--warning {
  background: #e6a23c;
  border: none;
  color: white;
}

/* 表单项美化 */
.el-form-item {
  margin-bottom: 20px;
}

.el-form-item__label {
  font-weight: 500;
  color: #333;
}

.el-input {
  border-radius: 4px;
}

.el-input-number {
  width: 100%;
  max-width: 200px;
  border-radius: 4px;
}

.el-select {
  border-radius: 4px;
}

.flex-1 .el-input-number {
  max-width: 160px;
}

/* 卡片头部美化 */
.el-card__header {
  background: #409eff;
  color: #333;
  border-radius: 4px 4px 0 0;
  padding: 15px 20px;
}

.el-card__header h3 {
  color: #333;
  margin: 0;
  font-weight: 600;
}

/* 对话框美化 */
.el-dialog {
  border-radius: 4px;
}

.el-dialog__header {
  background: #409eff;
  color: #333;
  padding: 15px 20px;
}

.el-dialog__title {
  color: #333;
  font-weight: 600;
}

.el-dialog__body {
  padding: 20px;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .settings-page {
    padding: 16px;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .el-card {
    margin-bottom: 16px;
  }

  .pagination-container {
    padding: 16px;
  }

  .edit-form-container {
    margin-top: 16px;
  }

  .modern-form {
    padding: 16px;
  }
}
</style>
