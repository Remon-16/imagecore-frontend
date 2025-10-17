import { defineStore } from 'pinia'
import { h } from 'vue'
import { HomeOutlined } from '@ant-design/icons-vue'

interface HeaderEntry {
  key: string
  label: string
  icon?: any
  title?: string
  action?: () => void
}

const entryMap: Record<string, HeaderEntry[]> = {
  'comment_space': [
    {
      key: '/',
      icon: () => h(HomeOutlined),
      label: '公共图库',
      title: '公共图库',
    },
    {
      key: '/add_picture',
      label: '互动空间',
      title: '互动空间',
    },
    {
      key: '/admin/userManage',
      label: '用户管理',
      title: '用户管理',
    },
    {
      key: '/admin/pictureManage',
      label: '图片管理',
      title: '图片管理',
    },
    {
      key: '/admin/spaceManage',
      label: '空间管理',
      title: '空间管理',
    },
  ],
  'user_space': [
    {
      key: '/my_space',
      label: '个人图库',
      title: '个人图库',
    },
    {
      key: '/add_picture',
      label: '剧本管理',
      title: '剧本管理',
    },
    {
      key: '/add_picture',
      label: '互动图库',
      title: '互动空间',
    },
  ],
  'team_space': [
    {
      key: '/space',
      label: '团队图库',
      title: '团队图库',
    },
    {
      key: '/add_picture',
      label: '剧本管理',
      title: '剧本管理',
    },
    {
      key: '/add_picture',
      label: '互动图库',
      title: '互动空间',
    },
  ]
}


export const useLayoutStore = defineStore('layout', {
  state: () => ({
    currentSidebarKey: 'comment_space',
    headerEntries: entryMap['comment_space'] as HeaderEntry[]
  }),

  actions: {
    setCurrentSidebar(key: string) {
      this.currentSidebarKey = key
      this.updateHeaderEntries(key)
      console.log(this.headerEntries)
    },

    updateHeaderEntries(sidebarKey: string) {
      // 根据侧边栏选择决定头部显示内容
      this.headerEntries = entryMap[sidebarKey] || []
    }
  }
})
