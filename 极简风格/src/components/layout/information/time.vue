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
  <div :class="['modern-time-display', className]">
    <div class="time-container">
      <svg class="time-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12,6 12,12 16,14"/>
      </svg>
      <span class="time-text">{{ displayTime }}</span>
    </div>
  </div>
</template>

<style scoped>
.modern-time-display {
  display: inline-flex;
  align-items: center;
  background: rgb(var(--bg-muted));
  border: 1px solid rgb(var(--border));
  border-radius: var(--radius-md);
  padding: 0.5rem 0.75rem;
  transition: all 0.2s ease;
}

.modern-time-display:hover {
  background: rgb(var(--bg-elevated));
  border-color: rgb(var(--primary) / 0.3);
  box-shadow: var(--shadow-sm);
}

.time-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.time-icon {
  width: 1rem;
  height: 1rem;
  color: rgb(var(--text-secondary));
  stroke-width: 2;
}

.time-text {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Courier New', monospace;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(var(--text));
  letter-spacing: 0.025em;
  line-height: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modern-time-display {
    padding: 0.375rem 0.5rem;
  }
  
  .time-icon {
    width: 0.875rem;
    height: 0.875rem;
  }
  
  .time-text {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .time-container {
    gap: 0.375rem;
  }
  
  .time-text {
    font-size: 0.6875rem;
  }
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .modern-time-display {
    background: rgb(var(--bg-muted));
  }
  
  .modern-time-display:hover {
    background: rgb(var(--bg-elevated));
  }
}

/* 动画效果 */
.time-text {
  animation: subtle-pulse 2s ease-in-out infinite;
}

@keyframes subtle-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.9;
  }
}

/* 禁用动画的用户偏好 */
@media (prefers-reduced-motion: reduce) {
  .time-text {
    animation: none;
  }
  
  .modern-time-display {
    transition: none;
  }
}
</style>