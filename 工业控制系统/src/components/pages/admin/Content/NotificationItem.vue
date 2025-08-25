<template>
  <el-card class="notification-item" shadow="hover">
    <!-- 卡片头部 -->
    <template #header>
      <div class="card-header">
        <div class="header-left">
          <!-- 公开/私有状态 -->
          <el-tag :type="data.is_public ? 'success' : 'warning'" size="small">
            {{ data.is_public ? '公开' : '私有' }}
          </el-tag>

          <!-- 接收者数量 -->
          <el-tag v-if="data.recipient_count" type="info" size="small" class="ml-2">
            <el-icon class="mr-1">
              <UserFilled />
            </el-icon>
            {{ data.recipient_count }}人接收
          </el-tag>

          <!-- 是否启用 -->
          <el-tag :type="data.is_active ? 'success' : 'danger'" size="small" class="ml-2">
            <el-icon class="mr-1">
              <CircleCheckFilled v-if="data.is_active" />
              <CircleCloseFilled v-else />
            </el-icon>
            {{ data.is_active ? '已启用' : '已禁用' }}
          </el-tag>
        </div>

        <div class="header-right">
          <!-- 操作按钮 -->
          <el-button-group size="small">
            <el-button type="warning" @click="handleEdit">
              <el-icon>
                <Edit />
              </el-icon>
              编辑
            </el-button>
            <el-button type="danger" @click="handleDeleteClick">
              <el-icon>
                <Delete />
              </el-icon>
            </el-button>
          </el-button-group>
        </div>
      </div>
    </template>

    <!-- 卡片内容 -->
    <div class="card-content">
      <!-- 标题 -->
      <h3 class="notification-title">{{ data.title }}</h3>

      <!-- 内容 -->
      <p class="notification-content">{{ data.content }}</p>

      <!-- 底部信息 -->
      <div class="notification-footer">
        <div class="footer-info">
          <div class="info-item">
            <el-icon class="info-icon">
              <Clock />
            </el-icon>
            <span class="info-text">{{ formatDate(data.created_at) }}</span>
          </div>
        </div>
      </div>
    </div>
  </el-card>

  <!-- 确认对话框 -->
  <el-dialog v-model="showConfirmDialog" title="确认操作" width="420px" align-center class="confirm-dialog">
    <div class="dialog-content">
      <div class="warning-icon">
        <el-icon>
          <WarningFilled />
        </el-icon>
      </div>
      <div class="warning-text">
        <h4>{{ confirmMessage }}</h4>
        <p>此操作不可撤销，请谨慎操作。</p>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="showConfirmDialog = false" class="cancel-btn">
          取消
        </el-button>
        <el-button type="primary" @click="handleConfirm" :loading="confirmLoading" class="confirm-btn">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Clock,
  Delete,
  Edit,
  CircleCloseFilled,
  CircleCheckFilled,
  Lock,
  UserFilled,
  WarningFilled,
} from '@element-plus/icons-vue'
import { notificationApi } from '@/api/admin/notification'
import type { NotificationItem } from '@/types/factory'

// Props
interface Props {
  data: NotificationItem
  index?: number
}

const props = withDefaults(defineProps<Props>(), {
  index: 0
})

// Emits
interface Emits {
  reload: []
  detail: [id: string | number]
  edit: [id: string | number]
  delete: [id: string | number]
}

const emit = defineEmits<Emits>()

// 响应式数据
const showConfirmDialog = ref(false)
const confirmLoading = ref(false)
const confirmMessage = ref('')
const currentAction = ref<'delete' | null>(null)

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60))
      return minutes <= 0 ? '刚刚' : `${minutes}分钟前`
    }
    return `${hours}小时前`
  } else if (days === 1) {
    return '昨天'
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return date.toLocaleDateString('zh-CN')
  }
}

// 方法
const handleEdit = () => {
  emit('edit', props.data.id)
}

const handleDeleteClick = () => {
  currentAction.value = 'delete'
  confirmMessage.value = '确认删除此通知吗？删除后无法恢复。'
  showConfirmDialog.value = true
}

const handleCommand = (command: string) => {
  switch (command) {
    case 'detail':
      emit('detail', props.data.id)
      break
    case 'delete':
      currentAction.value = 'delete'
      confirmMessage.value = '确认删除此通知吗？删除后无法恢复。'
      showConfirmDialog.value = true
      break
  }
}

const handleConfirm = async () => {
  if (!currentAction.value) return

  confirmLoading.value = true

  try {
    if (currentAction.value === 'delete') {
      await deleteNotification()
    }
  } finally {
    confirmLoading.value = false
    showConfirmDialog.value = false
    currentAction.value = null
  }
}

const deleteNotification = async () => {
  try {
    const response = await notificationApi.deleteNotification(props.data.id)

    if (response.code === 200) {
      ElMessage.success(response.msg || '删除成功')
      emit('delete', props.data.id)
    } else {
      ElMessage.error(response.msg || '删除失败')
    }
  } catch (error) {
    console.error('删除通知失败:', error)
    ElMessage.error('删除失败，请重试')
  }
}
</script>

<style scoped>
.notification-item {
  margin-bottom: 16px;
  background: rgba(31, 41, 55, 0.8);
  border: 1px solid rgba(6, 182, 212, 0.3);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(6, 182, 212, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.notification-item:hover {
  box-shadow: 0 8px 25px rgba(6, 182, 212, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border-color: rgba(6, 182, 212, 0.5);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
}

.notification-title {
  font-size: 16px;
  font-weight: 600;
  color: #06b6d4;
  margin: 0 0 12px 0;
  line-height: 1.4;
  text-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
}

.notification-content {
  font-size: 14px;
  color: #e5e7eb;
  line-height: 1.6;
  margin: 0 0 16px 0;
}

.notification-footer {
  padding-top: 12px;
  border-top: 1px solid rgba(6, 182, 212, 0.3);
}

.footer-info {
  display: flex;
  align-items: center;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #9ca3af;
}

.info-icon {
  font-size: 14px;
  color: #06b6d4;
}

.info-text {
  font-weight: 500;
  color: #d1d5db;
}

.ml-2 {
  margin-left: 8px;
}

.mr-1 {
  margin-right: 4px;
}

.dialog-content {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px 0;
}

.warning-icon {
  color: #f59e0b;
  font-size: 24px;
  flex-shrink: 0;
}

.warning-text h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #06b6d4;
}

.warning-text p {
  margin: 0;
  font-size: 14px;
  color: #9ca3af;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Element Plus 组件深度样式覆盖 */
:deep(.el-card) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

:deep(.el-card__header) {
  background: rgba(6, 182, 212, 0.1) !important;
  border-bottom: 1px solid rgba(6, 182, 212, 0.3) !important;
  padding: 15px 20px !important;
  border-radius: 12px 12px 0 0 !important;
}

:deep(.el-card__body) {
  background: transparent !important;
  color: #e5e7eb !important;
}

:deep(.el-tag) {
  border-radius: 6px !important;
  font-weight: 500 !important;
}

:deep(.el-tag--success) {
  background: rgba(34, 197, 94, 0.2) !important;
  border-color: rgba(34, 197, 94, 0.5) !important;
  color: #22c55e !important;
}

:deep(.el-tag--warning) {
  background: rgba(245, 158, 11, 0.2) !important;
  border-color: rgba(245, 158, 11, 0.5) !important;
  color: #f59e0b !important;
}

:deep(.el-tag--info) {
  background: rgba(6, 182, 212, 0.2) !important;
  border-color: rgba(6, 182, 212, 0.5) !important;
  color: #06b6d4 !important;
}

:deep(.el-tag--danger) {
  background: rgba(239, 68, 68, 0.2) !important;
  border-color: rgba(239, 68, 68, 0.5) !important;
  color: #ef4444 !important;
}

:deep(.el-button) {
  border-radius: 8px !important;
  font-weight: 500 !important;
  transition: all 0.3s ease !important;
}

:deep(.el-button--warning) {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
  border: none !important;
  color: white !important;
  box-shadow: 0 0 15px rgba(245, 158, 11, 0.4) !important;
}

:deep(.el-button--warning:hover) {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%) !important;
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.6) !important;
  transform: translateY(-2px) !important;
}

:deep(.el-button--danger) {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
  border: none !important;
  color: white !important;
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.4) !important;
}

:deep(.el-button--danger:hover) {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%) !important;
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.6) !important;
  transform: translateY(-2px) !important;
}

:deep(.el-dialog) {
  background: rgba(31, 41, 55, 0.95) !important;
  border: 1px solid rgba(6, 182, 212, 0.3) !important;
  border-radius: 12px !important;
  backdrop-filter: blur(10px) !important;
}

:deep(.el-dialog__header) {
  background: rgba(6, 182, 212, 0.1) !important;
  border-bottom: 1px solid rgba(6, 182, 212, 0.3) !important;
  border-radius: 12px 12px 0 0 !important;
}

:deep(.el-dialog__title) {
  color: #06b6d4 !important;
  font-weight: 600 !important;
}

:deep(.el-dialog__body) {
  background: transparent !important;
  color: #e5e7eb !important;
}
</style>
