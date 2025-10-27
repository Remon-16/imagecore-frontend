
<template>
  <div id="addScript">
    <h2 class="page-title">新建小说</h2>
    <div class="novel-form">
      <a-form
        :model="novelForm"
        name="novelForm"
        layout="vertical"
      >
        <a-form-item
          label="小说标题"
          name="name"
          :rules="[{ required: true, message: '请输入小说标题' }]"
        >
          <a-input v-model:value="novelForm.name" placeholder="请输入小说标题" />
        </a-form-item>
        <a-form-item name="category" label="分类">
          <a-auto-complete
            v-model:value="novelForm.category"
            placeholder="请输入分类"
            :options="categoryOptions"
            allow-clear
          />
        </a-form-item>
        <a-form-item name="tags" label="标签">
          <a-select
            v-model:value="novelForm.tags"
            mode="tags"
            placeholder="请输入标签"
            :options="tagOptions"
            allow-clear
          />
        </a-form-item>

<!--        <a-form-item-->
<!--          label="小说封面"-->
<!--          name="cover"-->
<!--        >-->
<!--          <a-upload-->
<!--            v-model:file-list="novelForm.coverFileList"-->
<!--            list-type="picture-card"-->
<!--            :before-upload="beforeUpload"-->
<!--            @preview="handlePreview"-->
<!--            :max-count="1"-->
<!--          >-->
<!--            <div v-if="novelForm.coverFileList.length < 1">-->
<!--              <plus-outlined />-->
<!--              <div style="margin-top: 8px">上传封面</div>-->
<!--            </div>-->
<!--          </a-upload>-->
<!--        </a-form-item>-->
        <a-form-item name="introduction" label="简介">
          <a-textarea
            v-model:value="novelForm.introduction"
            placeholder="请输入简介"
            :auto-size="{ minRows: 3, maxRows: 8 }"
            allow-clear
          />
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
import { computed, onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import { listPictureTagCategory } from '@/api/pictureController.ts'
import { addScreenplay } from '@/api/screenplayController.ts'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'

const novelForm = reactive({
  name: '',
  coverFileList: [],
  category: '',
  tags: [],
  introduction: '',
});


const router = useRouter()
const route = useRoute()
const loginUserStore = useLoginUserStore()

// 空间 id
const spaceId = computed(() => {
  return route.query?.spaceId
})

// 创建小说
const submitAddScript = async () => {
  if (!novelForm.name) {
    message.error('请输入小说标题');
    return;
  }

  // 创建新小说对象
  const params = {
    name: novelForm.name,
    category: novelForm.category,
    tags: novelForm.tags,
    introduction: novelForm.introduction,
    spaceId: spaceId.value,
    userId: loginUserStore.loginUser.id
  };

  const res = await addScreenplay(params)
  try {
    // 操作成功
    if (res.data.code === 0 && res.data.data) {
      message.success('创建剧本成功')
      // 跳转到编辑页面
      router.push({
        path: `/edit_script/${res.data.data.id}`,
      })
    } else {
      message.error('创建剧本失败，' + res.data.message)
    }
  } catch (e: any) {
    message.success('创建剧本失败！')
  }
  // 重置表单
  novelForm.name = '';
  novelForm.coverFileList = [];
  novelForm.tags = [];
  novelForm.category = '';
  novelForm.introduction = '';
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

// 标签和分类列表
const categoryOptions = ref<string[]>([])
const tagOptions = ref<string[]>([])

/**
 * 获取标签和分类选项
 * @param values
 */
const getTagCategoryOptions = async () => {
  const res = await listPictureTagCategory()
  if (res.data.code === 0 && res.data.data) {
    tagOptions.value = (res.data.data.tagList ?? []).map((data: string) => {
      return {
        value: data,
        label: data,
      }
    })
    categoryOptions.value = (res.data.data.categoryList ?? []).map((data: string) => {
      return {
        value: data,
        label: data,
      }
    })
  } else {
    message.error('获取标签分类列表失败，' + res.data.message)
  }
}

onMounted(() => {
  getTagCategoryOptions()
})

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
