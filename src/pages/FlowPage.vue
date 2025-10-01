<template>
  <div class="app">
    <FlowToolbar />
    <div class="main-content">
      <NodePanel :graph="graph" />
      <div class="flowchart-container">
        <div ref="containerRef" class="x6-graph-container"></div>
        <TeleportContainer />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, provide } from 'vue'
import { Graph } from '@antv/x6'
import FlowToolbar from '@/components/FlowToolbar.vue'
import NodePanel from '@/components/NodePanel.vue'
import { getTeleport } from '@antv/x6-vue-shape'
import { History } from '@antv/x6-plugin-history'
import { Selection } from '@antv/x6-plugin-selection'


const TeleportContainer = getTeleport()
const containerRef = ref<HTMLDivElement>()
const graph = ref<Graph>()

provide('graph', graph)

onMounted(() => {
  if (!containerRef.value) return

  graph.value = new Graph({
    container: containerRef.value,
    width: 1200,
    height: 1000,
    grid: {
      visible: true,
      type: 'doubleMesh',
      args: [
        { color: '#eee', thickness: 1 },
        { color: '#ddd', thickness: 1, factor: 4 }
      ]
    },
    panning: {
      enabled: true,
      eventTypes: ['leftMouseDown'],
      modifiers: 'shift',
    },
    mousewheel: {
      enabled: true,
      zoomAtMousePosition: true,
      modifiers: 'ctrl',
      minScale: 0.5,
      maxScale: 3
    },
    background: {
      color: '#f8f9fa'
    },
    connecting: {
      router: 'manhattan',
      connector: {
        name: 'rounded',
        args: { radius: 8 }
      },
      anchor: 'center',
      connectionPoint: 'boundary',
      allowBlank: false,
      snap: {
        radius: 20
      },
      createEdge() {
        return graph.value!.createEdge({
          shape: 'custom-edge',
          attrs: {
            line: {
              stroke: '#A2B1C3',
              strokeWidth: 2,
              targetMarker: {
                name: 'block',
                width: 12,
                height: 8
              }
            }
          }
        })
      }
    }
  })
  graph.value.use(
    new History({
      enabled: true,
    }),
  )
  graph.value.use(
    new Selection({
      enabled: true,
      multiple: true,
      rubberband: true,
      movable: true,
      showNodeSelectionBox: true,
    }),
  )
  // 初始化图形事件
  initGraphEvents()

  initDndEvents()
})

onUnmounted(() => {
  graph.value?.dispose()
})

// 在onMounted中添加拖放事件处理
const initDndEvents = () => {
  if (!graph.value || !containerRef.value) return

  containerRef.value.addEventListener('dragover', (e) => {
    e.preventDefault()
  })

  containerRef.value.addEventListener('drop', (e) => {
    e.preventDefault()

    try {
      const rawData = e.dataTransfer?.getData('text/plain')
      if (!rawData) return

      const nodeData = JSON.parse(rawData)
      const point = graph.value!.clientToLocal(e.clientX, e.clientY)
      const node = graph.value!.createNode({
        shape: nodeData.shape,
        x: point.x - (nodeData.offset?.x || 0),
        y: point.y - (nodeData.offset?.y || 0),
        width: nodeData.width,
        height: nodeData.height,
        data: nodeData.data, // 确保传递 data
        label: nodeData.data?.label, // 如果 X6 需要 label 属性
        ports: {
          groups: {
            in: {
              position: 'left',
              attrs: {
                circle: {
                  r: 4,
                  magnet: true,
                  stroke: '#5F95FF',
                  strokeWidth: 1,
                  fill: '#fff'
                }
              }
            },
            out: {
              position: 'right',
              attrs: {
                circle: {
                  r: 4,
                  magnet: true,
                  stroke: '#5F95FF',
                  strokeWidth: 1,
                  fill: '#fff'
                }
              }
            }
          },
          items: [
            { group: 'in', id: `in-${Date.now()}` },
            { group: 'out', id: `out-${Date.now()}` }
          ]
        }
      })

      graph.value!.addNode(node)
    } catch (error) {
      console.error('拖放创建节点失败:', error)
    }
  })
}

const initGraphEvents = () => {
  if (!graph.value) return

  // 节点点击事件
  graph.value.on('node:click', ({ node }) => {
    console.log('节点被点击:', node.id)
  })

  // 边点击事件
  graph.value.on('edge:click', ({ edge }) => {
    console.log('边被点击:', edge.id)
  })
}
</script>


<style scoped>
.app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}
</style>
