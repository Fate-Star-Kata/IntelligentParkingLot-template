<script setup lang="ts">
import type { MenuItem } from '@/types/components/header'
import { inject } from 'vue'

interface Props {
  menuItems: MenuItem[]
}

defineProps<Props>()
// 注入菜单状态管理函数
const isMenuExpanded = inject<(id: string) => boolean>('isMenuExpanded')!
const toggleSubmenu = inject<(id: string) => void>('toggleSubmenu')!
</script>

<template>
  <div class="modern-menu">
    <template v-for="item in menuItems" :key="item.id">
      <!-- 无子菜单的项目 -->
      <div v-if="!item.children" v-show="!item.hide" class="menu-item">
        <RouterLink :to="item.href as string" class="menu-link">
          <span v-if="typeof item.icon === 'string'" v-text="item.icon" class="menu-icon" />
          <component v-else-if="item.icon !== null" :is="item.icon" class="menu-icon" />
          <span class="menu-label">{{ item.label }}</span>
        </RouterLink>
      </div>
      
      <!-- 有子菜单的项目 -->
      <div v-else v-show="!item.hide" class="menu-item menu-item-expandable">
        <button 
          class="menu-toggle" 
          :class="{ 'menu-toggle-expanded': isMenuExpanded(item.id) }"
          @click="toggleSubmenu(item.id)"
        >
          <span v-if="typeof item.icon === 'string'" v-text="item.icon" class="menu-icon" />
          <component v-else-if="item.icon !== null" :is="item.icon" class="menu-icon" />
          <span class="menu-label">{{ item.label }}</span>
          <svg class="menu-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="6,9 12,15 18,9"/>
          </svg>
        </button>
        
        <Transition name="submenu">
          <div v-show="isMenuExpanded(item.id)" class="submenu">
            <template v-for="child in item.children" :key="child.id">
              <!-- 二级菜单无子项 -->
              <div v-if="!child.children" v-show="!child.hide" class="submenu-item">
                <RouterLink :to="child.href as string" class="submenu-link">
                  <span class="submenu-label">{{ child.label }}</span>
                </RouterLink>
              </div>
              
              <!-- 二级菜单有子项 -->
              <div v-else v-show="!child.hide" class="submenu-item submenu-item-expandable">
                <button 
                  class="submenu-toggle"
                  :class="{ 'submenu-toggle-expanded': isMenuExpanded(child.id) }"
                  @click="toggleSubmenu(child.id)"
                >
                  <span class="submenu-label">{{ child.label }}</span>
                  <svg class="submenu-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6,9 12,15 18,9"/>
                  </svg>
                </button>
                
                <Transition name="sub-submenu">
                  <div v-show="isMenuExpanded(child.id)" class="sub-submenu">
                    <div v-for="grandchild in child.children" :key="grandchild.id" v-show="!grandchild.hide" class="sub-submenu-item">
                      <RouterLink :to="grandchild.href as string" class="sub-submenu-link">
                        <span class="sub-submenu-label">{{ grandchild.label }}</span>
                      </RouterLink>
                    </div>
                  </div>
                </Transition>
              </div>
            </template>
          </div>
        </Transition>
      </div>
    </template>
  </div>
</template>

<style scoped>
.modern-menu {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.menu-item {
  position: relative;
}

.menu-link,
.menu-toggle {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  text-decoration: none;
  color: rgb(var(--text));
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;
}

.menu-link:hover,
.menu-toggle:hover {
  background: rgb(var(--bg-muted));
  color: rgb(var(--primary));
}

.menu-link.router-link-active {
  background: rgb(var(--primary) / 0.1);
  color: rgb(var(--primary));
  font-weight: 600;
}

.menu-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.75rem;
  color: rgb(var(--text-secondary));
  flex-shrink: 0;
}

.menu-link.router-link-active .menu-icon {
  color: rgb(var(--primary));
}

.menu-label {
  flex: 1;
  text-align: left;
}

.menu-arrow {
  width: 1rem;
  height: 1rem;
  margin-left: 0.5rem;
  color: rgb(var(--text-secondary));
  transition: transform 0.2s ease;
  stroke-width: 2;
}

.menu-toggle-expanded .menu-arrow {
  transform: rotate(180deg);
}

.submenu {
  margin-left: 1.5rem;
  margin-top: 0.25rem;
  padding-left: 1rem;
  border-left: 2px solid rgb(var(--border));
}

.submenu-item {
  margin-bottom: 0.125rem;
}

.submenu-link,
.submenu-toggle {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
  text-decoration: none;
  color: rgb(var(--text-secondary));
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.8125rem;
  font-weight: 400;
}

.submenu-link:hover,
.submenu-toggle:hover {
  background: rgb(var(--bg-muted));
  color: rgb(var(--text));
}

.submenu-link.router-link-active {
  background: rgb(var(--primary) / 0.1);
  color: rgb(var(--primary));
  font-weight: 500;
}

.submenu-label {
  flex: 1;
  text-align: left;
}

.submenu-arrow {
  width: 0.875rem;
  height: 0.875rem;
  margin-left: 0.5rem;
  color: rgb(var(--text-secondary));
  transition: transform 0.2s ease;
  stroke-width: 2;
}

.submenu-toggle-expanded .submenu-arrow {
  transform: rotate(180deg);
}

.sub-submenu {
  margin-left: 1rem;
  margin-top: 0.25rem;
  padding-left: 0.75rem;
  border-left: 1px solid rgb(var(--border));
}

.sub-submenu-item {
  margin-bottom: 0.125rem;
}

.sub-submenu-link {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.375rem 0.5rem;
  border-radius: var(--radius-sm);
  text-decoration: none;
  color: rgb(var(--text-secondary));
  background: transparent;
  transition: all 0.2s ease;
  font-size: 0.75rem;
  font-weight: 400;
}

.sub-submenu-link:hover {
  background: rgb(var(--bg-muted));
  color: rgb(var(--text));
}

.sub-submenu-link.router-link-active {
  background: rgb(var(--primary) / 0.1);
  color: rgb(var(--primary));
  font-weight: 500;
}

.sub-submenu-label {
  flex: 1;
  text-align: left;
}

/* 动画效果 */
.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-0.5rem);
}

.submenu-enter-to,
.submenu-leave-from {
  opacity: 1;
  max-height: 20rem;
  transform: translateY(0);
}

.sub-submenu-enter-active,
.sub-submenu-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.sub-submenu-enter-from,
.sub-submenu-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-0.25rem);
}

.sub-submenu-enter-to,
.sub-submenu-leave-from {
  opacity: 1;
  max-height: 15rem;
  transform: translateY(0);
}

/* 禁用动画的用户偏好 */
@media (prefers-reduced-motion: reduce) {
  .submenu-enter-active,
  .submenu-leave-active,
  .sub-submenu-enter-active,
  .sub-submenu-leave-active {
    transition: none;
  }
  
  .menu-arrow,
  .submenu-arrow {
    transition: none;
  }
}
</style>
