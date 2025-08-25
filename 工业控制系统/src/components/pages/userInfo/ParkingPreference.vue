<template>
  <div class="parking-preference">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" @submit.prevent="handleSubmit">
      <!-- 车牌号码 -->
      <el-form-item label="车牌号码" prop="license_plate">
        <el-input
          v-model="formData.license_plate"
          placeholder="请输入车牌号码，如：京A12345"
          maxlength="8"
          show-word-limit
        />
      </el-form-item>

      <!-- 偏好停车区域 -->
      <el-form-item label="偏好停车区域" prop="preferred_area">
        <el-select
          v-model="formData.preferred_area"
          placeholder="请选择偏好停车区域"
          style="width: 100%"
        >
          <el-option
            v-for="area in availableAreas"
            :key="area.id"
            :label="area.name"
            :value="area.name"
          >
            <span>{{ area.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ area.description }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <!-- 自动分配车位 -->
      <el-form-item label="自动分配车位">
        <el-switch
          v-model="formData.auto_assign"
          active-text="开启"
          inactive-text="关闭"
        />
        <div class="form-tip">
          开启后，系统将根据您的偏好区域自动分配车位
        </div>
      </el-form-item>

      <!-- 会员状态显示 -->
      <el-form-item label="会员状态">
        <el-tag :type="membershipInfo.is_member ? 'success' : 'info'" size="large">
          {{ membershipInfo.is_member ? '已绑定会员' : '未绑定会员' }}
        </el-tag>
        <div v-if="membershipInfo.is_member && membershipInfo.member_since" class="form-tip">
          会员时间：{{ formatDate(membershipInfo.member_since) }}
        </div>
      </el-form-item>

      <!-- 提交按钮 -->
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="handleSubmit">
          {{ loading ? '保存中...' : '保存设置' }}
        </el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
// 从相对路径导入API函数
import { getParkingPreference, updateParkingPreference, getParkingAreas } from '../../../api/user/parking'

// 定义组件名称
defineOptions({
  name: 'ParkingPreference'
})

// 响应式数据
const loading = ref(false)
const formRef = ref<FormInstance>()

// 表单数据
const formData = ref({
  license_plate: '',
  preferred_area: '',
  auto_assign: false
})

// 会员信息
const membershipInfo = ref({
  is_member: false,
  member_since: ''
})

// 可用停车区域
const availableAreas = ref<Array<{id: number, name: string, description: string}>>([])

// 表单验证规则
const rules = reactive<FormRules>({
  license_plate: [
    { required: true, message: '请输入车牌号码', trigger: 'blur' },
    {
      pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-Z0-9]{4,5}[A-Z0-9挂学警港澳]$/,
      message: '请输入正确的车牌号码格式',
      trigger: ['blur', 'change']
    }
  ],
  preferred_area: [
    { required: true, message: '请选择偏好停车区域', trigger: 'change' }
  ]
})

// 获取停车偏好设置
const fetchParkingPreference = async () => {
  try {
    const response = await getParkingPreference()
    console.log("asdasdasdasd",response)
    if (response) {
      formData.value = {
        license_plate: response.license_plate || '',
        preferred_area: response.preferred_area || '',
        auto_assign: response.auto_assign || false
      }

      membershipInfo.value = {
        is_member: response.is_member || false,
        member_since: response.member_since || ''
      }

    }
  } catch (error) {
    console.error('获取停车偏好设置失败:', error)
    ElMessage.error('获取停车偏好设置失败')
  }
}

// 获取停车区域列表
const fetchParkingAreas = async () => {
  try {
    const response = await getParkingAreas()
    if (response && response.areas) {
      availableAreas.value = response.areas
    }
  } catch (error) {
    console.error('获取停车区域失败:', error)
    ElMessage.error('获取停车区域失败')
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    const response = await updateParkingPreference(formData.value)

    if (response) {
      ElMessage.success('停车偏好设置保存成功')
      // 更新会员状态
      membershipInfo.value = {
        is_member: response.is_member || false,
        member_since: response.member_since || ''
      }
    } else {
      ElMessage.error('保存失败')
    }
  } catch (error) {
    console.error('保存停车偏好设置失败:', error)
    ElMessage.error('保存失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 组件挂载时获取数据
onMounted(() => {
  fetchParkingPreference()
  fetchParkingAreas()
})
</script>

<style scoped lang="scss">
.parking-preference {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(229, 231, 235, 0.8);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }

  .form-tip {
    font-size: 12px;
    color: #6b7280;
    margin-top: 4px;
    line-height: 1.4;
  }

  // Element Plus 表单样式优化
  :deep(.el-form-item) {
    margin-bottom: 24px;

    .el-form-item__label {
      font-weight: 600;
      color: #374151;
      font-size: 14px;
    }

    .el-input__wrapper {
      border-radius: 8px;
      border: 2px solid #e5e7eb;
      transition: all 0.3s ease;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      &:hover {
        border-color: #d1d5db;
      }

      &.is-focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
    }

    .el-select {
      .el-input__wrapper {
        border-radius: 8px;
        border: 2px solid #e5e7eb;
        transition: all 0.3s ease;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

        &:hover {
          border-color: #d1d5db;
        }

        &.is-focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
      }
    }

    .el-switch {
      .el-switch__core {
        border-radius: 12px;
        height: 24px;
        line-height: 22px;

        &.is-checked {
          background-color: #3b82f6;
        }
      }
    }

    .el-button {
      border-radius: 8px;
      font-weight: 600;
      padding: 12px 24px;
      transition: all 0.3s ease;

      &.el-button--primary {
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        border: none;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
        }

        &:active {
          transform: translateY(0);
        }
      }

      &.el-button--default {
        border: 2px solid #e5e7eb;
        color: #6b7280;

        &:hover {
          border-color: #d1d5db;
          color: #374151;
        }
      }
    }

    .el-tag {
      border-radius: 6px;
      font-weight: 500;

      &.el-tag--success {
        background-color: #dcfce7;
        border-color: #bbf7d0;
        color: #166534;
      }

      &.el-tag--info {
        background-color: #f3f4f6;
        border-color: #e5e7eb;
        color: #6b7280;
      }
    }
  }
}
</style>
