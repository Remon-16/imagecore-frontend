<template>
  <div class="node-editor-panel">
    <div class="panel-header">
      <h3>节点属性</h3>
    </div>

    <div class="panel-content">
      <a-empty
        v-if="!visible"
        description="未选中节点或节点不可编辑"
        class="empty-state"
      />

      <a-form
        v-else
        :model="formState"
        layout="vertical"
        class="node-form"
        @submit="saveNodeData"
      >

        <a-form-item
          label="节点标签"
          required
          :validate-status="labelError ? 'error' : ''"
          :help="labelError"
        >
          <a-input
            v-model:value="formState.label"
            placeholder="请输入节点标签"
            @blur="validateLabel"
          />
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            block
            :disabled="!formState.label"
          >
            保存更改
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'

interface FormState {
  label: string
  properties: string[]
  type: string
  nodeStyle: string
}

interface Props {
  node: any
  nodeData: any
  visible: boolean
}

const props = defineProps<Props>()

const formState = reactive<FormState>({
  label: '',
  properties: [],
  type: 'default',
  nodeStyle: 'default'
})

const labelError = ref<string>('')

// 监听节点数据变化
watch(() => props.node, (newNode) => {
  if (newNode) {
    formState.label = newNode.data.label || ''
    formState.properties = newNode.data.properties ? [...newNode.data.properties] : []
    formState.type = newNode.shape || 'default'
    formState.nodeStyle = newNode.nodeStyle || 'default'
    labelError.value = ''
  }
}, { immediate: true })

// 验证标签
const validateLabel = () => {
  if (!formState.label.trim()) {
    labelError.value = '节点标签不能为空'
    return false
  }
  labelError.value = ''
  return true
}

// 添加属性
const addProperty = () => {
  formState.properties.push('')
}

// 移除属性
const removeProperty = (index: number) => {
  formState.properties.splice(index, 1)
}

// 处理属性变化
const handlePropertyChange = (index: number, event: any) => {
  formState.properties[index] = event.target.value
}


// 保存节点数据
const saveNodeData = () => {
  if (props.node) {
    const node = props.node
    // 1. 直接更新节点数据
    node.setData({ ...formState } )
    node.prop('attrs/label/text', formState.label)
    // editDrawerVisible.value = false
  }
}

// 获取节点类型颜色
const getNodeTypeColor = (type: string) => {
  const colors: { [key: string]: string } = {
    'ellipse': 'gray',
    'custom-basic-node': '#5f95ff',
    'custom-game-node': '#ffb75f',
    'custom-select-node': '#a75fff',
    end: 'white',
    default: 'gray'
  }
  return colors[type] || 'gray'
}

// 获取节点类型文本
const getNodeTypeText = (type: string) => {
  const texts: { [key: string]: string } = {
    'ellipse': '开始节点',
    'custom-basic-node': '标准节点',
    'custom-select-node': '选择分支节点',
    'custom-game-node': '游戏分支节点',
    default: '普通节点'
  }
  return texts[type] || '普通节点'
}
</script>

<style scoped>
.node-editor-panel {
  height: 100%;
  background: #fff;
  border-left: 1px solid #d9d9d9;
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 16px;
  height: 50px;
  border-bottom: 1px solid #d9d9d9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fafafa;
}

.panel-header h3 {
  margin: 0;
  color: #262626;
}

.panel-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.empty-state {
  margin-top: 100px;
}

.node-form {
  height: 100%;
}

.properties-list {
  margin-bottom: 8px;
}

.property-item {
  margin-bottom: 8px;
}

.add-property-btn {
  margin-top: 8px;
}

:deep(.ant-form-item-label > label) {
  font-weight: 500;
}
</style>
