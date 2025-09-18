<template>
  <div id="app" class="container">
    <div class="header">
      <a-button type="primary" ghost size="middle" :icon="h(PictureOutlined)" @click="showModal = true">AI生图</a-button>
    </div>

    <!-- 模态窗口 -->
    <div class="modal-mask" v-if="showModal">
      <div class="modal-container" ref="modal" :style="modalStyle">
        <div class="modal-header" @mousedown="startDrag">
          <div class="modal-title">AI生图</div>
          <div class="modal-close" @click="showModal = false">
            <CloseOutlined />
          </div>
        </div>
        <div class="modal-body">
          <!-- 左侧图像生成区域 -->
          <div class="image-generation">
            <a-space class="image-preview">
              <img v-if="generatedImage" :src="generatedImage" alt="Generated Image">
              <span v-if="!generatedImage && !genLoading">生成图像展示区域</span>
              <a-spin  :spinning="genLoading"  tip="生成中..."></a-spin>
            </a-space>
            <div class="prompt-editor">
              <div class="editor-row">
                <a-button style="background-color: #13C2C2; border-color: #13C2C2; color: white;"
                          :icon="h(AlertOutlined)"
                          @click="changeShowChat">文字描述优化</a-button>
              </div>
              <div class="editor-row">
                <a-textarea
                  v-model:value="promptText"
                  placeholder="请输入图像描述..."
                  :rows="4"
                />
              </div>
              <div class="editor-row">
                <a-button type="primary" @click="generateImage">图像生成</a-button>
              </div>
            </div>
          </div>

          <!-- 右侧聊天区域 -->
          <div class="chat-optimization" v-if="showChat">
            <div class="chat-header">
              文字描述优化
            </div>
            <div class="chat-container">
              <div class="conversation-list" >
                <div
                  v-for="(chatHis, index) in chatHistories"
                  :key="index"
                  class="conversation-item"
                  :class="{ active: currentConversation === index }"
                  @click="selectConversation(index)"
                >
                  {{ chatHis.name }}
                </div>
                <a-spin  :spinning="isLoading"  tip="加载中..."></a-spin>
              </div>
              <div class="message-panel">
                <div class="message-list" ref="messageList">
                  <div class="load-more" v-if="hasMoreMessages" @click="loadMoreMessages">
                    加载更多消息
                  </div>
                  <div
                    v-for="(msg, index) in currentMessages"
                    :key="index"
                    class="message"
                    :class="{ user: msg.type === 'sent' }"
                  >
                    <div class="message-avatar">
                      {{ msg.type === 'sent' ? '用' : 'AI' }}
                    </div>
                    <div class="message-content">
                      {{ msg.content }}
                    </div>
                  </div>
                </div>
                <div class="message-input">
                  <div class="prompt-editor-input-row">
                    <a-textarea
                      v-model:value="chatMessage"
                      placeholder="输入消息..."
                      :rows="2"
                      @pressEnter="sendMessage"
                    />
                  </div>
                  <div class="prompt-editor-input-row">
                    <a-button type="primary" style="margin-top: 8px;" @click="sendMessage">发送</a-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="resize-handle" @mousedown="startResize"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, h, computed, onMounted, nextTick, watch } from 'vue'
import { message } from 'ant-design-vue'
import { PictureOutlined, CloseOutlined, AlertOutlined } from '@ant-design/icons-vue'
import { doChat, getAllUserChatHis, getChatHisVoPage, getNewChatId } from '@/api/userAiChatController.ts'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { createPictureByText, getText2ImageTask } from '@/api/pictureController.ts'

const showModal = ref(false);
const showChat = ref(false);
const promptText = ref('');
const generatedImage = ref('');
const chatMessage = ref('');

const changeShowChat = () => {
  showChat.value = !showChat.value;

  if(showChat.value){
    modalStyle.value.width = parseInt(modalStyle.value.width) + 500 + 'px';
    getAllHistories()
  }else{
    modalStyle.value.width = parseInt(modalStyle.value.width) - 500 + 'px';
    chatHistories.value = []
    chatHistories.value.push({
      name: '新对话',
      messages: [],
      chatId: '',
      hasMore: false,
    })
  }
}

// 模态窗口位置和尺寸
const modal = ref(null);
const modalStyle = ref({
  width: '1000px',
  height: '900px',
  top: '0px',
  left: '0px'
});

// 拖拽相关变量
const isDragging = ref(false);
let dragStartX = 0;
let dragStartY = 0;
let initialModalLeft = 0;
let initialModalTop = 0;

// 调整大小相关变量
const isResizing = ref(false);
const initialWidth = ref(0);
const initialHeight = ref(0);
const initialMouseX = ref(0);
const initialMouseY = ref(0);
const windowSize = ref({ width: 200, height: 100 })

const genLoading = ref(false);


const currentConversation = ref(0);
const currentMessages = ref([]);
const hasMoreMessages = ref(false);
const messageList = ref(null);
const isLoading = ref(false)

const loginUserStore = useLoginUserStore()

const chatHistories = ref([])
chatHistories.value.push({
  name: '新对话',
  messages: [],
  chatId: '',
  hasMore: false,
})


const addMessage = (message, type) => {
  currentMessages.value.push({
    type: type,
    content: message,
    time: Date.now().toString(),
  })
}

const sendMessage = async () => {
  addMessage(chatMessage.value, 'sent')
  let chatId = chatHistories.value[currentConversation.value].chatId
  if (!chatId) {
    const p = {
      chatType: 'DRAW',
    }
    try {
      const res = await getNewChatId(p)
      if (res.data.code === 0 && res.data.data != null) {
        chatId = res.data.data
        chatHistories.value[currentConversation.value].chatId = chatId
      } else {
        message.error('消息处理失败')
        return
      }
    } catch (e: any) {
      message.error('消息处理失败')
      return
    }
  }

  let msg = chatMessage.value
  const params = {
    chatId: chatId,
    userMessage: msg,
    chatType: 'DRAW',
  }
  chatMessage.value = ''

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

  // 滚动到底部
  nextTick(() => {
    if (messageList.value) {
      messageList.value.scrollTop = messageList.value.scrollHeight;
    }
  });
}

const getAllHistories = async () => {
  isLoading.value = true
  const params = {
    userId: loginUserStore.loginUser.id,
    chatType: 'DRAW',
    current: 1,
    pageSize: 30,
    sortField: 'createTime',
    sortOrder: 'descend',
  }
  try {
    const res = await getAllUserChatHis(params)
    if (res.data.code === 0 && res.data.data) {
      let dtList = res.data.data
      for (let i = 0; i < dtList.length; i++) {
        let innerList = dtList[i].chatHisList?.records
        let hasMore = innerList.length === params.pageSize
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
          hasMore: hasMore,
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


// 初始化当前消息
currentMessages.value = chatHistories.value[0].messages;

// 选择会话
const selectConversation = (id) => {
  currentConversation.value = id;
  currentMessages.value = chatHistories.value[id].messages;
  hasMoreMessages.value =  chatHistories.value[id].hasMore;
};

// 加载更多消息
const loadMoreMessages = async () => {
  // 模拟加载更多消息
  const newMessages = [];

  const params = {
    userId: loginUserStore.loginUser.id,
    chatId: chatHistories.value[currentConversation.value].chatId,
    chatType: 'DRAW',
    current: 1,
    pageSize: 30,
    sortField: 'createTime',
    sortOrder: 'descend',
  }
  try {
    const res = await getChatHisVoPage(params)
    if (res.data.code === 0 && res.data.data) {
      let dtList = res.data.data
      for (let i = 0; i < dtList.length; i++) {
        let innerList = dtList[i].chatHisList?.records
        let hasMore = innerList.length === params.pageSize
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
          hasMore: hasMore,
        })
      }
    } else {
      message.success('拉取聊天记录失败，' + res.data.message)
    }
  } catch (e: any) {
    message.success('拉取聊天记录失败！')
  }



  currentMessages.value = [...newMessages, ...currentMessages.value];
  hasMoreMessages.value = false;

  // 滚动到加载的消息位置
  nextTick(() => {
    if (messageList.value) {
      const loadMoreElement = messageList.value.querySelector('.load-more');
      if (loadMoreElement) {
        messageList.value.scrollTop = loadMoreElement.offsetHeight + 10;
      }
    }
  });
};

// 任务 id
const taskId = ref<string>()

/**
 * 创建任务
 */
const generateImage = async () => {
  if (!promptText.value.trim()) {
    message.warning('请输入图像描述');
    return;
  }
  if(genLoading.value){
    message.warning('图像正在生成中，请不要重复提交');
    return;
  }
  const params = {
    // 根据需要设置扩图参数
    input: {
      prompt: promptText.value,
    },
  }
  promptText.value = ''
  genLoading.value = true
  // message.success('创建任务成功，请耐心等待，不要退出界面')
  // setTimeout(() => {
  //   // 使用随机图片作为生成结果
  //   genLoading.value = false
  //   message.success('绘图完成')
  // }, 3500);
  const res = await createPictureByText(params)
  if (res.data.code === 0 && res.data.data) {
    message.success('创建任务成功，请耐心等待，不要退出界面')
    console.log(res.data.data.output.taskId)
    taskId.value = res.data.data.output.taskId
    // 开启轮询
    startPolling()
  } else {
    message.error('图片任务失败，' + res.data.message)
    genLoading.value = false
  }
}

// 轮询定时器
let pollingTimer: NodeJS.Timeout = null

// 开始轮询
const startPolling = () => {
  if (!taskId.value) {
    return
  }

  pollingTimer = setInterval(async () => {
    try {
      const res = await getText2ImageTask({
        taskId: taskId.value,
      })
      if (res.data.code === 0 && res.data.data) {
        const taskResult = res.data.data.output
        if (taskResult.taskStatus === 'SUCCEEDED') {
          message.success('AI绘图任务执行成功')
          generatedImage.value = taskResult.results[0].url
          // 清理轮询
          clearPolling()
        } else if (taskResult.taskStatus === 'FAILED') {
          message.error('AI绘图任务执行失败')
          // 清理轮询
          clearPolling()
        }
      }
    } catch (error) {
      console.error('AI绘图任务轮询失败', error)
      message.error('AI绘图任务轮询失败，' + error.message)
      // 清理轮询
      clearPolling()
    }
  }, 3000) // 每 3 秒轮询一次
}

// 清理轮询
const clearPolling = () => {
  if (pollingTimer) {
    clearInterval(pollingTimer)
    pollingTimer = null
    taskId.value = null
  }
  genLoading.value = false
}

// 开始拖拽
const startDrag = (e) => {
  isDragging.value = true;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  initialModalLeft = parseInt(modalStyle.value.left);
  initialModalTop = parseInt(modalStyle.value.top);

  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
};

// 拖拽中
const onDrag = (e) => {
  if (!isDragging.value) return;

  const deltaX = e.clientX - dragStartX;
  const deltaY = e.clientY - dragStartY;

  modalStyle.value.left = `${initialModalLeft + deltaX}px`;
  modalStyle.value.top = `${initialModalTop + deltaY}px`;
};

// 停止拖拽
const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
};

// 开始调整大小
const startResize = (e) => {
  e.preventDefault()
  isResizing.value = true;
  initialWidth.value = parseInt(modalStyle.value.width);
  initialHeight.value = parseInt(modalStyle.value.height);
  initialMouseX.value = e.clientX;
  initialMouseY.value = e.clientY;
  // const chatWindow = document.querySelector('.modal-mask')
  windowSize.value = {
    width: initialWidth.value,
    height: initialHeight.value,
  }

  document.addEventListener('mousemove', onResize);
  document.addEventListener('mouseup', stopResize);
};

// 调整大小中
const onResize = (e) => {
  if (!isResizing.value) return;

  const deltaX = e.clientX - initialMouseX.value;
  const deltaY = e.clientY - initialMouseY.value;

  modalStyle.value.width = windowSize.value.width + deltaX + 'px';
  modalStyle.value.height = windowSize.value.height + deltaY + 'px';
};

// 停止调整大小
const stopResize = () => {
  isResizing.value = false;
  document.removeEventListener('mousemove', onResize);
  document.removeEventListener('mouseup', stopResize);
};

// 监听聊天窗口显示/隐藏
watch(showChat, (newVal) => {
  if (newVal) {
    // 确保消息列表滚动到底部
    nextTick(() => {
      if (messageList.value) {
        messageList.value.scrollTop = messageList.value.scrollHeight;
      }
    });
  }
});

</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}
.header {
  text-align: center;
}
/* 模态窗口样式 */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-container {
  position: relative;
  width: 80%;
  height: 70%;
  min-width: 800px;
  min-height: 500px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.modal-header {
  padding: 16px;
  background: #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: move;
  border-bottom: 1px solid #d9d9d9;
}
.modal-title {
  font-weight: 500;
  color: #262626;
}
.modal-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s;
}
.modal-close:hover {
  color: #1890ff;
}
.modal-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}
.resize-handle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 15px;
  height: 15px;
  cursor: nwse-resize;
  z-index: 1002;
}

/* 左侧图像生成区域 */
.image-generation {
  width: 60%;
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 16px;
  border-right: 1px solid #f0f0f0;
}
.image-preview {
  flex: 1;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  overflow: hidden;
}
.image-preview img {
  max-width: 100%;
  max-height: 100%;
}
.prompt-editor {
  display: flex;
  flex-direction: column;
}

.editor-row {
  display: flex;
  margin-bottom: 12px;
  align-items: center;
}
.editor-row:first-child {
  justify-content: flex-end;
}
.editor-row:last-child {
  margin-bottom: 0;
  justify-content: flex-end;
}

/* 右侧聊天区域 */
.chat-optimization {
  width: 40%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.chat-header {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  font-weight: 500;
}
.chat-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}
.conversation-list {
  width: 100px;
  border-right: 1px solid #f0f0f0;
  overflow-y: auto;
}
.conversation-item {
  padding: 12px 8px;
  text-align: center;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
}
.conversation-item.active {
  background: #e6f7ff;
}
.message-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.message-list {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #f9f9f9;
}
.load-more {
  text-align: center;
  padding: 8px;
  color: #1890ff;
  cursor: pointer;
  background: #f0f0f0;
  margin-bottom: 8px;
  border-radius: 4px;
}
.message {
  margin-bottom: 16px;
  display: flex;
}
.message.user {
  flex-direction: row-reverse;
}
.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #1890ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 0 8px;
}
.message-content {
  max-width: 70%;
  padding: 8px 12px;
  border-radius: 4px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.message.user .message-content {
  background: #e6f7ff;
}
.message-input {
  padding: 16px;
  border-top: 1px solid #f0f0f0;
}
.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  text-align: right;
}

.prompt-editor-input-row {
  display: flex;
  margin-bottom: 12px;
  align-items: center;
}
.prompt-editor-input-row:last-child {
  margin-bottom: 0;
  justify-content: flex-end;
}
</style>
