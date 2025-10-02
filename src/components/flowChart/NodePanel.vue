<template>
  <div class="node-panel">
    <div class="panel-header">
      <h3>节点选择</h3>
    </div>

    <div class="node-list">
      <div
        v-for="nodeType in nodeTypes"
        :key="nodeType.type"
        class="node-item"
        :class="nodeType.type"
        draggable="true"
        @dragstart="onDragStart($event, nodeType)"
      >
        <div class="node-preview">
          {{ nodeType.name }}
        </div>
      </div>
      <div>
        提示：<br>
        <span>1 按住shift和鼠标左键拖动画布。<br></span>
        <span>2 线也可以选中删除，类似节点（但是没有选中反馈，看不出来选没选上，实在是没解决，sorry）<br></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nodeTypes } from '@/utils/x6-setup.ts'

interface NodeType {
  type: string
  name: string
  shape: string
  width: number
  height: number
  data: any
}


const onDragStart = (e: DragEvent, nodeType: NodeType) => {
  if (!e.dataTransfer) return

  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const offsetX = e.clientX - rect.left
  const offsetY = e.clientY - rect.top

  e.dataTransfer.setData(
    'text/plain',
    JSON.stringify({
      type: nodeType.type,
      shape: nodeType.shape,
      width: nodeType.width,
      height: nodeType.height,
      data: nodeType.data,
      offset: { x: offsetX, y: offsetY }
    })
  )
}
</script>

<style scoped>
.node-panel {
  height: 100%;
  background: #fff;
  border-right: 1px solid #d9d9d9;
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 16px;
  height: 50px;
  border-bottom: 1px solid #d9d9d9;
  display: flex;
  align-items: center;
  background: #fafafa;
  position: sticky
}

.node-list {
  padding: 8px;
  display: flex;
  background: #fff;
  flex-direction: column;
  gap: 8px;
}

.node-item {
  padding: 12px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: grab;
  transition: all 0.2s ease;
  user-select: none;
}

.node-item.process {
  border: 2px solid #5f95ff;
}

.node-item.select {
  border: 2px solid #a75fff;
}

.node-item.game {
  border: 2px solid #ffb75f;
}

.node-item.start {
}

.node-item.end {
}

.node-item:hover {
  border-color: #5F95FF;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.node-item:active {
  cursor: grabbing;
}

.node-preview {
  font-size: 12px;
  color: #333;
  text-align: center;
}
</style>
