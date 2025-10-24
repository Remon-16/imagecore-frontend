<template>
  <div class="screenplay-list">
    <!-- 剧本列表 -->
    <a-list
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }"
      :data-source="dataList"
      :loading="loading"
    >
      <template #renderItem="{ item: screenplay }">
        <a-list-item style="padding: 0">
          <!-- 单张图片 -->
          <a-card hoverable @click="doClickScreenplay(screenplay)" :bodyStyle="{ padding: '14px' }" >
            <template #cover>
              <img
                :alt="screenplay.name"
                :src="screenplay.cover"
                style="height: 220px; object-fit: cover"
              />
            </template>
            <!-- 使用Flex布局将标题、标签和按钮放在一行 -->
            <a-flex justify="space-between" align="center" :style="{ marginTop: '0px' }">
              <!-- 左侧：标题和标签 -->
              <a-flex vertical :style="{ overflow: 'hidden', flex: 1, marginRight: '0px' }">
                <!-- 标题 -->
                <span
                  :style="{
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }"
                >
                  {{ screenplay.name }}
                </span>
                <!-- 标签组 -->
                <a-flex :style="{ marginTop: '0px', flexWrap: 'wrap', rowGap: '4px' }">
                  <a-tag color="green">
                    {{ screenplay.category ?? '默认' }}
                  </a-tag>
                  <a-tag v-for="tag in screenplay.tags" :key="tag">
                    {{ tag }}
                  </a-tag>
                </a-flex>
              </a-flex>
<!--              &lt;!&ndash; 右侧：点赞按钮 &ndash;&gt;-->
<!--              <ThumbButton-->
<!--                :picture-id="picture.id"-->
<!--                :count="picture.thumbCount"-->
<!--                :has-thumb="picture.hasThumb"-->
<!--              />-->
            </a-flex>
            <template v-if="showOp" #actions>
              <EditOutlined v-if="canEdit" @click="(e) => doEdit(screenplay, e)" />
              <DeleteOutlined v-if="canDelete" @click="(e) => doDelete(screenplay, e)" />
            </template>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons-vue'
import { deletePicture } from '@/api/pictureController.ts'
import { message } from 'ant-design-vue'
import { ref } from 'vue'
import ThumbButton from '@/components/ThumbButton.vue'

interface Props {
  dataList?: API.ScreenplayVO[]
  loading?: boolean
  showOp?: boolean
  canEdit?: boolean
  canDelete?: boolean
  onReload?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  dataList: () => [],
  loading: false,
  showOp: false,
  canEdit: false,
  canDelete: false,
})

const router = useRouter()
// 跳转至图片详情页
const doClickScreenplay = (screenplay: API.ScreenplayVO) => {
  router.push({
    path: `/edit_script/${screenplay.id}`,
  })
}

// 编辑
const doEdit = (screenplay, e) => {
  // 阻止冒泡
  e.stopPropagation()
  // 跳转时一定要携带 spaceId
  router.push({
    path: '/add_picture',
    query: {
      id: screenplay.id,
      spaceId: screenplay.spaceId,
    },
  })
}

// 删除数据
const doDelete = async (screenplay, e) => {
  // 阻止冒泡
  e.stopPropagation()
  const id = screenplay.id
  if (!id) {
    return
  }
  const res = await deletePicture({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    props.onReload?.()
  } else {
    message.error('删除失败')
  }
}

</script>

<style scoped></style>
