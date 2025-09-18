<template>
  <div id="app">
    <div class="container">
      <a-tabs v-model:activeKey="activeTab" class="message-tabs" type="card" @change="tabChangeFun">
        <a-tab-pane key="reply" tab="回复消息">
          <div class="message-list">
            <div class="list-header">
              <h3>回复我的消息</h3>
              <a class="mark-all-read" @click="markAllAsRead('reply')">全部已读</a>
            </div>

            <div v-if="replyDataList.length === 0" class="empty-state">
              <a-empty description="暂无回复消息" />
            </div>

            <div v-else>
              <div v-for="msg in replyDataList" :key="msg.id" class="message-item" @click="handleMessageClick(msg)">
                <div class="message-content">
                  <div v-if="msg.messageState === '0'" class="badge-dot"></div>
                  <div class="avatar">
                    <a-avatar :src="msg.pictureCommentVo?.user?.userAvatar" />
                  </div>
                  <div class="message-info">
                    <div class="message-title">{{ msg.pictureCommentVo?.user?.userName }}: {{msg.pictureCommentVo?.content}}</div>
                    <div class="message-text">{{ msg.content }}</div>
                    <div class="message-time">{{ formatTime(msg.createTime) }}</div>
                  </div>
                </div>
              </div>
              <!-- 分页 -->
              <a-pagination
                style="text-align: left"
                v-model:current="replySearchParams.current"
                v-model:pageSize="replySearchParams.pageSize"
                :total="replyTotal"
                @change="onReplyPageChange"
              />
            </div>
          </div>
        </a-tab-pane>

        <a-tab-pane key="like" tab="点赞消息">
          <div class="message-list">
            <div class="list-header">
              <h3>点赞我的消息</h3>
              <a class="mark-all-read" @click="markAllAsRead('like')">全部已读</a>
            </div>

            <div v-if="thumbDataList.length === 0" class="empty-state">
              <a-empty description="暂无点赞消息" />
            </div>

            <div v-else>
              <div v-for="msg in thumbDataList" :key="msg.id" class="message-item" @click="handleMessageClick(msg)">
                <div class="message-content">
                  <div v-if="msg.messageState === '0'" class="badge-dot"></div>
                  <div class="avatar">
                    <a-avatar :src="msg.pictureCommentVo?.user?.userAvatar" />
                  </div>
                  <div class="message-info">
                    <div class="message-title">{{ msg.pictureCommentVo?.user?.userName }} 点赞了您的图片</div>
                    <div class="message-time">{{ formatTime(msg.createTime) }}</div>
                  </div>
                </div>
              </div>
              <!-- 分页 -->
              <a-pagination
                style="text-align: left"
                v-model:current="thumbSearchParams.current"
                v-model:pageSize="thumbSearchParams.pageSize"
                :total="thumbTotal"
                @change="onThumbPageChange"
              />
            </div>
          </div>
        </a-tab-pane>

        <a-tab-pane key="system" tab="系统消息">
          <div class="message-list">
            <div class="list-header">
              <h3>系统消息</h3>
              <a class="mark-all-read" @click="markAllAsRead('system')">全部已读</a>
            </div>

            <div v-if="systemDataList.length === 0" class="empty-state">
              <a-empty description="暂无系统消息" />
            </div>

            <div v-else>
              <div v-for="msg in systemDataList" :key="msg.id" class="message-item" @click="handleMessageClick(msg)">
                <div class="message-content">
                  <div v-if="msg.messageState === '0'" class="badge-dot"></div>
                  <div class="avatar" style="background-color: #722ed1;">
                    系
                  </div>
                  <div class="message-info">
                    <div class="message-text">{{ msg.content }}</div>
                    <div class="message-time">{{ formatTime(msg.createTime) }}</div>
                  </div>
                </div>
              </div>
              <!-- 分页 -->
              <a-pagination
                style="text-align: left"
                v-model:current="systemSearchParams.current"
                v-model:pageSize="systemSearchParams.pageSize"
                :total="systemTotal"
                @change="onSystemPageChange"
              />
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { allMessageRead, changeMessageStatus, listMessageVoByPage } from '@/api/messageController.ts'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import router from '@/router'

const activeTab = ref('reply');

const loginUserStore = useLoginUserStore()

const replySearchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 12,
  sortField: 'createTime',
  sortOrder: 'descend',
})

const replyTotal = ref(0)
const replyDataList = ref<API.MessageVo[]>([])

const thumbSearchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 12,
  sortField: 'createTime',
  sortOrder: 'descend',
})

const thumbTotal = ref(0)
const thumbDataList = ref<API.MessageVo[]>([])

const baseSearchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 12,
  sortField: 'createTime',
  sortOrder: 'descend',
})

const systemSearchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 12,
  sortField: 'createTime',
  sortOrder: 'descend',
})

const systemTotal = ref(0)
const systemDataList = ref<API.MessageVo[]>([])

// 分页参数
const onReplyPageChange = (page: number, pageSize: number) => {
  replySearchParams.current = page
  replySearchParams.pageSize = pageSize
  fetchData('reply', replySearchParams)
}

// 分页参数
const onThumbPageChange = (page: number, pageSize: number) => {
  thumbSearchParams.current = page
  thumbSearchParams.pageSize = pageSize
  fetchData('thumb', thumbSearchParams)
}

// 分页参数
const onSystemPageChange = (page: number, pageSize: number) => {
  systemSearchParams.current = page
  systemSearchParams.pageSize = pageSize
  fetchData('system', systemSearchParams)
}

const loading = ref(true)

const tabChangeFun = () => {
  fetchData(activeTab.value, baseSearchParams)
}

onMounted(() => {
  tabChangeFun()
})

const formatResTime = (resList: API.MessageVo[]) => {
  for(let i = 0; i<resList.length; i++){
    const d = resList[i]
    d.createTime = new Date(d.createTime.toString()).toISOString()
    resList[i] = d
  }
  return resList
}

const fetchData = async (messageType: string, searchParams: API.PictureQueryRequest) => {
  loading.value = true
  // 转换搜索参数
  const params = {
    ...searchParams,
    userId: loginUserStore.loginUser.id,
    messageType: messageType
  }
  const res = await listMessageVoByPage(params)
  if (res.data.code === 0 && res.data.data) {
    if(messageType === 'reply') {
      replyDataList.value = res.data.data.records ?? []
      replyTotal.value = res.data.data.total ?? 0
    }
    if(messageType === 'like') {
      thumbDataList.value = res.data.data.records ?? []
      thumbTotal.value = res.data.data.total ?? 0
    }
    if(messageType === 'system') {
      systemDataList.value = res.data.data.records ?? []
      systemTotal.value = res.data.data.total ?? 0
    }
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
  loading.value = false
}

// 标记单条消息为已读
const markAsRead = async (id) => {
  const params = {
    userId: loginUserStore.loginUser.id,
    messageId: id,
    messageStatus: '1',
  }
  try {
    const res = await changeMessageStatus(params)
    if (res.data.code === 0 && res.data.data) {

    } else {
    }
  }catch (e: any) {
    message.error('更新消息失败')
  }

};

const localMarkAllRead = (dataList: API.MessageVo[]) => {
  for(let i = 0; i<dataList.length; i++){
    const d = dataList[i]
    d.messageState = '1'
  }
}

// 标记当前标签页所有消息为已读
const markAllAsRead = async (messageType: string) => {
  const params = {
    userId: loginUserStore.loginUser.id,
    messageType: messageType,
  }
  try {
    const res = await allMessageRead(params)
    if (res.data.code === 0 && res.data.data) {
      if(messageType === 'reply') {
        localMarkAllRead(replyDataList.value)
      }else if(messageType === 'like') {
        localMarkAllRead(thumbDataList.value)
      }else if(messageType === 'system') {
        localMarkAllRead(systemDataList.value)
      }
      message.success('已标记所有消息为已读');
    } else {
      message.error('更新消息失败，' + res.data.message)
    }
  }catch (e: any) {
    message.error('更新消息失败')
  }

};

// 处理消息点击
const handleMessageClick = async (msg: API.MessageVo) => {
  // 标记为已读
  if (msg.messageState === '0') {
    msg.messageState = '1'
    await markAsRead(msg.id);
  }

  // 根据消息类型执行不同操作
  if (msg.messageType === 'reply' || msg.messageType === 'thumb') {
    // message.info(`跳转到图片详情页面: ${msg.id}`);
    router.push(`/picture/${msg.pictureId}`);
  }
};

// 格式化时间显示
const formatTime = (timeStr) => {
  const time = new Date(timeStr);
  const now = new Date();
  const diff = now - time;

  if (diff < 60000) { // 小于1分钟
    return '刚刚';
  } else if (diff < 3600000) { // 小于1小时
    return `${Math.floor(diff / 60000)}分钟前`;
  } else if (diff < 86400000) { // 小于1天
    return `${Math.floor(diff / 3600000)}小时前`;
  } else {
    return `${Math.floor(diff / 86400000)}天前`;
  }
};
</script>

<style scoped>
.container {


  padding: 20px;
  background: white;
  border-radius: 12px;
}

.header h1 {
  margin: 0;
  color: #2c3e50;
  font-weight: 600;
}
.message-tabs {
  margin-bottom: 24px;
}
.message-list {
  background: white;
  border-radius: 8px;
  padding: 16px;
}
.list-header {
  display: flex;
  max-width: 200px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.message-item {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s;
  border-radius: 6px;
  margin-bottom: 8px;
}
.message-item:hover {
  background-color: #f9fafb;
}
.message-content {
  display: flex;
  align-items: flex-start;
}
.badge-dot {
  width: 8px;
  height: 8px;
  background: #f5222d;
  border-radius: 50%;
  margin-right: 12px;
  margin-top: 8px;
  flex-shrink: 0;
}
.message-info {
  flex-grow: 1;
}
.message-title {
  font-weight: 500;
  margin-bottom: 6px;
  color: #1f2d3d;
}
.message-text {
  color: #5c6b7a;
  margin-bottom: 6px;
  line-height: 1.5;
}
.message-time {
  color: #97a8be;
  font-size: 12px;
}
.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #97a8be;
}
.mark-all-read {
  color: #1890ff;
  cursor: pointer;
  font-weight: 500;
}
.mark-all-read:hover {
  color: #40a9ff;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  flex-shrink: 0;
}
</style>
