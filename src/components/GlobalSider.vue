<template>
  <div id="globalSider">
    <a-layout-sider
      v-if="loginUserStore.loginUser.id"
      width="200"
      breakpoint="lg"
      collapsed-width="0"
    >
      <a-menu
        v-model:selectedKeys="current"
        mode="inline"
        :items="menuItems"
        @click="handleMenuClick"
      />
    </a-layout-sider>
  </div>
</template>
<script lang="ts" setup>
import { computed, h, ref, watchEffect } from 'vue'
import { PictureOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { SPACE_TYPE_ENUM } from '@/constants/space.ts'
import { listMyTeamSpace } from '@/api/spaceUserController.ts'
import { message } from 'ant-design-vue'
import { useLayoutStore } from '@/stores/layoutStore.ts'

const loginUserStore = useLoginUserStore()

// 固定的菜单列表
const fixedMenuItems = [
  {
    key: 'comment_space',
    icon: () => h(PictureOutlined),
    label: '公共图库',
  },
  {
    key: 'user_space',
    label: '我的空间',
    icon: () => h(UserOutlined),
  },
  {
    key: '/add_space?type=' + SPACE_TYPE_ENUM.TEAM,
    label: '创建团队',
    icon: () => h(TeamOutlined),
  },
]

const router = useRouter()

const layoutStore = useLayoutStore()
// 当前要高亮的菜单项
const current = ref<string[]>(['comment_space'])

const handleMenuClick = ({ key }: { key: string }) => {
  if(key.startsWith("/add_space") || key.startsWith("/space")) {
    layoutStore.setCurrentSidebar('comment_space')
    router.push(key)
  }else{
    layoutStore.setCurrentSidebar(key)
    if(layoutStore.headerEntries.length > 0){
      router.push(layoutStore.headerEntries[0].key)
    }else {
      message.error('跳转错误，请联系管理员')
    }
  }
}

const teamSpaceList = ref<API.SpaceUserVO[]>([])
const menuItems = computed(() => {
  // 如果用户没有团队空间，则只展示固定菜单
  if (teamSpaceList.value.length < 1) {
    return fixedMenuItems
  }
  // 如果用户有团队空间，则展示固定菜单和团队空间菜单
  // 展示团队空间分组
  const teamSpaceSubMenus = teamSpaceList.value.map((spaceUser) => {
    const space = spaceUser.space
    return {
      key: '/space/' + spaceUser.spaceId,
      label: space?.spaceName,
    }
  })
  const teamSpaceMenuGroup = {
    type: 'group',
    label: '我的团队',
    key: 'teamSpace',
    children: teamSpaceSubMenus,
  }
  return [...fixedMenuItems, teamSpaceMenuGroup]
})

// 加载团队空间列表
const fetchTeamSpaceList = async () => {
  const res = await listMyTeamSpace()
  if (res.data.code === 0 && res.data.data) {
    teamSpaceList.value = res.data.data
  } else {
    message.error('加载我的团队空间失败，' + res.data.message)
  }
}

/**
 * 监听变量，改变时触发数据的重新加载
 */
watchEffect(() => {
  // 登录才加载
  if (loginUserStore.loginUser.id) {
    fetchTeamSpaceList()
  }
})

// const current = ref<string[]>([])
// // 监听路由变化，更新高亮菜单项
// router.afterEach((to, from, next) => {
//   current.value = [to.path]
// })

// // 路由跳转事件
// const doMenuClick = ({ key }) => {
//   router.push(key)
// }
</script>

<style scoped>
#globalSider .ant-layout-sider {
  background: none;
}
</style>
