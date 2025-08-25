<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import serverConfig from '@/configs'

const { t } = useI18n()
const website_name = serverConfig.website_name
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="modern-footer">
    <div class="footer-container">
      <div class="footer-content">
        <!-- 左侧：品牌信息 -->
        <div class="footer-brand">
          <h3 class="brand-name">{{ website_name }}</h3>
          <p class="brand-description">智能停车场管理系统</p>
        </div>

        <!-- 中间：快速链接 -->
        <div class="footer-links">
          <div class="link-group">
            <h4 class="link-title">产品</h4>
            <ul class="link-list">
              <li><a href="#" class="link-item">停车管理</a></li>
              <li><a href="#" class="link-item">用户服务</a></li>
              <li><a href="#" class="link-item">数据分析</a></li>
            </ul>
          </div>
          <div class="link-group">
            <h4 class="link-title">支持</h4>
            <ul class="link-list">
              <li><a href="#" class="link-item">帮助中心</a></li>
              <li><a href="#" class="link-item">联系我们</a></li>
              <li><a href="#" class="link-item">意见反馈</a></li>
            </ul>
          </div>
          <div class="link-group">
            <h4 class="link-title">关于</h4>
            <ul class="link-list">
              <li><a href="#" class="link-item">公司介绍</a></li>
              <li><a href="#" class="link-item">隐私政策</a></li>
              <li><a href="#" class="link-item">服务条款</a></li>
            </ul>
          </div>
        </div>

        <!-- 右侧：联系信息 -->
        <div class="footer-contact">
          <h4 class="contact-title">联系我们</h4>
          <div class="contact-info">
            <div class="contact-item">
              <span class="contact-icon">📧</span>
              <span class="contact-text">support@parking.com</span>
            </div>
            <div class="contact-item">
              <span class="contact-icon">📞</span>
              <span class="contact-text">400-123-4567</span>
            </div>
            <div class="contact-item">
              <span class="contact-icon">📍</span>
              <span class="contact-text">北京市朝阳区科技园</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部版权信息 -->
      <div class="footer-bottom">
        <div class="copyright">
          <p>&copy; {{ currentYear }} {{ website_name }}. 保留所有权利。</p>
        </div>
        <div class="footer-meta">
          <span class="meta-item">京ICP备12345678号</span>
          <span class="meta-divider">|</span>
          <span class="meta-item">京公网安备11010502012345号</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.modern-footer {
  background: rgb(var(--bg-elevated));
  border-top: 1px solid rgb(var(--border));
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1.5rem 1.5rem;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 3rem;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.brand-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgb(var(--text));
  margin: 0;
}

.brand-description {
  font-size: 0.875rem;
  color: rgb(var(--text-secondary));
  margin: 0;
  line-height: 1.5;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

@media (max-width: 768px) {
  .footer-links {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.link-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.link-title {
  font-size: 1rem;
  font-weight: 600;
  color: rgb(var(--text));
  margin: 0;
}

.link-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.link-item {
  color: rgb(var(--text-secondary));
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s ease;
}

.link-item:hover {
  color: rgb(var(--primary));
}

.footer-contact {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-title {
  font-size: 1rem;
  font-weight: 600;
  color: rgb(var(--text));
  margin: 0;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.contact-icon {
  font-size: 1rem;
  width: 1.25rem;
  text-align: center;
}

.contact-text {
  color: rgb(var(--text-secondary));
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  border-top: 1px solid rgb(var(--border));
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}

.copyright {
  color: rgb(var(--text-secondary));
}

.copyright p {
  margin: 0;
}

.footer-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgb(var(--text-secondary));
}

.meta-item {
  font-size: 0.75rem;
}

.meta-divider {
  color: rgb(var(--border));
}
</style>
