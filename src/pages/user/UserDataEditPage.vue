<template>
  <div id="userDataEdit" class="container">
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
        <div class="input">{{ userID }}</div>
      </a-form-item>

      <a-form-item label="用户账号："  name="userAccount">
        <div class="input">{{ formState.userAccount }}</div>
      </a-form-item>

      <a-form-item label="用户昵称："  name="userName">
        <a-input
          v-model:value="formState.userName"
          placeholder="请输入用户昵称"
          class="input"
        />
      </a-form-item>

      <a-form-item label="用户简介：" name="userProfile">
        <a-textarea :rows="4" :maxlength="200"
          v-model:value="formState.userProfile"
          placeholder="请输入用户简介"
          class="input"
        />
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
import { updateUserInfo } from '@/api/userController.ts'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { message } from 'ant-design-vue'
import router from '@/router' // 用于接受表单输入的值


const loginUserStore = useLoginUserStore()
// 用于接受表单输入的值
const formState = reactive<API.UserUpdateRequest>({
  id: loginUserStore.loginUser.id,
  userAccount: loginUserStore.loginUser.userAccount,
  userName: loginUserStore.loginUser.userName,
  userProfile: loginUserStore.loginUser.userProfile,
})

const userID = ref(formState.id);
/**
 * 提交表单
 * @param values
 */
const handleSubmit = async (values: any) => {
  console.log(values)
  const res = await updateUserInfo(values)
  // 更新成功
  if (res.data.code === 0 && res.data.data) {
    await loginUserStore.fetchLoginUser()
    message.success('更新成功')
  } else {
    message.error('更新失败，' + res.data.message)
  }
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
</style>
