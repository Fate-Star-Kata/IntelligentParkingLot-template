<template>
  <div class="change-password">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px" @submit.prevent="handleSubmit">
      <!-- 原密码 -->
      <el-form-item label="原密码" prop="oldPassword">
        <el-input v-model="formData.oldPassword" type="password" placeholder="请输入原密码" show-password />
      </el-form-item>

      <!-- 新密码 -->
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="formData.newPassword" type="password" placeholder="请输入新密码" show-password />
      </el-form-item>

      <!-- 确认密码 -->
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="formData.confirmPassword" type="password" placeholder="请再次输入新密码" show-password />
      </el-form-item>

      <!-- 提交按钮 -->
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="handleSubmit">
          {{ loading ? '修改中...' : '修改密码' }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { changePassword } from '@/api/user/userinfo'
import type { ChangePasswordRequest } from '@/types/factory'

// 定义组件名称
defineOptions({
  name: 'ChangePassword'
})

// 响应式数据
const loading = ref(false)
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 自定义验证函数
const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== formData.newPassword) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

// 表单验证规则
const rules = reactive<FormRules>({
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
})

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    const requestData: ChangePasswordRequest = {
      old_password: formData.oldPassword,
      new_password: formData.newPassword,
      reset_password: formData.confirmPassword
    }

    const response = await changePassword(requestData)

    if (response.code === 200) {
      ElMessage.success('密码修改成功')
      // 清空表单
      formData.oldPassword = ''
      formData.newPassword = ''
      formData.confirmPassword = ''
      formRef.value.resetFields()
    } else {
      ElMessage.error(response.msg || '密码修改失败')
    }
  } catch (error) {
    console.error('修改密码失败:', error)
    ElMessage.error('修改密码失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.change-password {
  .form-control {
    .label-text {
      font-weight: 500;
    }
  }

  .input-error {
    border-color: hsl(var(--error));
  }

  .alert {
    border-radius: 0.5rem;
  }
}
</style>