<template>
  <div id="AICustomer">
    <!-- 客服按钮 -->
    <div class="customer-service-button" @click="openChatWindow">
      <CustomerServiceOutlined :style="{ fontSize: '24px' }" />
    </div>

    <!-- 覆盖层 -->
    <div class="overlay" v-if="chatVisible" @click="closeChatWindow"></div>

    <!-- 聊天窗口 -->
    <div
      class="chat-window"
      v-if="chatVisible"
      :style="{ left: windowPosition.x + 'px', top: windowPosition.y + 'px', transform: 'none' }"
      @mousedown="bringToFront"
    >
      <div class="chat-header" @mousedown="startDrag">
        <div class="chat-title">
          <CustomerServiceOutlined />
          <span>云图智联-客服中心</span>
        </div>
        <div class="chat-actions">
          <CloseOutlined class="chat-action-btn" @click="closeChatWindow" />
        </div>
      </div>
      <div class="chat-body">
        <div class="chat-history">
          <div
            class="history-item"
            :class="{ active: index === activeHistory }"
            v-for="(history, index) in chatHistories"
            :key="index"
            @click="switchChat(index)"
          >
            <span>{{ history.name }}</span>
          </div>
          <a-spin  :spinning="isLoading"  tip="加载中..."></a-spin>
        </div>
        <div class="chat-main">
          <div class="messages-container">
            <div
              v-for="(message, index) in currentMessages"
              :key="index"
              :class="['message', message.type === 'received' ? 'received' : 'sent']"
            >
              {{ message.content }}
            </div>
          </div>
          <div class="message-input">
            <div class="input-with-button">
              <a-input
                placeholder="输入消息..."
                v-model:value="newMessage"
                @pressEnter="sendMessage"
              />
              <a-button type="primary" @click="sendMessage">发送</a-button>
            </div>
          </div>
        </div>
      </div>
      <div class="resize-handle" @mousedown="startResize"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { CloseOutlined, CustomerServiceOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { doChat, getAllUserChatHis, getNewChatId } from '@/api/userAiChatController.ts'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'

const chatVisible = ref(false)
const activeHistory = ref(0)
const newMessage = ref('')
const windowPosition = ref({ x: 0, y: 0 })
const isDragging = ref(false)
const isResizing = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const windowSize = ref({ width: 700, height: 500 })
const zIndex = ref(1001)

const formartDate = (date) => {
  // 格式化为 YYYY-MM-DD HH:mm:ss
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

const chatHistories = ref([])
chatHistories.value.push({
  name: '新对话',
  messages: [],
  chatId: '',
})
const currentMessages = computed(() => {
  return chatHistories.value[activeHistory.value].messages
})

const isLoading = ref(false)

const loginUserStore = useLoginUserStore()

const addMessage = (message, type) => {
  currentMessages.value.push({
    type: type,
    content: message,
    time: Date.now().toString(),
  })
}

const getAllHistories = async () => {
  isLoading.value = true
  const params = {
    userId: loginUserStore.loginUser.id,
    chatType: 'CS',
    current: 1,
    pageSize: 12,
    sortField: 'createTime',
    sortOrder: 'descend',
  }
  try {
    const res = await getAllUserChatHis(params)
    if (res.data.code === 0 && res.data.data) {
      let dtList = res.data.data
      for (let i = 0; i < dtList.length; i++) {
        let innerList = dtList[i].chatHisList?.records
        let name = innerList[0]?.chatContent.length > 10 ? innerList[0]?.chatContent.substring(0, 10) + '…' : innerList[0]?.chatContent
        let messages = []
        let chatId = dtList[i].chatId
        for (let j = 0; j < innerList.length; j++) {
          messages.push({
            type: innerList[j]?.chatType === 'USER' ? 'sent' : 'received',
            content: innerList[j]?.chatContent,
            time: formartDate(new Date(innerList[j]?.createTime)),
          })
        }
        chatHistories.value.push({
          name: name,
          messages: messages,
          chatId: chatId,
        })
      }
    } else {
      message.success('拉取聊天记录失败，' + res.data.message)
    }
  } catch (e: any) {
    message.success('拉取聊天记录失败！')
  }
  isLoading.value = false
}

const sendMessage = async () => {
  addMessage(newMessage.value, 'sent')
  let chatId = chatHistories.value[activeHistory.value].chatId
  if (!chatId) {
    const p = {
      chatType: 'CS',
    }
    try {
      const res = await getNewChatId(p)
      if (res.data.code === 0 && res.data.data != null) {
        chatId = res.data.data
        chatHistories.value[activeHistory.value].chatId = chatId
      } else {
        message.error('消息处理失败')
        return
      }
    } catch (e: any) {
      message.error('消息处理失败')
      return
    }
  }

  let msg = newMessage.value
  const params = {
    chatId: chatId,
    userMessage: msg,
    chatType: 'CS',
  }
  newMessage.value = ''

  try {
    const res = await doChat(params)
    if (res.data.code === 0 && res.data.data != null) {
      const result = res.data.data
      const now = new Date()
      const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`
      currentMessages.value.push({
        type: 'received',
        content: result,
        time: time,
      })
    } else {
      message.error('消息处理失败，' + res.data.message)
    }
  } catch (e: any) {
    message.error('消息处理失败')
  }
}

// 发送消息 SSE
// const sendMessage = () => {
//   addMessage(newMessage.value, 'sent')
//
//   let eventSource: EventSource | null = null
//   let streamCompleted = false
//
//   try {
//     // 获取 axios 配置的 baseURL
//     const baseURL = ''
//
//     // 构建URL参数
//     const params = new URLSearchParams({
//       chatId: chatId,
//       userMessage: newMessage.value,
//       chatType: 'CS'
//     })
//
//     const url = `${baseURL}/ai_chat/chat/sse?${params}`
//
//     // 创建 EventSource 连接
//     eventSource = new EventSource(url, {
//       withCredentials: true,
//     })
//
//     let fullContent = ''
//     const now = new Date();
//     const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
//
//     // 处理接收到的消息
//     eventSource.onmessage = function (event) {
//       if (streamCompleted) return
//
//       try {
//         // 解析JSON包装的数据
//         // const parsed = JSON.parse(event.data)
//         const content = event.data
//         let result = ''
//         let cru_index = 0
//         // 拼接内容
//         if (content !== undefined && content !== null) {
//           fullContent += content
//           if(result === '') {
//             result = fullContent
//             currentMessages.value.push({
//               type: 'received',
//               content: result,
//               time: time
//             });
//             cru_index = currentMessages.value.length - 1
//           }else {
//             currentMessages.value[cru_index].content = fullContent
//           }
//
//         }
//       } catch (error) {
//         console.error('解析消息失败:', error)
//       }
//     }
//
//     // 处理done事件
//     eventSource.addEventListener('done', function () {
//       if (streamCompleted) return
//
//       streamCompleted = true
//       eventSource?.close()
//     })
//
//     // 处理business-error事件（后端限流等错误）
//     eventSource.addEventListener('business-error', function (event: MessageEvent) {
//       if (streamCompleted) return
//
//       try {
//         const errorData = JSON.parse(event.data)
//         console.error('SSE业务错误事件:', errorData)
//
//         // 显示具体的错误信息
//         const errorMessage = errorData.message || '生成过程中出现错误'
//         currentMessages.value[currentMessages.value.length - 1].content = `❌ ${errorMessage}`
//         message.error(errorMessage)
//
//         streamCompleted = true
//         isGenerating.value = false
//         eventSource?.close()
//       } catch (parseError) {
//         console.error('解析错误事件失败:', parseError, '原始数据:', event.data)
//         handleError(new Error('服务器返回错误'), 0)
//       }
//     })
//
//     // 处理错误
//     eventSource.onerror = function () {
//       if (streamCompleted || !isGenerating.value) return
//       // 检查是否是正常的连接关闭
//       if (eventSource?.readyState === EventSource.CONNECTING) {
//         streamCompleted = true
//         isGenerating.value = false
//         eventSource?.close()
//
//         // setTimeout(async () => {
//         //   await fetchAppInfo()
//         //   updatePreview()
//         // }, 1000)
//       } else {
//         handleError(new Error('SSE连接错误'), 0)
//       }
//     }
//   } catch (error) {
//     console.error('创建 EventSource 失败：', error)
//     handleError(error, 0)
//   }
// }

const openChatWindow = () => {
  //  登录才可以使用客服
  const token = localStorage.getItem('authToken')
  if (!token) {
    message.error('请先登录，再使用客服')
    return
  }
  chatVisible.value = true
  // 加载历史消息
  getAllHistories()
  // 居中窗口
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  windowPosition.value = {
    x: (windowWidth - 700) / 2,
    y: (windowHeight - 500) / 2,
  }
}

const closeChatWindow = () => {
  chatVisible.value = false
  chatHistories.value = []
  chatHistories.value.push({
    name: '新对话',
    messages: [],
    chatId: '',
  })
}

const switchChat = (index) => {
  activeHistory.value = index
}

const startDrag = (e) => {
  isDragging.value = true
  dragStart.value = {
    x: e.clientX - windowPosition.value.x,
    y: e.clientY - windowPosition.value.y,
  }
}

const doDrag = (e) => {
  if (isDragging.value) {
    windowPosition.value = {
      x: e.clientX - dragStart.value.x,
      y: e.clientY - dragStart.value.y,
    }
  }
}

const stopDrag = () => {
  isDragging.value = false
}

const startResize = (e) => {
  e.preventDefault()
  isResizing.value = true
  dragStart.value = {
    x: e.clientX,
    y: e.clientY,
  }
  const chatWindow = document.querySelector('.chat-window')
  windowSize.value = {
    width: chatWindow.offsetWidth,
    height: chatWindow.offsetHeight,
  }
}

const doResize = (e) => {
  if (isResizing.value) {
    const deltaX = e.clientX - dragStart.value.x
    const deltaY = e.clientY - dragStart.value.y

    const chatWindow = document.querySelector('.chat-window')
    chatWindow.style.width = windowSize.value.width + deltaX + 'px'
    chatWindow.style.height = windowSize.value.height + deltaY + 'px'
  }
}

const stopResize = () => {
  isResizing.value = false
}

const bringToFront = () => {
  zIndex.value += 1
  document.querySelector('.chat-window').style.zIndex = zIndex.value
}

onMounted(() => {
  window.addEventListener('mousemove', (e) => {
    doDrag(e)
    doResize(e)
  })
  window.addEventListener('mouseup', () => {
    stopDrag()
    stopResize()
  })
})

onUnmounted(() => {
  window.removeEventListener('mousemove', doDrag)
  window.removeEventListener('mousemove', doResize)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('mouseup', stopResize)
})
</script>

<style scoped>
/* 客服按钮样式 */
.customer-service-button {
  position: fixed;
  right: 30px;
  bottom: 30px;
  z-index: 1000;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #1890ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
}

.customer-service-button:hover {
  background-color: #40a9ff;
  transform: scale(1.05);
}

/* 聊天窗口样式 */
.chat-window {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 700px;
  height: 500px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  z-index: 1001;
  overflow: hidden;
  resize: both;
}

.chat-header {
  padding: 16px;
  background-color: #1890ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: move;
  user-select: none;
}

.chat-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chat-actions {
  display: flex;
  gap: 12px;
}

.chat-action-btn {
  color: white;
  cursor: pointer;
  font-size: 16px;
  transition: color 0.3s;
}

.chat-action-btn:hover {
  color: #e6f7ff;
}

.chat-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.chat-history {
  width: 150px;
  border-right: 1px solid #f0f0f0;
  overflow-y: auto;
  background-color: #f9f9f9;
}

.history-item {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.history-item:hover {
  background-color: #e6f7ff;
}

.history-item.active {
  background-color: #e6f7ff;
  border-right: 2px solid #1890ff;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.messages-container {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: #fafafa;
}

.message {
  max-width: 75%;
  padding: 12px 16px;
  border-radius: 8px;
  position: relative;
}

.message.received {
  align-self: flex-start;
  background-color: white;
  border: 1px solid #e8e8e8;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.message.sent {
  align-self: flex-end;
  background-color: #1890ff;
  color: white;
  box-shadow: 0 2px 6px rgba(24, 144, 255, 0.3);
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  text-align: right;
}

.message-input {
  padding: 16px;
  border-top: 1px solid #f0f0f0;
  background-color: white;
}

/* 拖动和调整大小的样式 */
.resize-handle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 15px;
  height: 15px;
  cursor: nwse-resize;
  z-index: 1002;
}

/* 覆盖层 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.45);
  z-index: 1000;
}

/* 消息输入框样式 */
.input-with-button {
  display: flex;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-window {
    width: 90% !important;
    height: 70% !important;
    left: 5% !important;
    top: 15% !important;
    transform: none;
    resize: none;
  }

  .chat-history {
    width: 100px;
  }

  .message {
    max-width: 85%;
  }
}
</style>
