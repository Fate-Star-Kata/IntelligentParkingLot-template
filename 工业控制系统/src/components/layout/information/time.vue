<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

// 定义组件属性
interface Props {
  format?: string // 时间格式，默认为 'yyyy-mm-dd hh:mm:ss'
  className?: string // 自定义样式类名
}

const props = withDefaults(defineProps<Props>(), {
  format: 'yyyy-mm-dd hh:mm:ss',
  className: ''
})

// 当前时间
const currentTime = ref(new Date())
let timer: number | null = null

// 格式化时间
const formatTime = (date: Date, format: string): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  return format
    .replace(/yyyy/g, String(year))
    .replace(/yy/g, String(year).slice(-2))
    .replace(/mm/g, month)
    .replace(/dd/g, day)
    .replace(/hh/g, hours)
    .replace(/MM/g, minutes)
    .replace(/ss/g, seconds)
}

// 计算显示的时间字符串
const displayTime = computed(() => {
  return formatTime(currentTime.value, props.format)
})

// 更新时间
const updateTime = () => {
  currentTime.value = new Date()
}

// 组件挂载时启动定时器
onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

// 组件卸载时清除定时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<template>
  <div :class="['time-display', className]">
    <span class="time-text">{{ displayTime }}</span>
  </div>
</template>

<style scoped>
.time-display {
  display: inline-flex;
  align-items: center;
  font-family: 'Courier New', monospace;
  font-weight: 500;
}

.time-text {
  color: inherit;
  font-size: inherit;
  letter-spacing: 0.5px;
}

/* 默认样式 */
.time-display {
  @apply text-base-content/80 text-sm;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .time-display {
    @apply text-xs;
  }
}
</style>