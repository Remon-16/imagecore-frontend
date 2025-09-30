<template>
  <div class="toolbar">
    <button @click="zoomIn" title="放大 (Ctrl++)">⊕</button>
    <button @click="zoomOut" title="缩小 (Ctrl+-)">⊖</button>
    <button @click="fitContent" title="适应画布">⤢</button>
    <button @click="clearSelected" title="删除选中 (Delete)">×</button>
    <button @click="undo" title="撤销 (Ctrl+Z)">↶</button>
    <button @click="redo" title="重做 (Ctrl+Y)">↷</button>
    <button @click="exportJSON" title="导出为JSON">↓</button>
  </div>
</template>

<script setup lang="ts">
import { inject, type Ref } from 'vue'
import type { Graph } from '@antv/x6'


const graph = inject<Ref<Graph | undefined>>('graph')

const zoomIn = () => {
  graph?.value.zoom(0.1)
}

const zoomOut = () => {
  graph?.value.zoom(-0.1)
}

const fitContent = () => {
  graph?.value.zoomToFit({ padding: 20, maxScale: 1 })
}

const clearSelected = () => {
  const selectedCells = graph?.value.getSelectedCells()
  if (selectedCells && selectedCells.length > 0) {
    graph?.value.removeCells(selectedCells)
  }
}

const undo = () => {
  // 实现撤销逻辑
  console.log('撤销操作')
}

const redo = () => {
  // 实现重做逻辑
  console.log('重做操作')
}

const exportJSON = () => {
  if (!graph) return

  const data = graph.value.toJSON()
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'flowchart.json'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.toolbar {
  display: flex;
  gap: 8px;
  padding: 8px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
}

.toolbar button {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
}

.toolbar button:hover {
  border-color: #5F95FF;
  color: #5F95FF;
}
</style>
