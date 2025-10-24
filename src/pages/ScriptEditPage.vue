<template>
  <h2 class="page-title">小说编辑</h2>

  <div v-if="!currentNovel" class="empty-state">
    <div class="empty-state-icon">📚</div>
    <h3>请选择要编辑的小说</h3>
    <p>您还没有选择任何小说进行编辑</p>
  </div>

  <div v-else class="editor-container">
    <!-- 左侧编辑区 -->
    <div class="editor-left">
      <div class="editor-header">
        <span v-if="currentChapter">{{ currentChapter.title }}</span>
        <span v-else>请选择或创建章节</span>
        <a-button type="primary" @click="saveContent" :disabled="!currentChapter">保存</a-button>
      </div>
      <div class="editor-content">
              <textarea
                v-if="currentChapter"
                v-model="currentChapter.content"
                class="text-editor"
                placeholder="开始编写您的小说内容..."
              ></textarea>
        <div v-else class="empty-state">
          <div class="empty-state-icon">📝</div>
          <h3>请选择或创建章节</h3>
          <p>在右侧选择或创建一个章节开始编辑</p>
        </div>
      </div>
    </div>

    <!-- 右侧章节区 -->
    <div class="editor-right">
      <div class="editor-header">
        <span>章节列表</span>
        <a-button type="primary" @click="showAddChapterModal">新建章节</a-button>
      </div>
      <div class="chapters-list">
        <div
          v-for="chapter in chapters"
          :key="chapter.id"
          :class="['chapter-item', { active: currentChapter && currentChapter.id === chapter.id }]"
          @click="selectChapter(chapter)"
        >
          <div class="chapter-title">{{ chapter.title }}</div>
          <div class="chapter-update-time">{{ formatTime(chapter.updateTime) }}</div>
        </div>
        <div v-if="chapters.length === 0" class="empty-state">
          <div class="empty-state-icon">📖</div>
          <p>暂无章节</p>
        </div>
      </div>
      <div class="editor-header">
        <a-button class="ai-writing-btn" type="dashed" block>AI写作</a-button>
      </div>
    </div>
  </div>



  <!-- 添加章节模态框 -->
  <a-modal
    v-model:visible="addChapterModalVisible"
    title="新建章节"
    @ok="addChapter"
    @cancel="addChapterModalVisible = false"
  >
    <a-form :model="newChapterForm" layout="vertical">
      <a-form-item label="章节标题" :rules="[{ required: true, message: '请输入章节标题' }]">
        <a-input v-model:value="newChapterForm.title" placeholder="请输入章节标题" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">

// 当前编辑的小说
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'

const currentNovel = ref(null);

const props = defineProps<Props>()

// 章节列表
const chapters = ref([]);

// 当前选中的章节
const currentChapter = ref(null);

// 添加章节模态框
const addChapterModalVisible = ref(false);
const newChapterForm = reactive({
  title: ''
});

// 加载小说数据
const loadNovels = () => {
  
};

// 加载章节数据
const loadChapters = () => {
  if (!currentNovel.value) return;

  const allChapters = JSON.parse(localStorage.getItem('chapters') || '{}');
  const novelChapters = allChapters[currentNovel.value.id] || [];
  chapters.value = novelChapters;

  if (novelChapters.length > 0 && !currentChapter.value) {
    currentChapter.value = novelChapters[0];
  }
};

// 显示添加章节模态框
const showAddChapterModal = () => {
  newChapterForm.title = '';
  addChapterModalVisible.value = true;
};

// 添加新章节
const addChapter = () => {
  if (!newChapterForm.title) {
    message.error('请输入章节标题');
    return;
  }

  const newChapter = {
    id: Date.now().toString(),
    title: newChapterForm.title,
    content: '',
    createTime: new Date(),
    updateTime: new Date()
  };

  // 保存章节到本地存储
  const allChapters = JSON.parse(localStorage.getItem('chapters') || '{}');
  if (!allChapters[currentNovel.value.id]) {
    allChapters[currentNovel.value.id] = [];
  }
  allChapters[currentNovel.value.id].push(newChapter);
  localStorage.setItem('chapters', JSON.stringify(allChapters));

  // 更新章节列表和当前章节
  chapters.value = allChapters[currentNovel.value.id];
  currentChapter.value = newChapter;

  // 关闭模态框
  addChapterModalVisible.value = false;
  message.success('章节创建成功！');
};

// 选择章节
const selectChapter = (chapter) => {
  currentChapter.value = chapter;
};

// 保存内容
const saveContent = () => {
  if (!currentChapter.value) return;

  // // 更新章节的更新时间
  // currentChapter.value.updateTime = new Date();

  // 保存到本地存储
  const allChapters = JSON.parse(localStorage.getItem('chapters') || '{}');
  const chapterIndex = allChapters[currentNovel.value.id].findIndex(
    chapter => chapter.id === currentChapter.value.id
  );

  if (chapterIndex !== -1) {
    allChapters[currentNovel.value.id][chapterIndex] = currentChapter.value;
    localStorage.setItem('chapters', JSON.stringify(allChapters));
    message.success('保存成功！');
  }
};

// 格式化时间
const formatTime = (time) => {
  const date = new Date(time);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

// 组件挂载时加载数据
onMounted(() => {
  loadNovels();
});
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e8e8e8;
}
.logo {
  font-size: 24px;
  font-weight: bold;
  color: #1890ff;
}
.page-title {
  font-size: 20px;
  margin-bottom: 20px;
}
.novel-form {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.editor-container {
  display: flex;
  gap: 20px;
  height: calc(100vh - 150px);
}
.editor-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
.editor-right {
  width: 300px;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
.editor-header {
  padding: 16px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.editor-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}
.text-editor {
  width: 100%;
  height: 100%;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding: 12px;
  font-family: inherit;
  font-size: 14px;
  resize: none;
}
.chapters-list {
  flex: 1;
  overflow-y: auto;
}
.chapter-item {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s;
}
.chapter-item:hover {
  background-color: #f5f5f5;
}
.chapter-item.active {
  background-color: #e6f7ff;
  border-left: 3px solid #1890ff;
}
.chapter-title {
  font-weight: 500;
}
.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 20px;
  text-align: center;
  color: #999;
}
.empty-state-icon {
  font-size: 48px;
  margin-bottom: 16px;
  color: #d9d9d9;
}
.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
.ai-writing-btn {
  margin-top: 10px;
  width: 100%;
}
</style>
