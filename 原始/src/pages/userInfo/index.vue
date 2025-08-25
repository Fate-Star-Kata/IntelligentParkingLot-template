<template>
  <div class="userinfo flex justify-center items-center min-h-[calc(100vh-100px)]">
    <div class="card w-full max-w-2xl bg-base-100 shadow-xl">
      <div class="card-body">
        <!-- Tab 导航 -->
        <div class="tabs tabs-boxed mb-6">
          <button v-for="tab in tabList" :key="tab.key" :class="['tab', { 'tab-active': activeTab === tab.key }]"
            @click="activeTab = tab.key">
            {{ tab.label }}
          </button>
        </div>

        <!-- Tab 内容 -->
        <div class="tabContent">
          <BaseInfo v-show="activeTab === 'baseInfo'" />
          <ChangePassword v-show="activeTab === 'changePassword'" />
          <ParkingPreference v-show="activeTab === 'parkingPreference'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import BaseInfo from 'components/pages/userInfo/BaseInfo.vue'
import ChangePassword from 'components/pages/userInfo/ChangePassword.vue'
import ParkingPreference from 'components/pages/userInfo/ParkingPreference.vue'

// 定义页面元数据
defineOptions({
  name: 'UserInfo'
})

// 响应式数据
const activeTab = ref<string>('baseInfo')

watch(activeTab, (val) => {
  console.log(val);

})

// Tab 列表配置
const tabList = reactive([
  {
    key: 'baseInfo',
    label: '基本信息'
  },
  {
    key: 'changePassword',
    label: '修改密码'
  },
  {
    key: 'parkingPreference',
    label: '停车偏好'
  }
])
</script>

<style scoped lang="scss">
.userinfo {
  padding: 2rem;

  .card {
    border: 1px solid hsl(var(--border));
  }

  .tabContent {
    min-height: 400px;
  }
}
</style>