
<template>
  <div id="addScript">
    <h2 class="page-title">新建小说</h2>
    <div class="novel-form">
      <a-form
        :model="novelForm"
        name="novelForm"
        @finish="onCreateNovel"
        layout="vertical"
      >
        <a-form-item
          label="小说标题"
          name="title"
          :rules="[{ required: true, message: '请输入小说标题' }]"
        >
          <a-input v-model:value="novelForm.title" placeholder="请输入小说标题" />
        </a-form-item>

        <a-form-item
          label="小说封面"
          name="cover"
        >
          <a-upload
            v-model:file-list="novelForm.coverFileList"
            list-type="picture-card"
            :before-upload="beforeUpload"
            @preview="handlePreview"
            :max-count="1"
          >
            <div v-if="novelForm.coverFileList.length < 1">
              <plus-outlined />
              <div style="margin-top: 8px">上传封面</div>
            </div>
          </a-upload>
        </a-form-item>

        <a-form-item
          label="标签"
          name="tags"
        >
          <a-select
            v-model:value="novelForm.tags"
            mode="tags"
            style="width: 100%"
            placeholder="请选择或输入标签"
            :options="tagOptions"
          ></a-select>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" @click="submitAddScript" block>创建小说</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
// 新建小说表单
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'

const novelForm = reactive({
  title: '',
  coverFileList: [],
  tags: []
});

// 标签选项
const tagOptions = ref([
  { value: '玄幻' },
  { value: '仙侠' },
  { value: '都市' },
  { value: '言情' },
  { value: '科幻' },
  { value: '悬疑' },
  { value: '历史' },
  { value: '武侠' }
]);
const router = useRouter()
const submitAddScript = () => {
  router.push({
    path: "/edit_script",
  })
}

// 创建小说
const onCreateNovel = () => {
  if (!novelForm.title) {
    message.error('请输入小说标题');
    return;
  }

  // 创建新小说对象
  const newNovel = {
    id: Date.now().toString(),
    title: novelForm.title,
    cover: novelForm.coverFileList.length > 0 ? novelForm.coverFileList[0] : null,
    tags: novelForm.tags,
    createTime: new Date()
  };

  // 保存到本地存储
  const novels = JSON.parse(localStorage.getItem('novels') || '[]');
  novels.push(newNovel);
  localStorage.setItem('novels', JSON.stringify(novels));

  // 重置表单
  novelForm.title = '';
  novelForm.coverFileList = [];
  novelForm.tags = [];

  message.success('小说创建成功！');
};

// 上传前处理
const beforeUpload = (file) => {
  // 这里可以添加文件类型和大小验证
  return false; // 阻止自动上传，我们只使用文件列表
};

// 预览图片
const handlePreview = (file) => {
  // 实现图片预览逻辑
};

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
