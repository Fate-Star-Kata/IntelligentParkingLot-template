<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Motion } from 'motion-v'
import { ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import type { User, UserQueryParams } from '@/types/components/admin'
import Search from '@/components/icon/search.vue'
import {
  getUsersAPI,
  addUserAPI,
  userDetailAPI,
  editUserAPI,
  deleteUserAPI
} from '@/api/admin/users'
import { useUserStore } from '@/stores/auth/user'

// 动画配置
const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' }
}

// Store
const userStore = useUserStore()

// 响应式数据
const loading = ref(false)
const list = ref<User[]>([])
const total = ref(0)
const isAdd = ref(false)
const editableData = reactive<Record<string | number, User>>({})

// 查询参数
const params = reactive<UserQueryParams>({
  query: '',
  page: 1,
  page_size: 10
})

// 计算属性
const userId = computed(() => userStore.userInfo?.user_id)

// 获取用户列表
const getList = async () => {
  try {
    loading.value = true
    const res = await getUsersAPI(params)
    list.value = res.data.users
    total.value = res.data.total
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const search = () => {
  params.page = 1
  getList()
}

// 重置参数
const resetParams = () => {
  params.page = 1
  params.query = ''
  getList()
}

// 查看用户详情
const detail = async (id: number) => {
  try {
    const res = await userDetailAPI(id)
    console.log('用户详情:', res)
    ElMessage.success('查看用户详情成功')
  } catch (error) {
    console.error('获取用户详情失败:', error)
    ElMessage.error('获取用户详情失败')
  }
}

// 编辑用户
const edit = (id: number) => {
  const user = list.value.find(item => item.id === id)
  if (user) {
    editableData[id] = cloneDeep(user)
  }
}

// 添加用户
const handleAdd = () => {
  if (isAdd.value) return

  const newUser: User = {
    id: null,
    username: '',
    email: '',
    is_active: false,
    is_staff: false,
    is_superuser: false
  }

  editableData[newUser.id as any] = cloneDeep(newUser)
  isAdd.value = true
  list.value.unshift(newUser)
}

// 取消编辑
const clean = (id: number | null) => {
  if (isAdd.value && id === null) {
    list.value = list.value.filter(item => item.id !== null)
    isAdd.value = false
  }
  delete editableData[id as any]
}

// 表单验证
const validateData = (data: User) => {
  const errors: string[] = []

  if (!data.username?.trim()) {
    errors.push('用户名不能为空')
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(data.email)) {
    errors.push('邮箱格式不正确')
  }

  return errors
}

// 保存用户
const save = async (key: number | null) => {
  try {
    const dataToSave = editableData[key as any]
    const errors = validateData(dataToSave)

    if (errors.length > 0) {
      ElMessage.error(errors[0])
      return
    }

    let res
    if (isAdd.value) {
      res = await addUserAPI(dataToSave)
    } else {
      res = await editUserAPI(dataToSave)
    }

    ElMessage.success(res.message || '操作成功')

    // 清除可编辑状态
    delete editableData[key as any]
    isAdd.value = false
    getList()
  } catch (error: any) {
    console.error('保存失败:', error)
    ElMessage.error(error.message || '操作失败')
  }
}

// 删除用户
const deleteRecord = async (id: number) => {
  try {
    const res = await deleteUserAPI(id)
    ElMessage.success(res.msg || '删除成功')
    getList()
  } catch (error) {
    console.error('删除数据失败:', error)
    ElMessage.error('删除失败')
  }
}

// 分页处理
const handleSizeChange = (size: number) => {
  params.page_size = size
  params.page = 1
  getList()
}

const handleCurrentChange = (page: number) => {
  params.page = page
  getList()
}

// 行点击事件
const handleRowClick = (row: User) => {
  // 可以在这里添加行点击逻辑
}

// 组件挂载时获取数据
onMounted(() => {
  getList()
})
</script>

<template>
  <!-- @vue-ignore -->
  <Motion :initial="pageVariants.initial" :animate="pageVariants.animate" :transition="pageVariants.transition"
    class="user-manage">
    <el-card>
      <!-- 搜索和操作区域 -->
      <Motion :initial="{ opacity: 0, y: -20 }" :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, delay: 0.1 }">
        <el-row :gutter="16" class="mb-4">
          <el-col :span="6">
            <el-input v-model="params.query" placeholder="请输入邮箱或用户名" clearable @keyup.enter="search">
              <template #prefix>
                <el-icon>
                  <Search />
                </el-icon>
              </template>
            </el-input>
          </el-col>
          <el-col :span="12">
            <el-space>
              <Motion :whileHover="{ scale: 1.05 }" :whileTap="{ scale: 0.95 }">
                <el-button @click="resetParams">
                  <el-icon>
                    <Refresh />
                  </el-icon>
                  重置
                </el-button>
              </Motion>
              <Motion :whileHover="{ scale: 1.05 }" :whileTap="{ scale: 0.95 }">
                <el-button type="primary" @click="search">
                  <Search size="12" />
                  查询
                </el-button>
              </Motion>
              <Motion :whileHover="{ scale: 1.05 }" :whileTap="{ scale: 0.95 }">
                <el-button type="success" @click="handleAdd">
                  <el-icon>
                    <Plus />
                  </el-icon>
                  添加
                </el-button>
              </Motion>
            </el-space>
          </el-col>
        </el-row>
      </Motion>

      <!-- 表格区域 -->
      <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.2 }">
        <el-table :data="list" v-loading="loading" border stripe class="user-table" @row-click="handleRowClick">
          <el-table-column label="序号" width="80" align="center">
            <template #default="{ $index }">
              {{ (params.page - 1) * params.page_size + $index + 1 }}
            </template>
          </el-table-column>

          <el-table-column label="用户名" prop="username" min-width="120">
            <template #default="{ row }">
              <el-input v-if="editableData[row.id]" v-model="editableData[row.id].username" size="small" />
              <el-link v-else type="primary" @click="detail(row.id)">
                {{ row.username }}
              </el-link>
            </template>
          </el-table-column>

          <el-table-column label="邮箱" prop="email" min-width="180">
            <template #default="{ row }">
              <el-input v-if="editableData[row.id]" v-model="editableData[row.id].email" size="small" />
              <span v-else>{{ row.email }}</span>
            </template>
          </el-table-column>

          <el-table-column label="状态" prop="is_active" width="120" align="center">
            <template #default="{ row }">
              <el-switch v-if="editableData[row.id]" v-model="editableData[row.id].is_active" active-text="启用"
                inactive-text="停用" size="small" />
              <el-tag v-else :type="row.is_active ? 'success' : 'danger'" size="small">
                {{ row.is_active ? '启用' : '停用' }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="工作人员权限" prop="is_staff" width="140" align="center">
            <template #default="{ row }">
              <el-switch v-if="editableData[row.id]" v-model="editableData[row.id].is_staff" active-text="是"
                inactive-text="否" size="small" />
              <el-tag v-else :type="row.is_staff ? 'success' : 'info'" size="small">
                {{ row.is_staff ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="超级管理员权限" prop="is_superuser" width="160" align="center">
            <template #default="{ row }">
              <el-switch v-if="editableData[row.id]" v-model="editableData[row.id].is_superuser" active-text="是"
                inactive-text="否" size="small" />
              <el-tag v-else :type="row.is_superuser ? 'warning' : 'info'" size="small">
                {{ row.is_superuser ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="200" align="center" fixed="right">
            <template #default="{ row }">
              <el-space>
                <template v-if="editableData[row.id]">
                  <Motion :whileHover="{ scale: 1.1 }" :whileTap="{ scale: 0.9 }">
                    <el-button type="primary" size="small" @click="save(row.id)">
                      <el-icon>
                        <Check />
                      </el-icon>
                      保存
                    </el-button>
                  </Motion>
                  <Motion :whileHover="{ scale: 1.1 }" :whileTap="{ scale: 0.9 }">
                    <el-button size="small" @click="clean(row.id)">
                      <el-icon>
                        <Close />
                      </el-icon>
                      取消
                    </el-button>
                  </Motion>
                </template>
                <template v-else>
                  <Motion :whileHover="{ scale: 1.1 }" :whileTap="{ scale: 0.9 }">
                    <el-button type="primary" size="small" :disabled="userId === row.id" @click="edit(row.id)">
                      <el-icon>
                        <Edit />
                      </el-icon>
                      编辑
                    </el-button>
                  </Motion>
                  <Motion :whileHover="{ scale: 1.1 }" :whileTap="{ scale: 0.9 }">
                    <el-popconfirm v-if="userId !== row.id && !isAdd && row.id !== editableData[row.id]?.id"
                      title="确认删除吗?" confirm-button-text="确认" cancel-button-text="取消" @confirm="deleteRecord(row.id)">
                      <template #reference>
                        <el-button type="danger" size="small">
                          <el-icon>
                            <Delete />
                          </el-icon>
                          删除
                        </el-button>
                      </template>
                    </el-popconfirm>
                  </Motion>
                </template>
              </el-space>
            </template>
          </el-table-column>
        </el-table>
      </Motion>

      <!-- 分页区域 -->
      <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, delay: 0.3 }" class="mt-4 flex justify-end">
        <el-pagination v-model:current-page="params.page" v-model:page-size="params.page_size" :total="total"
          :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </Motion>
    </el-card>
  </Motion>
</template>

<style scoped lang="scss">
.user-manage {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  background-image:
    radial-gradient(circle at 25% 25%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(6, 182, 212, 0.05) 0%, transparent 50%),
    linear-gradient(90deg, transparent 49%, rgba(6, 182, 212, 0.03) 50%, transparent 51%),
    linear-gradient(0deg, transparent 49%, rgba(6, 182, 212, 0.03) 50%, transparent 51%);
  background-size: 100px 100px, 150px 150px, 50px 50px, 50px 50px;
  animation: grid-move 20s linear infinite;
  min-height: 100vh;
  padding: 20px;

  .user-table {
    background: rgba(31, 41, 55, 0.8);
    border: 1px solid rgba(6, 182, 212, 0.3);
    border-radius: 12px;
    overflow: hidden;

    :deep(.el-table__row) {
      background: rgba(31, 41, 55, 0.6);
      border-bottom: 1px solid rgba(6, 182, 212, 0.2);
      transition: all 0.3s ease;
      color: #e5e7eb;

      &:hover {
        background: rgba(6, 182, 212, 0.1);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(6, 182, 212, 0.2);
      }

      td {
        border-bottom: 1px solid rgba(6, 182, 212, 0.2);
        color: #e5e7eb;
      }
    }

    :deep(.el-table__header) {
      background: linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(6, 182, 212, 0.1) 100%);

      th {
        background: transparent;
        border-bottom: 2px solid rgba(6, 182, 212, 0.5);
        color: #06b6d4;
        font-weight: 600;
        text-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
      }
    }

    :deep(.el-table__body) {
      background: transparent;
    }

    :deep(.el-table--border) {
      border: 1px solid rgba(6, 182, 212, 0.3);
    }

    :deep(.el-table--border::after) {
      background-color: rgba(6, 182, 212, 0.3);
    }

    :deep(.el-table__border-left-patch) {
      background-color: rgba(6, 182, 212, 0.3);
    }

    :deep(.el-table__border-bottom-patch) {
      background-color: rgba(6, 182, 212, 0.3);
    }
  }

  .el-card {
    background: rgba(31, 41, 55, 0.8);
    border: 1px solid rgba(6, 182, 212, 0.3);
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(6, 182, 212, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);

    &:hover {
      box-shadow: 0 8px 25px rgba(6, 182, 212, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
      border-color: rgba(6, 182, 212, 0.5);
    }

    :deep(.el-card__body) {
      padding: 24px;
      background: transparent;
      color: #e5e7eb;
    }
  }

  .el-button {
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
    }
  }

  .el-tag {
    transition: all 0.3s ease;
    background: rgba(6, 182, 212, 0.1);
    border: 1px solid rgba(6, 182, 212, 0.3);
    color: #06b6d4;

    &:hover {
      transform: scale(1.05);
      background: rgba(6, 182, 212, 0.2);
      border-color: rgba(6, 182, 212, 0.5);
    }

    &.el-tag--success {
      background: rgba(34, 197, 94, 0.1);
      border-color: rgba(34, 197, 94, 0.3);
      color: #22c55e;
    }

    &.el-tag--danger {
      background: rgba(239, 68, 68, 0.1);
      border-color: rgba(239, 68, 68, 0.3);
      color: #ef4444;
    }

    &.el-tag--warning {
      background: rgba(245, 158, 11, 0.1);
      border-color: rgba(245, 158, 11, 0.3);
      color: #f59e0b;
    }

    &.el-tag--info {
      background: rgba(107, 114, 128, 0.1);
      border-color: rgba(107, 114, 128, 0.3);
      color: #6b7280;
    }
  }
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
:deep(.el-input__wrapper) {
  background: rgba(31, 41, 55, 0.8) !important;
  border: 1px solid rgba(6, 182, 212, 0.3) !important;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
}

:deep(.el-input__wrapper:hover) {
  border-color: rgba(6, 182, 212, 0.5) !important;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #06b6d4 !important;
  box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.2), inset 0 1px 3px rgba(0, 0, 0, 0.3);
}

:deep(.el-input__inner) {
  color: #e5e7eb !important;
  background: transparent !important;
}

:deep(.el-input__inner::placeholder) {
  color: #9ca3af !important;
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  border-color: #06b6d4;
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.4);
}

:deep(.el-button--primary:hover) {
  background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.6);
}

:deep(.el-button--success) {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  border-color: #22c55e;
  box-shadow: 0 0 15px rgba(34, 197, 94, 0.4);
}

:deep(.el-button--success:hover) {
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.6);
}

:deep(.el-button--danger) {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-color: #ef4444;
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.4);
}

:deep(.el-button--danger:hover) {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.6);
}

:deep(.el-switch.is-checked .el-switch__core) {
  background-color: #06b6d4 !important;
  border-color: #06b6d4 !important;
}

:deep(.el-switch__core) {
  background-color: rgba(107, 114, 128, 0.5) !important;
  border-color: rgba(107, 114, 128, 0.5) !important;
}

:deep(.el-link--primary) {
  color: #06b6d4;
}

:deep(.el-link--primary:hover) {
  color: #0891b2;
  text-shadow: 0 0 8px rgba(6, 182, 212, 0.5);
}

:deep(.el-pagination) {
  background: rgba(31, 41, 55, 0.8);
  padding: 15px;
  border-radius: 12px;
  border: 1px solid rgba(6, 182, 212, 0.3);
}

:deep(.el-pagination .el-pager li) {
  background: rgba(6, 182, 212, 0.1);
  border: 1px solid rgba(6, 182, 212, 0.3);
  color: #e5e7eb;
}

:deep(.el-pagination .el-pager li:hover) {
  background: rgba(6, 182, 212, 0.2);
  border-color: rgba(6, 182, 212, 0.5);
}

:deep(.el-pagination .el-pager li.is-active) {
  background: #06b6d4;
  border-color: #06b6d4;
  color: #ffffff;
}

:deep(.el-pagination__total) {
  color: #e5e7eb;
}

:deep(.el-pagination__jump) {
  color: #e5e7eb;
}

:deep(.el-select__wrapper) {
  background: rgba(31, 41, 55, 0.8) !important;
  border: 1px solid rgba(6, 182, 212, 0.3) !important;
}

:deep(.el-popconfirm__main) {
  color: #e5e7eb;
}

:deep(.el-loading-mask) {
  background-color: rgba(31, 41, 55, 0.8);
}

:deep(.el-loading-spinner .circular) {
  stroke: #06b6d4;
}
</style>