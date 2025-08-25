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
    <div class="location-selector">
        <!-- 触发按钮 -->
        <button class="selector-btn" aria-label="Parking Location" title="Change Parking Location">
            <!-- 停车场图标 -->
            <svg class="selector-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"
                    d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6zm6 2v8m0-8a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V8z" />
            </svg>
            <!-- 当前位置显示 -->
            <span class="selector-text">{{ currentLocation }}</span>

            <!-- 下拉箭头 -->
            <svg class="selector-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
                <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" />
            </svg>
        </button>

        <!-- 下拉菜单 -->
        <div class="selector-dropdown">
            <ul class="dropdown-list">
                <li v-for="location in parkingLocations" :key="location.code" class="dropdown-item">
                    <button :class="['location-btn', { 'location-btn-active': currentLocation === location.shortCode }]"
                        @click="handleLocationChange(location.shortCode)">
                        <span class="location-code">
                            {{ location.code }}
                        </span>
                        <span class="location-name">
                            {{ location.name }}
                        </span>
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.location-selector {
    position: relative;
    display: inline-block;
}

.selector-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: rgb(var(--bg-muted));
    border: 1px solid rgb(var(--border));
    border-radius: var(--radius-md);
    color: rgb(var(--text));
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 8rem;
}

.selector-btn:hover {
    background: rgb(var(--bg-elevated));
    border-color: rgb(var(--primary));
}

.selector-icon {
    width: 1.25rem;
    height: 1.25rem;
    color: rgb(var(--text-secondary));
}

.selector-text {
    flex: 1;
    text-align: left;
    font-weight: 600;
}

.selector-arrow {
    width: 0.75rem;
    height: 0.75rem;
    fill: rgb(var(--text-secondary));
    transition: transform 0.2s ease;
}

.location-selector:hover .selector-arrow {
    transform: rotate(180deg);
}

.selector-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    background: rgb(var(--bg-elevated));
    border: 1px solid rgb(var(--border));
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    min-width: 14rem;
    max-height: 20rem;
    overflow-y: auto;
    z-index: 1000;
    display: none;
}

.location-selector:hover .selector-dropdown {
    display: block;
}

.dropdown-list {
    list-style: none;
    padding: 0.5rem;
    margin: 0;
}

.dropdown-item {
    margin-bottom: 0.25rem;
}

.dropdown-item:last-child {
    margin-bottom: 0;
}

.location-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0.75rem 1rem;
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
}

.location-btn:hover {
    background: rgb(var(--bg-muted));
}

.location-btn-active {
    background: rgb(var(--primary) / 0.1);
    color: rgb(var(--primary));
}

.location-btn-active:hover {
    background: rgb(var(--primary) / 0.15);
}

.location-code {
    font-family: 'Courier New', monospace;
    font-size: 0.75rem;
    font-weight: 700;
    color: rgb(var(--text-secondary));
    opacity: 0.7;
    letter-spacing: 0.05em;
    min-width: 3rem;
}

.location-btn-active .location-code {
    color: rgb(var(--primary));
    opacity: 0.8;
}

.location-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: rgb(var(--text));
    flex: 1;
    margin-left: 1rem;
}

.location-btn-active .location-name {
    color: rgb(var(--primary));
    font-weight: 600;
}

/* 滚动条样式 */
.selector-dropdown::-webkit-scrollbar {
    width: 0.25rem;
}

.selector-dropdown::-webkit-scrollbar-track {
    background: rgb(var(--bg-muted));
    border-radius: var(--radius-sm);
}

.selector-dropdown::-webkit-scrollbar-thumb {
    background: rgb(var(--border));
    border-radius: var(--radius-sm);
}

.selector-dropdown::-webkit-scrollbar-thumb:hover {
    background: rgb(var(--text-secondary));
}
</style>

