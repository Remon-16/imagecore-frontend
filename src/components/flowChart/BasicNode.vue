<template>
  <div class="basic-node" :class="{ selected: selected }">
    <div class="node-header">
      <span class="node-title">{{ nodeData.data?.label }}</span>
    </div>
    <div class="node-content">
      <div class="node-props">
        <span v-for="prop in nodeData.data?.properties" :key="prop" class="node-prop">
          {{ prop }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, onMounted, onUnmounted, reactive } from 'vue'

// 使用计算属性提供默认值
const nodeData = reactive({
  data: { } ,
})

const selected = ref(false)
const getNode = inject<() => any>('getNode')
const node = getNode?.()

onMounted(() => {
  if (node) {
    node.on('change:selected', () => {
      selected.value = node.hasState('selected')
    })
    node.on('change:data', async (d) => {
      nodeData.data = d.current
    })
    nodeData.data = node.getData()
  }
})

onUnmounted(() => {
  if (node) {
    node.off('change:selected')
  }
})
</script>
<style scoped>
.basic-node {
  width: 120px;
  background: white;
  border: 2px solid #5f95ff;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.basic-node:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.basic-node.selected {
  border-color: #ff6b6b;
  box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.2);
}

.node-header {
  background: #5f95ff;
  color: white;
  padding: 6px 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: bold;
}

.node-icon {
  font-size: 14px;
}

.node-content {
  padding: 8px;
}

.node-props {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.node-prop {
  font-size: 10px;
  color: #666;
  padding: 2px 4px;
  background: #f5f5f5;
  border-radius: 2px;
}

.node-ports {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: space-between;
  pointer-events: none;
}

.port {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
  border: 2px solid #5f95ff;
  pointer-events: all;
  cursor: crosshair;
}

.in-port {
  margin-left: -6px;
}

.out-port {
  margin-right: -6px;
}
</style>
