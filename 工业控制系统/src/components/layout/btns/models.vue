<script setup lang="ts">
    import { computed } from 'vue'
import { useStateStore } from '@/stores/state/state'

// 使用状态store
const stateStore = useStateStore()
const currentLocation = computed(() => stateStore.currentLocation)

// 使用storeToRefs保持响应性
const { parkingLocations } = stateStore

// 切换停车场位置
const handleLocationChange = (locationCode: string) => {
    stateStore.setCurrentLocation(locationCode)
}
</script>

<template>
    <div class="dropdown dropdown-end ">
        <!-- 触发按钮 -->
        <div tabindex="0" role="button" class="btn btn-sm btn-ghost gap-1 px-4 text-[.5625rem] font-bold"
            aria-label="Parking Location" title="Change Parking Location">
            <!-- 停车场图标 -->
            <svg class="text-base-content/70 size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"
                    d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6zm6 2v8m0-8a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V8z" />
            </svg>
            <!-- 当前位置显示 -->
            <span class=" text-[1rem]">{{ currentLocation }}</span>

            <!-- 下拉箭头 -->
            <svg class="mt-px hidden size-2 fill-current opacity-60 sm:inline-block" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 2048 2048">
                <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" />
            </svg>
        </div>

        <!-- 下拉菜单 -->
        <div tabindex="0"
            class="dropdown-content bg-base-200 text-base-content rounded-box top-px mt-16 h-auto max-h-[calc(100vh-8.6rem)] w-56 overflow-y-auto border border-white/5 shadow-2xl outline-1 outline-black/5">
            <ul class="menu menu-sm w-full">
                <li v-for="location in parkingLocations" :key="location.code">
                    <button :class="{
                        'menu-active': currentLocation === location.shortCode,
                    }" @click="handleLocationChange(location.shortCode)">
                        <span class="pe-4 font-mono text-[.5625rem] font-bold tracking-[0.09375rem] opacity-40">
                            {{ location.code }}
                        </span>
                        <span class="font-[sans-serif]">
                            {{ location.name }}
                        </span>
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.dropdown-content {
    z-index: 1000;
}
</style>

