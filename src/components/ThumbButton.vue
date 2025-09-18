<template>
  <button
    class="thumb-button"
    :class="{
      'thumbed': disHasThumb,
      'disabled': !userLoginFlag
    }"
    :disabled="!userLoginFlag"
    @click.stop="handleClick"
  >
    <a-flex align="left" gap="small">
    <div class="thumb-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon" style="width: 16px; height: 16px;">
        <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
      </svg>
    </div>
    <div class="thumb-count">
      <transition name="count">
        <span :key="displayCount">{{ formattedCount }}</span>
      </transition>
    </div>
    </a-flex>
  </button>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';

import { formatNumber, debounce } from '../utils';
import { message } from 'ant-design-vue'
import { doThumb, undoThumb } from '@/api/thumbController.ts'

const props = defineProps({
  pictureId: {
    type: [Number, String],
    required: true
  },
  count: {
    type: Number,
    default: 0
  },
  hasThumb: {
    type: Boolean,
    default: false
  }
});

const userLoginFlag = ref(false);
const token = localStorage.getItem('authToken')
if (token) {
  userLoginFlag.value = true;
}

// 用于动画效果的显示计数
const displayCount = ref(props.count == null? 0 : props.count);

const disHasThumb = ref(props.hasThumb == null? false : props.hasThumb);

// 防抖处理点击事件
const debouncedThumbAction = debounce(async (pictureId, currentStatus) => {

  try {
    if (currentStatus) {
      const res = await undoThumb({pictureId});
      if (res.data.code === 0 && res.data.data){
        displayCount.value = displayCount.value - 1;
        disHasThumb.value = false;
      }else {
        message.error(res.data.message)
      }
    } else {
      const res = await doThumb({pictureId});
      if (res.data.code === 0 && res.data.data) {
        displayCount.value = displayCount.value + 1;
        disHasThumb.value = true;
      }else {
        message.error(res.data.message)
      }
    }

  } catch (error) {

  }
}, 200);

const handleClick = () => {
  if (!userLoginFlag.value) {
    message.error('用户未登录，不能点赞');
    return;
  }
  // console.log('点击点赞按钮, 当前状态:', props.hasThumb ? '已点赞' : '未点赞', '图片ID:', props.pictureId);
  debouncedThumbAction(props.pictureId, disHasThumb.value);
};

// 格式化点赞数
const formattedCount = computed(() => {
  return formatNumber(displayCount.value);
});

// 监听count变化，更新显示计数
watch(() => props.count, (newCount) => {
  // console.log('点赞数变化:', props.blogId, newCount);
  displayCount.value = newCount;
});

watch(() => props.hasThumb, (newVal) => {
  disHasThumb.value = newVal
})
</script>

<style scoped>
.thumb-button {
  display: flex;
  align-items: center;
  gap: 0.375rem;  /* gap-1.5 = 1.5 × 0.25rem */
  padding-left: 0.75rem;  /* px-3 = 3 × 0.25rem */
  padding-right: 0.75rem;
  padding-top: 0.375rem;  /* py-1.5 = 1.5 × 0.25rem */
  padding-bottom: 0.375rem;
  border-radius: 9999px;  /* rounded-full */
  border-width: 1px;
  border-style: solid;
  border-color: #e5e7eb;  /* border-gray-200 */
  background-color: #fff;  /* bg-white */
  transition: background-color 0.2s ease-in-out,
              border-color 0.2s ease-in-out,
              color 0.2s ease-in-out;
}

.thumb-button:hover:not(.disabled) {
  border-color: rgba(79, 70, 229, 0.5);  /* primary=#4F46E5 with 50% opacity */
}

.thumb-button.thumbed {
  /* @apply bg-primary bg-opacity-5 border-primary text-primary; */
  background-color: rgba(79, 70, 229, 0.05);  /* primary with 5% opacity */
  border-color: #4F46E5;  /* border-primary */
  color: #4F46E5;  /* text-primary */
}

.thumb-button.disabled {
  /* @apply opacity-60 cursor-not-allowed; */
  opacity: 0.6;
  cursor: not-allowed;
}

.thumb-icon {
  /* @apply w-5 h-5 relative; */
  width: 1.25rem;  /* w-5 = 5 × 0.25rem */
  height: 1.25rem;  /* h-5 */
  position: relative;
  transform-origin: center;
}

.icon {
  /* @apply w-full h-full absolute inset-0; */
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transition: transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28),
              color 0.2s ease-in-out,
              opacity 0.2s ease-in-out;
}

.thumbed .icon {
  color: var(--primary-color, #4F46E5);
  animation: like-animation 0.45s cubic-bezier(0.17, 0.89, 0.32, 1.49);
}

.thumb-count {
  /* @apply relative inline-flex justify-center items-center text-sm font-medium overflow-visible; */
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 0.875rem;  /* text-sm */
  font-weight: 500;     /* font-medium */
  overflow: visible;

  min-width: 1.5rem;
  color: #666;
  transition: color 0.2s ease-in-out;
}

.thumbed .thumb-count {
  color: var(--primary-color, #4F46E5);
}

/* 数字变化动画 */
.count-enter-active {
  animation: count-in 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}

.count-leave-active {
  animation: count-out 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes count-in {
  0% {
    opacity: 0;
    transform: translateY(8px) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes count-out {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-8px) scale(0.8) translateX(-10px);
  }
}

@keyframes like-animation {
  0% {
    transform: scale(1);
  }
  35% {
    transform: scale(1.3);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}

/* 取消点赞动画 */
.thumb-button:not(.thumbed) .icon {
  transform: scale(1);
  animation: unlike-animation 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes unlike-animation {
  0% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
}

/* 添加CSS变量用于主题色 */
:root {
  --primary-color: #4F46E5;
}
</style>
