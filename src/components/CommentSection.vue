<template>
  <!-- 评论区 -->
  <div class="comment-section">
    <div class="comment-header">评论区</div>

    <!-- 回复框 -->
    <div class="comment-editor">
      <div class="editor-container">
        <a-textarea
          v-model:value="newCommentContent"
          placeholder="写下您的评论..."
          :rows="3"
          allow-clear
        />
        <div style="margin-top: 12px; text-align: right">
          <a-button type="primary" :disabled="!newCommentContent.trim()" @click="submitRootComment">
            发表评论
          </a-button>
        </div>
      </div>
    </div>

    <!-- 评论列表 -->
    <div class="comment-list">
      <div v-if="rootComments.length === 0" class="empty-state">
        <a-empty description="暂无评论" />
      </div>

      <div v-else>
        <div v-for="comment in rootComments" :key="comment.id" class="comment-item">
          <a-space>
            <a-avatar :src="comment.userAvatar" />
            <span class="comment-author">{{ comment.userName }}</span>
          </a-space>
          <div class="comment-content">{{ comment.content }}</div>

          <div class="comment-actions">
            <!-- 显示回复数量，点击可展开/折叠 v-if="comment.replyCount > 0" 查看${comment.replyCount}条回复 -->
            <a-space>
              <span class="comment-time">{{ formatTime(comment.createTime) }}</span>
              <a-button
                type="link"
                class="replies-count"
                v-if="comment.hasRelateComments"
                @click="toggleReplies(comment)"
              >
                {{ comment.repliesVisible ? '收起回复' : `查看相关回复` }}
              </a-button>
              <a-button
                v-if="comment.id"
                shape="circle"
                size="small"
                :icon="h(MessageOutlined)"
                style="border: none"
                @click="toggleReplyEditor(comment, comment, false)"
              />
              <a-button
                v-if="comment.userId === loginUserStore.loginUser.id && comment.id"
                shape="circle"
                size="small"
                :icon="h(EditOutlined)"
                style="border: none"
                @click="toggleReplyEditor(comment, comment, true)"
              />
              <a-button
                v-if="comment.userId === loginUserStore.loginUser.id && comment.id"
                shape="circle"
                size="small"
                :icon="h(ClearOutlined)"
                style="border: none"
                @click="deleteCommentFun(comment)"
              />
            </a-space>
          </div>

          <!-- 回复编辑器 -->
          <div v-if="comment.showReplyEditor" class="reply-editor">
            <a-textarea
              v-model:value="replyEditor.replyContent"
              :placeholder="replyEditor.replyTipText"
              :rows="2"
              allow-clear
            />
            <div style="margin-top: 8px; text-align: right">
              <a-button
                type="primary"
                size="small"
                :disabled="!replyEditor.replyContent.trim()"
                @click="submitReply(replyEditor)"
              >
                发表回复
              </a-button>
            </div>
          </div>

          <!-- 回复列表 - 默认折叠 -->
          <div
            v-if="
              comment.repliesVisible &&
              comment.pictureCommentVos &&
              comment.pictureCommentVos.length > 0
            "
            class="reply-list"
          >
            <div v-for="reply in comment.pictureCommentVos" :key="reply.id" class="comment-item">
              <a-space>
                <a-avatar :src="reply.userAvatar" />
                <span class="comment-author">{{ reply.userName }}</span>
              </a-space>
              <div v-if="!reply.secondTargetId">
                <div class="comment-content">{{ reply.content }}</div>
              </div>
              <div v-else>
                <div class="comment-content">
                  <a>@{{ reply.targetUserName }}</a
                  >：{{ reply.content }}
                </div>
              </div>
              <a-space>
                <span class="comment-time">{{ formatTime(reply.createTime) }}</span>
                <a-button
                  v-if="reply.id"
                  shape="circle"
                  size="small"
                  :icon="h(MessageOutlined)"
                  style="border: none"
                  @click="toggleReplyEditor(reply, comment, false)"
                />
                <a-button
                  v-if="reply.userId === loginUserStore.loginUser.id && reply.id"
                  shape="circle"
                  size="small"
                  :icon="h(EditOutlined)"
                  style="border: none"
                  @click="toggleReplyEditor(reply, comment, true)"
                />
                <a-button
                  v-if="reply.userId === loginUserStore.loginUser.id && reply.id"
                  shape="circle"
                  size="small"
                  :icon="h(ClearOutlined)"
                  style="border: none"
                  @click="deleteCommentFun(reply)"
                />
              </a-space>
            </div>
            <!-- 分页 -->
            <a-pagination
              style="text-align: left"
              v-model:current="comment.secondCurrent"
              v-model:pageSize="comment.secondPageSize"
              :total="comment.secondTotal"
              @change="loadMoreReplies(comment)"
            />
          </div>
        </div>

        <!-- 加载更多评论 -->
        <div v-if="hasMoreRootComments" class="load-more">
          <a-button type="link" :loading="loadingMoreRootComments" @click="loadMoreRootComments">
            加载更多评论
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  deleteComment,
  getPictureCommentRootVo,
  getPictureCommentVo,
  saveOrUpdatePictureComment
} from '@/api/pictureCommentController.ts'
import { h, onMounted, reactive, ref } from 'vue'
import { EditOutlined, MessageOutlined, ClearOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { userRegister } from '@/api/userController.ts'
import router from '@/router'


const props = defineProps({
  objectId: {
    type: [Number, String],
    required: true
  },
});

const loginUserStore = useLoginUserStore()

const loadingComment = ref(true)
// 搜索条件
const searchParams = reactive<API.PictureCommentQueryRequest>({
  current: 1,
  pageSize: 10,
})

// 二级评论区的搜索条件
const secondSearchParams = reactive<API.PictureCommentQueryRequest>({
  current: 1,
  pageSize: 10,
})


const replyEditor = ref({
  id: '',
  targetId: '',
  replyContent: '',
  replyTipText: '',
  commentUserId: '',
  isEdit: false,
  secondComment: { },
  targetUserName: '',
})

// 新评论内容
const newCommentContent = ref('');

// 根评论列表
const rootComments = ref([]);

// 分页相关状态
const rootCommentPage = ref(1);
const rootCommentPageSize = ref(5);
const hasMoreRootComments = ref(true);
const loadingMoreRootComments = ref(false);

// 模拟获取评论数据
const fetchRootComments = async (page, pageSize) => {
  const rootCommentList = [];
  // 转换搜索参数
  const params = {
    current: page,
    pageSize: searchParams.pageSize,
    pictureId: props.objectId,
    sortOrder: "ascend"
  }
  try {
    const res = await getPictureCommentRootVo(
      params
    )
    if (res.data.code === 0 && res.data.data) {
      const resCommentList = res.data.data.records
      hasMoreRootComments.value = resCommentList.length == searchParams.pageSize;
      for (let i = 0; i < res.data.data.records.length; i++) {
        let tempComment = resCommentList[i]
        // 二级评论
        let temp2CommentList = []
        for(let j = 0; j < tempComment.pictureCommentVos?.records?.length; j++) {
          let tempCommentVo = tempComment.pictureCommentVos.records[j];
          temp2CommentList.push({
            id: tempCommentVo.id,
            userId: tempCommentVo.userId,
            userName: tempCommentVo.user.userName,
            userAvatar: tempCommentVo.user.userAvatar,
            pictureId: tempCommentVo.pictureId,
            content: tempCommentVo.content,
            targetId: tempCommentVo.targetId,
            targetUserId: tempCommentVo.targetUserId,
            targetUserName: tempCommentVo.targetUserName,
            secondTargetId: tempCommentVo.secondTargetId,
            createTime: new Date(tempCommentVo.createTime.toString()).toISOString(),
            hasMoreReplies: false
          })
        }
        // 一级评论
        rootCommentList.push({
          id: tempComment.id,
          userId: tempComment.userId,
          userName: tempComment.user.userName,
          userAvatar: tempComment.user.userAvatar,
          pictureId: tempComment.pictureId,
          content: tempComment.content,
          createTime: new Date(tempComment.createTime.toString()).toISOString(),
          pictureCommentVos: temp2CommentList,
          secondTotal: tempComment.pictureCommentVos?.total,
          secondCurrent: 1,
          secondPageSize: 10,
          hasRelateComments: tempComment.pictureCommentVos?.records.length > 0,
          showReplyEditor: false,
          showReply: false,
          replyContent: '',
          replyPage: 1,
          replyPageSize: 3,
          hasMoreReplies: temp2CommentList.length == searchParams.pageSize,
          replyLoading: false
        })
      }
    } else {
      message.error('获取评论失败，' + res.data.message)
    }
  } catch (e: any) {
    message.error('获取评论：' + e.message)
  }

  return {
    list: rootCommentList,
    total: rootCommentList.length,
    page: page,
    pageSize: pageSize
  };
};

// 模拟获取回复数据
const fetchReplies = async (rootCommentId, page, pageSize) => {

  const params = {
    pictureId: props.objectId,
    targetId: rootCommentId,
    current: page,
    pageSize: searchParams.pageSize,
    sortOrder: "ascend"
  }
  // 模拟返回数据
  const resultList = [];
  let total = 0;
  try {
    const res = await getPictureCommentVo(
      params
    )
    if (res.data.code === 0 && res.data.data) {
      const resCommentList = res.data.data.records
      total = res.data.data.total
      for(let j = 0; j < resCommentList.length; j++) {
        let tempCommentVo = resCommentList[j];
        resultList.push({
          id: tempCommentVo.id,
          userId: tempCommentVo.userId,
          userName: tempCommentVo.user.userName,
          userAvatar: tempCommentVo.user.userAvatar,
          pictureId: tempCommentVo.pictureId,
          content: tempCommentVo.content,
          targetId: tempCommentVo.targetId,
          targetUserId: tempCommentVo.targetUserId,
          targetUserName: tempCommentVo.targetUserName,
          secondTargetId: tempCommentVo.secondTargetId,
          createTime: new Date(tempCommentVo.createTime.toString()).toISOString(),
          hasMoreReplies: false
        })
      }
    } else {
      message.error('获取评论失败，' + res.data.message)
    }
  } catch (e: any) {
    message.error('获取评论：' + e.message)
  }

  return {
    list: resultList,
    total: total,
    page: page,
    pageSize: pageSize
  };
};
// 切换回复编辑器显示
const toggleReplyEditor = (comment, secondComment, isEdite: boolean) => {
  secondComment.showReplyEditor = !secondComment.showReplyEditor;
  // 如果打开回复编辑器，同时展开回复列表
  if (secondComment.showReplyEditor && !comment.repliesVisible) {
    comment.repliesVisible = true;
  }
  replyEditor.value.replyTipText = '回复@' + comment.userName +':'
  replyEditor.value.id = comment.id;
  replyEditor.value.targetId = comment.targetId;
  replyEditor.value.isEdit = isEdite;
  replyEditor.value.secondComment = secondComment;
  replyEditor.value.targetUserName = comment.userName;
  if(isEdite){
    replyEditor.value.replyContent = comment.content;
    replyEditor.value.commentUserId = comment.userId;
  }
};

// 切换回复列表的展开/折叠
const toggleReplies = (comment) => {
  comment.repliesVisible = !comment.repliesVisible;
  // 如果展开回复列表且还没有加载过回复，则加载回复
  if (comment.repliesVisible && comment.pictureCommentVos.length === 0) {
    loadReplies(comment);
  }
};

// 加载回复
const loadReplies = async (comment) => {
  comment.replyLoading = true;

  try {
    const result = await fetchReplies(comment.id, comment.replyPage, comment.replyPageSize);
    comment.pictureCommentVos = result.list;
    comment.hasMoreReplies = comment.pictureCommentVos.length < result.total;
  } catch (error) {
    console.error('加载回复失败:', error);
  }

  comment.replyLoading = false;
};


// 加载根评论
const loadRootComments = async () => {
  try {
    const result = await fetchRootComments(rootCommentPage.value, rootCommentPageSize.value);

    if (rootCommentPage.value === 1) {
      rootComments.value = result.list;
    } else {
      rootComments.value = [...rootComments.value, ...result.list];
    }

  } catch (error) {
    console.error('加载评论失败:', error);
  }
};

// 加载更多根评论
const loadMoreRootComments = async () => {
  loadingMoreRootComments.value = true;
  rootCommentPage.value += 1;

  await loadRootComments();

  loadingMoreRootComments.value = false;
};

// 切换回复框显示
const toggleReply = (comment) => {
  comment.showReply = !comment.showReply;
};

// 加载更多回复
const loadMoreReplies = async (comment) => {
  comment.replyLoading = true;

  try {
    const result = await fetchReplies(comment.id, comment.secondCurrent, comment.secondPageSize);
    comment.pictureCommentVos = [...result.list];
    comment.secondTotal = result.total;
  } catch (error) {
    console.error('加载回复失败:', error);
  }

  comment.replyLoading = false;
};

// 提交根评论
const submitRootComment = async () => {
  if (!newCommentContent.value.trim()) return;
  const newCommentParams = ref<API.PictureCommentRequest>({})

  // 模拟提交到后端
  const newComment = {
    userId: loginUserStore.loginUser.id,
    pictureId: props.objectId,
    content: newCommentContent.value,
  };
  const res = await saveOrUpdatePictureComment(newComment, {})
  if (res.data.code === 0 && res.data.data) {
    message.success('评论成功')
    newCommentContent.value = ''
    const resComment = {...res.data.data, userName: loginUserStore.loginUser.userName, userAvatar: loginUserStore.loginUser.userAvatar}
    resComment.user = loginUserStore.loginUser
    resComment.createTime = new Date(new Date().getTime()).toISOString()
    rootComments.value = [resComment, ...rootComments.value]
  } else {
    message.error('评论失败，' + res.data.message)
  }
};

const deleteCommentFun = async (comment) => {
  // 模拟兑换操作
  Modal.confirm({
    title: '确认删除',
    content: `确认要删除评论吗？`,
    onOk() {
      deletePictureCommentFun(comment)
    }
  });
}

const deletePictureCommentFun = async (comment) => {
  let params = {
    id: comment.id,
    userId: comment.userId,
    pictureId: props.objectId,
  }
  try{
    const res = await deleteComment(params)
    if (res.data.code === 0 && res.data.data) {
      message.success('删除成功')
    } else {
      message.success('删除失败，' + res.data.message)
    }
    rootCommentPage.value = 1
    replyEditor.value.secondComment.showReplyEditor = false;
    replyEditor.value.secondComment = {}
    await loadRootComments();
  }catch (e){
    message.success('删除失败')
  }
}

// 提交回复
const submitReply = async (comment) => {
  if (!replyEditor.value.replyContent.trim()) return;
  const id1 = ref();
  if(!comment.targetId){
    id1.value = comment.id;
  }else {
    id1.value = comment.targetId;
  }
  const id2 = ref();
  if(!comment.targetId){
    id2.value = null;
  }else {
    id2.value = comment.id;
  }

  // 模拟提交到后端
  let params = {
    userId: loginUserStore.loginUser.id,
    pictureId: props.objectId,
    targetId:id1.value,
    secondTargetId:id2.value,
    content: replyEditor.value.replyContent,
  };

  if(replyEditor.value.isEdit){
    if(!(comment.commentUserId === loginUserStore.loginUser.id)){
      message.error('非用户本人评论不能修改')
      return
    }
    params = {
      id: comment.id,
      pictureId: props.objectId,
      userId: comment.commentUserId,
      content: replyEditor.value.replyContent,
    };
  }

  const res = await saveOrUpdatePictureComment(params)
  try{
    if (res.data.code === 0 && res.data.data) {
      if(replyEditor.value.isEdit){
        message.success('修改成功')
        replyEditor.value.secondComment.showReplyEditor = false
        replyEditor.value.secondComment = {}
        let wiiBreak = false
        for(let i=0;i < rootComments.value.length; i++){
          if(wiiBreak){
            break
          }
          let r = rootComments.value[i]
          if (r.id === comment.id){
            r.content = replyEditor.value.replyContent
            break
          }
          for(let j = 0; j < r.pictureCommentVos.length; j++){
            let s = r.pictureCommentVos[j]
            if (s.id === comment.id){
              s.content = replyEditor.value.replyContent
              wiiBreak = true
              break
            }
          }
        }
        replyEditor.value.replyContent = ''
      }else{
        message.success('评论成功')
        replyEditor.value.replyContent = ''
        replyEditor.value.secondComment.showReplyEditor = false
        replyEditor.value.secondComment = {}
        const resComment = {...res.data.data, userName: loginUserStore.loginUser.userName, userAvatar: loginUserStore.loginUser.userAvatar}
        resComment.user = loginUserStore.loginUser
        resComment.createTime = new Date(new Date().getTime()).toISOString()
        resComment.targetUserName = replyEditor.value.targetUserName
        for(let i=0; i < rootComments.value.length; i++){
          let r = rootComments.value[i]
          if(r.id === resComment.targetId){
            rootComments.value[i].pictureCommentVos = [resComment, ...rootComments.value[i].pictureCommentVos]
          }
        }
      }
    } else {
      if(replyEditor.value.isEdit){
        message.success('修改失败，' + res.data.message)
      }else{
        message.success('评论失败，' + res.data.message)
      }
    }
  }catch (e){
    if(replyEditor.value.isEdit){
      message.success('修改失败')
    }else{
      message.success('评论失败')
    }
  }
  replyEditor.value.isEdit = false
  replyEditor.value.targetUserName = ''
};

// 格式化时间
const formatTime = (timeStr) => {
  const time = new Date(timeStr);
  const now = new Date();
  const diff = now - time;

  if (diff < 60000) {
    return '刚刚';
  } else if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`;
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`;
  } else {
    return `${Math.floor(diff / 86400000)}天前`;
  }
};

// 初始化加载评论
onMounted(() => {
  loadRootComments();
});
</script>

<style scoped>
.comment-section {
  margin-top: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  padding-bottom: 80px; /* 为底部固定回复框留出空间 */
}
.comment-header {
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 16px;
  font-weight: 600;
}
.comment-editor {
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
}
.editor-container {
  margin: 0 auto;
  padding: 0 20px;
}
.comment-list {
  padding: 0 24px;
}
.comment-item {
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}
.comment-item:last-child {
  border-bottom: none;
}
.comment-author {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}
.comment-time {
  color: #999;
  font-size: 12px;
  margin-left: 8px;
}
.comment-content {
  margin-top: 8px;
  color: rgba(0, 0, 0, 0.85);
}
.comment-actions {
  margin-top: 8px;
}
.reply-list {
  margin-top: 16px;
  padding-left: 40px;
  border-left: 2px solid #f0f0f0;
}
.load-more {
  text-align: center;
  margin-top: 16px;
  padding: 8px;
}
.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #999;
}
</style>
