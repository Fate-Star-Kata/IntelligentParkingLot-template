<script setup lang="ts">
import { useI18n } from '@/utils/useI18n'
import Footer from './Footer.vue'
import Header from './Header.vue'
// eslint-disable-next-line unused-imports/no-unused-vars
const { t } = useI18n()
</script>

<template>
  <Header />
  <!-- 路由出口，用于显示页面内容 -->
  <div class="w-full" style="height: calc(100vh - 65px);">
    <slot>
      <!-- 默认内容或RouterView -->
    </slot>
  </div>
  <Footer />
</template>

<style scoped lang="scss"></style>
