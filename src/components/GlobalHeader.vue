<template>
  <div id="globalHeader">
    <a-row :wrap="false">
      <a-col flex="200px">
        <router-link to="/">
          <div class="title-bar">
            <img class="logo" src="../assets/favicon.ico" alt="logo" />
            <div class="title">云图智联</div>
          </div>
        </router-link>
      </a-col>
      <a-col flex="auto">
        <a-menu
          v-model:selectedKeys="current"
          mode="horizontal"
          :items="items"
          @click="doMenuClick"
        />
      </a-col>
      <!-- 用户信息展示栏 -->
      <a-col flex="180px">
        <div class="user-login-status">
          <div v-if="loginUserStore.loginUser.id" class="user-login">
            <a-space>
              <router-link to="/user/userMessage" class="icon-container" @click="unReadMessage=false">
                <div v-if="unReadMessage" class="badge-dot"></div>
                <MailOutlined class="message-icon" />
              </router-link>
              <a-dropdown>
                <a-space>
                  <a-avatar :src="loginUserStore.loginUser.userAvatar" />
                  {{ loginUserStore.loginUser.userName ?? '无名' }}
                </a-space>
                <template #overlay>
                  <a-menu>
                    <a-menu-item>
                      <router-link to="/my_space">
                        <UserOutlined />
                        我的空间
                      </router-link>
                    </a-menu-item>
                    <a-menu-item>
                      <router-link to="/user/dataInfo">
                        <FormOutlined />
                        个人资料
                      </router-link>
                    </a-menu-item>
                    <a-menu-item>
                      <router-link to="/user/scoreStore">
                        <ShoppingOutlined />
                        积分商城
                      </router-link>
                    </a-menu-item>
                    <a-menu-item @click="doLogout">
                      <LogoutOutlined />
                      退出登录
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </a-space>
          </div>
          <div v-else>
            <a-button type="primary" href="/user/login">登录</a-button>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts" setup>
import { computed, h, onMounted, onUnmounted, ref } from 'vue'
import {
  HomeOutlined,
  LogoutOutlined,
  UserOutlined,
  FormOutlined,
  ShoppingOutlined,
  MailOutlined,
} from '@ant-design/icons-vue'
import { MenuProps, message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { getExistUnReadMessage } from '@/api/messageController.ts'

const loginUserStore = useLoginUserStore()

// 未经过滤的菜单项
const originItems = [
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '主页',
    title: '主页',
  },
  {
    key: '/add_picture',
    label: '创建图片',
    title: '创建图片',
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
]

// 根据权限过滤菜单项
const filterMenus = (menus = [] as MenuProps['items']) => {
  return menus?.filter((menu) => {
    // 管理员才能看到 /admin 开头的菜单
    if (menu?.key?.startsWith('/admin')) {
      const loginUser = loginUserStore.loginUser
      if (!loginUser || loginUser.userRole !== 'admin') {
        return false
      }
    }
    return true
  })
}

// 展示在菜单的路由数组
const items = computed(() => filterMenus(originItems))

const router = useRouter()
// 当前要高亮的菜单项
const current = ref<string[]>([])
// 监听路由变化，更新高亮菜单项
router.afterEach((to, from, next) => {
  current.value = [to.path]
})

// 路由跳转事件
const doMenuClick = ({ key }) => {
  router.push({
    path: key,
  })
}

// 用户注销
const doLogout = () => {
  const token = localStorage.getItem('authToken')
  if (token) {
    localStorage.removeItem('authToken')
    message.success('退出登录成功')
    location.reload()
  } else {
    message.error('未登录')
  }
}

// 检查是否有未读信息
const unReadMessage = ref(false)
const intervalId = ref(null)
//
const fetchUserUnReadMessageData = async () => {
  const token = localStorage.getItem('authToken')
  if (!token) {
    return
  }
  const params = {
    userId: loginUserStore.loginUser.id,
  }

  try {
    const res = await getExistUnReadMessage(params)
    if (res.data.code === 0 && res.data.data != null) {
      unReadMessage.value = res.data.data
    } else {
    }
  } catch (e: any) {}
}

// 开始轮询
const startPolling = () => {
  // 立即执行一次请求
  fetchUserUnReadMessageData()
  // 设置定时器，每20秒执行一次
  intervalId.value = setInterval(fetchUserUnReadMessageData, 20000)
}

onMounted(() => {
  unReadMessage.value = false
  startPolling()
})

// 组件卸载时清除定时器
onUnmounted(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value)
  }
})
</script>

<style scoped>
#globalHeader .title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: black;
  font-size: 18px;
  margin-left: 16px;
}
.user-login {
}
.message-icon {
  display: flex;
  margin-right: 12px;
  margin-top: 2px;
  font-size: 22px; /* 调整大小 */
  color: rgba(0, 0, 0, 0.45); /* 调整颜色，使用灰色 */
}
.logo {
  height: 48px;
}
.icon-container {
  display: inline-block;
  position: relative;
  top: 6px;
}

.badge-dot {
  position: absolute;
  top: -5px;
  right: 0px;
  width: 12px;
  height: 12px;
  background: #f5222d;
  border-radius: 50%;
  border: 2px solid white;
  z-index: 1;
}

</style>
