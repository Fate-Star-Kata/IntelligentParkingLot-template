<template>
  <div class="content-management-container">
    <!-- 统计卡片 -->
    <el-card shadow="never" class="stats-card">
      <template #header>
        <div class="stats-header">
          <span class="stats-title">数据统计</span>
          <el-button type="primary" :icon="Plus" @click="showCreateDialog = true">
            发布通知
          </el-button>
        </div>
      </template>
      <el-row :gutter="16" class="stats-row">
        <el-col :xs="24" :sm="12" :md="6">
          <el-card shadow="hover" class="stat-card">
            <el-statistic title="总通知数" :value="stats.total">
              <template #prefix>
                <el-icon style="color: var(--el-color-primary)">
                  <Bell />
                </el-icon>
              </template>
            </el-statistic>
          </el-card>
        </el-col>

        <el-col :xs="24" :sm="12" :md="6">
          <el-card shadow="hover" class="stat-card">
            <el-statistic title="今日发布" :value="stats.today">
              <template #prefix>
                <el-icon style="color: var(--el-color-success)">
                  <Calendar />
                </el-icon>
              </template>
            </el-statistic>
          </el-card>
        </el-col>

        <el-col :xs="24" :sm="12" :md="6">
          <el-card shadow="hover" class="stat-card">
            <el-statistic title="本月发布" :value="stats.this_month">
              <template #prefix>
                <el-icon style="color: var(--el-color-warning)">
                  <TrendCharts />
                </el-icon>
              </template>
            </el-statistic>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <!-- 筛选和搜索 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" class="search-form">
        <el-form-item label="搜索">
          <el-input v-model="searchParams.query" placeholder="搜索通知标题或内容..." :prefix-icon="Search" clearable
            style="width: 300px" @input="handleSearch" />
        </el-form-item>

        <el-form-item label="可见性">
          <el-select v-model="searchParams.is_public" placeholder="全部" clearable style="width: 120px"
            @change="handleFilterChange">
            <el-option label="公开" :value="1" />
            <el-option label="私有" :value="0" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :icon="Search" @click="getNotificationList">
            搜索
          </el-button>
          <el-button @click="resetSearch">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 通知列表 -->
    <el-card shadow="never" class="list-card">
      <template #header>
        <div class="list-header">
          <span class="list-title">通知列表</span>
          <el-space>
            <el-button :icon="Refresh" @click="refreshData" :loading="loading" size="small">
              刷新
            </el-button>

          </el-space>
        </div>
      </template>

      <!-- 加载状态 -->
      <div v-if="loading" v-loading="loading" class="loading-container">
        <el-empty description="正在加载通知..." />
      </div>

      <!-- 空状态 -->
      <div v-else-if="notificationList.length === 0" class="empty-container">
        <el-empty description="暂无通知数据">
          <template #image>
            <el-icon size="60" color="var(--el-color-info)">
              <DocumentRemove />
            </el-icon>
          </template>
          <el-button type="primary" @click="showCreateDialog = true">
            发布第一条通知
          </el-button>
        </el-empty>
      </div>

      <!-- 通知列表 -->
      <div v-else class="notifications-container">
        <NotificationItem v-for="(item, index) in notificationList" :key="item.id" :data="item" :index="index"
          @reload="getNotificationList" @edit="handleEdit" @delete="handleDeleteSuccess" />
      </div>
    </el-card>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination v-model:current-page="searchParams.page" v-model:page-size="searchParams.page_size" :total="total"
        :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" background />
    </div>

    <!-- 创建/编辑通知对话框 -->
    <el-dialog v-model="showCreateDialog" :title="editingNotification ? '编辑通知' : '发布通知'" width="600px"
      :close-on-click-modal="false" :close-on-press-escape="false" destroy-on-close>
      <el-form ref="notificationFormRef" :model="notificationForm" :rules="formRules" label-width="80px"
        label-position="left" size="default">
        <el-form-item label="标题" prop="title">
          <el-input v-model="notificationForm.title" placeholder="请输入通知标题" maxlength="100" show-word-limit clearable />
        </el-form-item>

        <el-form-item label="是否启用">
          <el-switch v-model="notificationForm.is_active" active-text="启用" inactive-text="未启用" active-color="#13ce66"
            inactive-color="#ff4949" />
        </el-form-item>

        <el-form-item label="通知所有人">
          <el-switch v-model="notificationForm.notify_all" active-text="是" inactive-text="否" active-color="#13ce66"
            inactive-color="#ff4949" />
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <el-input v-model="notificationForm.content" type="textarea" :rows="6" placeholder="请输入通知内容" maxlength="1000"
            show-word-limit resize="vertical" />
        </el-form-item>

        <el-form-item label="邮件通知">
          <el-switch v-model="notificationForm.email_notification" active-text="发送" inactive-text="不发送"
            active-color="#13ce66" inactive-color="#ff4949" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-space>
          <el-button @click="showCreateDialog = false">取消</el-button>
          <el-button type="primary" :loading="submitting" @click="handleSubmit">
            <el-icon v-if="!submitting">
              <Edit v-if="editingNotification" />
              <Plus v-else />
            </el-icon>
            {{ editingNotification ? '更新' : '发布' }}
          </el-button>
        </el-space>
      </template>
    </el-dialog>


  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  Plus,
  Refresh,
  Search,
  Bell,
  Calendar,
  TrendCharts,
  DocumentRemove,
  Edit
} from '@element-plus/icons-vue'
import { notificationApi } from '@/api/admin/notification'
import NotificationItem from '@/components/pages/admin/Content/NotificationItem.vue'
import type {
  NotificationItem as NotificationItemType,
  NotificationListReq,
  CreateNotificationReq,
  NotificationStats
} from '@/types/factory'

// 响应式数据
const loading = ref(false)
const submitting = ref(false)
const markingAllAsRead = ref(false)
const showCreateDialog = ref(false)
const editingNotification = ref<NotificationItemType | null>(null)
const notificationFormRef = ref<FormInstance>()

// 搜索参数
const searchParams = reactive<NotificationListReq>({
  query: '',
  page: 1,
  page_size: 10,
  is_active: undefined,
  is_public: undefined,
})

// 通知列表数据
const notificationList = ref<NotificationItemType[]>([])
const total = ref(0)


// 统计数据
const stats = ref<NotificationStats>({
  total: 0,
  today: 0,
  this_week: 0,
  this_month: 0,
})

// 表单数据
const notificationForm = reactive<CreateNotificationReq>({
  title: '',
  content: '',
  is_public: true,
  is_active: true,
  notify_all: false,
  email_notification: false,
})

// 表单验证规则
const formRules: FormRules = {
  title: [
    { required: true, message: '请输入通知标题', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入通知内容', trigger: 'blur' },
    { min: 5, max: 500, message: '内容长度在 5 到 500 个字符', trigger: 'blur' }
  ]
}

// @ts-ignore 搜索防抖
let searchTimer: NodeJS.Timeout | null = null

// 方法
const getNotificationList = async () => {
  loading.value = true
  try {
    const response = await notificationApi.getUserNotificationList(searchParams)
    if (response.code === 200) {
      notificationList.value = response.data.notifications
      total.value = response.data.total
      // 获取通知列表后动态计算统计数据
      getStats()
    } else {
      ElMessage.error(response.msg || '获取通知列表失败')
    }
  } catch (error) {
    console.error('获取通知列表失败:', error)
    ElMessage.error('获取通知列表失败，请重试')
  } finally {
    loading.value = false
  }
}

const getStats = () => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const thisWeekStart = new Date(today)
  thisWeekStart.setDate(today.getDate() - today.getDay())
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  let todayCount = 0
  let thisWeekCount = 0
  let thisMonthCount = 0

  notificationList.value.forEach(notification => {
    const createdAt = new Date(notification.created_at)

    if (createdAt >= today) {
      todayCount++
    }
    if (createdAt >= thisWeekStart) {
      thisWeekCount++
    }
    if (createdAt >= thisMonthStart) {
      thisMonthCount++
    }
  })

  stats.value = {
    total: notificationList.value.length,
    today: todayCount,
    this_week: thisWeekCount,
    this_month: thisMonthCount
  }
}

const handleSearch = () => {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
  searchTimer = setTimeout(() => {
    searchParams.page = 1
    getNotificationList()
  }, 500)
}

const handleFilterChange = () => {
  searchParams.page = 1
  getNotificationList()
}

const handleSizeChange = (size: number) => {
  searchParams.page_size = size
  searchParams.page = 1
  getNotificationList()
}

const handleCurrentChange = (page: number) => {
  searchParams.page = page
  getNotificationList()
}

const refreshData = () => {
  getNotificationList()
}

const resetForm = () => {
  notificationForm.title = ''
  notificationForm.content = ''
  notificationForm.is_active = true
  notificationForm.notify_all = false
  notificationForm.email_notification = false
  editingNotification.value = null
  notificationFormRef.value?.resetFields()
}

const resetSearch = () => {
  searchParams.page = 1
  searchParams.page_size = 10
  searchParams.query = ''
  searchParams.is_active = true
  searchParams.is_public = undefined
  getNotificationList()
}

const handleSubmit = async () => {
  if (!notificationFormRef.value) return

  try {
    await notificationFormRef.value.validate()
    submitting.value = true

    const response = editingNotification.value
      ? await notificationApi.updateNotification({
        id: editingNotification.value.id,
        ...notificationForm
      })
      : await notificationApi.createNotification(notificationForm)

    if (response.code === 200) {
      ElMessage.success(response.msg || `${editingNotification.value ? '更新' : '发布'}成功`)
      showCreateDialog.value = false
      resetForm()
      refreshData()
    } else {
      ElMessage.error(response.msg || `${editingNotification.value ? '更新' : '发布'}失败`)
    }
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('提交失败，请重试')
  } finally {
    submitting.value = false
  }
}

const handleEdit = (id: string | number) => {
  const notification = notificationList.value.find(item => item.id === id)
  if (notification) {
    editingNotification.value = notification
    notificationForm.title = notification.title
    notificationForm.content = notification.content
    notificationForm.is_active = notification.is_active ?? true
    notificationForm.notify_all = notification.notify_all ?? false
    notificationForm.email_notification = notification.email_notification ?? false
    showCreateDialog.value = true
  }
}

const handleDeleteSuccess = (id: string | number) => {
  // 从列表中移除已删除的项
  const index = notificationList.value.findIndex(item => item.id === id)
  if (index > -1) {
    notificationList.value.splice(index, 1)
    total.value--
  }
  refreshData()
}

// 生命周期
onMounted(() => {
  getNotificationList()
})
</script>

<style scoped>
.content-management {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.stats-card {
  margin-bottom: 20px;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stats-title {
  font-size: 16px;
  font-weight: 600;
}

.stats-grid {
  margin-top: 16px;
}

.stat-card {
  text-align: center;
}

.stat-card .el-statistic {
  --el-statistic-content-font-size: 28px;
}

.filters-card {
  margin-bottom: 20px;
}

.list-card {
  margin-top: 2em;
  margin-bottom: 20px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-title {
  font-size: 16px;
  font-weight: 600;
}

.loading-container,
.empty-container {
  padding: 40px 0;
}

.notifications-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.notification-detail {
  margin: 16px 0;
}

.detail-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.content-card {
  margin-top: 8px;
}

.content-text {
  line-height: 1.6;
  color: var(--el-text-color-regular);
  white-space: pre-wrap;
  word-break: break-word;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content-management {
    padding: 16px;
  }

  .stats-grid .el-col {
    margin-bottom: 16px;
  }
}
</style>
