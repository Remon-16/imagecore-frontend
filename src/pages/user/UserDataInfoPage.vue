<template>
  <div id="userDataInfo" class="container">
    <!-- 上传组件 -->
    <div class="avatar-upload-container">
      <a-upload
        name="avatar"
        list-type="picture-card"
        class="avatar-uploader"
        :show-upload-list="false"
        :before-upload="beforeUpload"
        @change="handleChange"
        :custom-request="handleUpload"
      >
        <!-- 头像显示区域 -->
        <div class="avatar-wrapper">
          <a-avatar :src="loginUserStore.loginUser.userAvatar" class="avatar-image" />
          <div class="camera-overlay">
            <CameraOutlined />
          </div>
        </div>
      </a-upload>
    </div>
    <!-- 表单区域 -->
    <a-form
      :model="formState"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      name="basic"
      autocomplete="off"
      @finish="handleSubmit"
      class="form"
    >
      <a-form-item label="用户ID：" name="id">
        <div class="input">{{ formState.id }}</div>
      </a-form-item>

      <a-form-item label="用户账号："  name="userAccount">
        <div class="input">{{ formState.userAccount }}</div>
      </a-form-item>

      <a-form-item label="用户昵称："  name="userName">
        <div class="input">{{ formState.userName }}</div>
      </a-form-item>

      <a-form-item label="用户积分："  name="userScore">
        <div class="input">{{ formState.userScore }}</div>
      </a-form-item>

      <a-form-item label="注册时间："  name="createTime">
        <div class="input">{{ formState.createTime }}</div>
      </a-form-item>

      <a-form-item label="会员类型："  name="vipType">
        <div class="input">{{ formState.vipType }}</div>
      </a-form-item>

      <a-form-item label="会员到期时间："  name="vipType">
        <div class="input">{{ formState.vipExpiry }}</div>
      </a-form-item>

      <a-form-item label="用户简介：" name="userProfile">
        <div class="input">{{ formState.userProfile }}</div>
      </a-form-item>

      <a-form-item class="button-container">
        <a-button
          type="primary"
          html-type="submit"
          class="submit-button"
        >
          编辑资料
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { message } from 'ant-design-vue'
import router from '@/router'
import { getUserVoById, updateUser, updateUserAvatar } from '@/api/userController.ts' // 用于接受表单输入的值
import type { UploadProps } from 'ant-design-vue'
import { CameraOutlined } from '@ant-design/icons-vue'


const loginUserStore = useLoginUserStore()

// 用于接受表单输入的值
const formState = reactive<API.UserVO>({
  id: 0,
  userName: '',
  userAccount:'',
  userScore: 0,
  createTime: '',
  vipType: '',
  vipExpiry: '',
  userProfile: '',
})

// 获取图片详情
const fetchUserDetail = async () => {
  try {
    const res = await getUserVoById({
      id: loginUserStore.loginUser.id,
    })
    if (res.data.code === 0 && res.data.data) {
      formState.id = res.data.data.id
      const createTime = res.data.data.createTime
      const date = new Date(createTime)
      formState.createTime = date.toISOString().split('T')[0];
      formState.userAccount = res.data.data.userAccount
      formState.userAvatar = res.data.data.userAvatar
      formState.userScore = res.data.data.userScore
      formState.vipExpiry = res.data.data.vipExpiry
      formState.vipType = res.data.data.vipType == "0"? "普通用户": "会员"
      formState.userProfile = res.data.data.userProfile
      formState.userName = res.data.data.userName
    } else {
      message.error('获取用户信息失败，' + res.data.message)
    }
  } catch (e: any) {
    message.error('获取用户信息失败：' + e.message)
  }
}

onMounted(() => {
  fetchUserDetail()
})

// 处理上传变化
const handleChange = (info) => {
  // if (info.file.status === 'uploading') {
  //   return;
  // }
  // if (info.file.status === 'done') {
  //   // 获取上传图片的预览URL
  //   getBase64(info.file.originFileObj, (url) => {
  //     imageUrl.value = url;
  //   });
  // }
  // if (info.file.status === 'error') {
  //   message.error(`${info.file.name} 上传失败`);
  // }
};

/**
 * 上传图片
 * @param file
 */
const handleUpload = async ({ file }: any) => {
  loading.value = true
  try {
    const params: API.updateUserAvatarParams =  {}
    const res = await updateUserAvatar(params, {}, file)
    if (res.data.code === 0 && res.data.data) {
      message.success('头像上传成功')
    } else {
      message.error('头像上传失败，' + res.data.message)
    }
  } catch (error) {
    console.error('头像上传失败', error)
    message.error('头像上传失败，' + error.message)
  }
  loading.value = false
}

const loading = ref<boolean>(false)

/**
 * 上传前的校验
 * @param file
 */
const beforeUpload = (file: UploadProps['fileList'][number]) => {
  // 校验图片格式
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('不支持上传该格式的图片，推荐 jpg 或 png')
  }
  // 校验图片大小
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('不能上传超过 2M 的图片')
  }
  return isJpgOrPng && isLt2M
}

const userID = ref(formState.id);
/**
 * 提交表单
 * @param values
 */
const handleSubmit = async (values: any) => {
  router.push('/user/dataEdit')
}
</script>

<style scoped>
/* 整体容器样式 */
.container {
  max-width: 400px; /* 控制整体最大宽度 */
  margin: 0 auto; /* 居中显示 */
  padding: 20px;
}

/* 头像区域样式 */
.header {
  margin-bottom: 24px;
}
.avatar-container {
  display: flex;
  justify-content: center; /* 头像居中 */
  width: 100%;
}

/* 表单样式 */
.form {
  width: 100%;
}

/* 输入框样式 */
.input {
  width: 100%; /* 宽度自适应容器 */
  max-width: 400px; /* 最大宽度限制 */
  margin: 0 auto; /* 居中 */
  display: block;
}

/* 按钮容器 */
.button-container {
  display: flex;
  justify-content: center; /* 按钮居中 */
  margin-top: 24px;
}

/* 提交按钮 */
.submit-button {
  width: 200px; /* 固定按钮宽度 */
  max-width: 100%; /* 响应式限制 */
}

.avatar-upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.avatar-uploader :deep(.ant-upload-select) {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: none !important;
  transition: border-color 0.3s;
}

.avatar-uploader :deep(.ant-upload-select:hover) {
  border: none !important;

}

.avatar-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.camera-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s;
  border-radius: 50%;
}

.avatar-wrapper:hover .camera-overlay {
  opacity: 1;
}

.camera-icon {
  font-size: 24px;
  color: white;
}

.avatar-placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: #999;
  transition: color 0.3s;
  cursor: pointer;
}

.avatar-uploader :deep(.ant-upload-select:hover) .avatar-placeholder {
  color: #1890ff;
  border: none !important;
}

.avatar-upload-text {
  margin-top: 8px;
  font-size: 12px;
}

.upload-tips {
  color: #999;
  font-size: 12px;
  text-align: center;
}
</style>
