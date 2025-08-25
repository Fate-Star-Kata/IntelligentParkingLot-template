import type { MenuItem } from '@/types/components/header'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export const useOptionsStore = defineStore('options', () => {
  const { t } = useI18n()

  // 默认菜单项数据
  const defaultMenuItems = computed<MenuItem[]>(() => [
    {
      id: 'dashboard',
      label: t('menu.dashboard'),
      href: '/dashboard',
      icon: null,
      hide: true,
    },
    {
      id: 'system',
      label: t('menu.system'),
      icon: null,
      children: [
        {
          id: 'user-management',
          label: t('menu.userManagement'),
          href: '/system/users',
        },
        {
          id: 'role-management',
          label: t('menu.roleManagement'),
          href: '/system/roles',
        },
        {
          id: 'permission',
          label: t('menu.permission'),
          children: [
            {
              id: 'menu-permission',
              label: t('menu.menuPermission'),
              href: '/system/permission/menu',
            },
            {
              id: 'api-permission',
              label: t('menu.apiPermission'),
              href: '/system/permission/api',
              hide: true,
            },
          ],
        },
      ],
    },
    {
      id: 'content',
      label: t('menu.content'),
      icon: null,
      children: [
        {
          id: 'articles',
          label: t('menu.articles'),
          href: '/content/articles',
        },
        {
          id: 'categories',
          label: t('menu.categories'),
          href: '/content/categories',
        },
      ],
    },
    {
      id: 'settings',
      label: t('menu.settings'),
      href: '/settings',
      icon: null,
    },
    {
      id: 'admin',
      label: t('menu.admin'),
      href: '/admin',
      icon: null,
    },
  ])

  // 当前菜单项（可以被外部覆盖）
  const menuItems = ref<MenuItem[]>([])

  // 设置菜单项
  const setMenuItems = (items: MenuItem[]) => {
    menuItems.value = items
  }

  // 重置为默认菜单项
  const resetMenuItems = () => {
    menuItems.value = [...defaultMenuItems.value]
  }

  // 获取当前菜单项（如果为空则返回默认值）
  const getCurrentMenuItems = computed(() => {
    return menuItems.value.length > 0 ? menuItems.value : defaultMenuItems.value
  })

  return {
    defaultMenuItems,
    menuItems,
    setMenuItems,
    resetMenuItems,
    getCurrentMenuItems,
  }
}, {
  persist: true,
})
