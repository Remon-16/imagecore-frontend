<template>
  <div class="app">
    <a-button @click="selectNext">下一个测试</a-button>
    <FlowToolbar />
    <a-layout>
      <a-layout-sider width="200">
        <NodePanel :graph="graph" />
      </a-layout-sider>
      <a-layout-content class="flowchart-container">
        <div ref="containerRef" class="x6-graph-container"></div>
        <TeleportContainer />
      </a-layout-content>
      <a-layout-sider  width="300">
        <NodeEdit :node="selectedNode" :node-data="selectedNodeData" :visible="editDrawerVisible"/>
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, provide, reactive, h } from 'vue'
import { Graph } from '@antv/x6'
import FlowToolbar from '@/components/flowChart/FlowToolbar.vue'
import NodePanel from '@/components/flowChart/NodePanel.vue'
import { getTeleport } from '@antv/x6-vue-shape'
import { History } from '@antv/x6-plugin-history'
import { Selection } from '@antv/x6-plugin-selection'
import { Snapline } from '@antv/x6-plugin-snapline'
import NodeEdit from '@/components/flowChart/NodeEdit.vue'
import { Button, message, Modal } from 'ant-design-vue'

const TeleportContainer = getTeleport()
const containerRef = ref<HTMLDivElement>()
const graph = ref<Graph>()

const editDrawerVisible = ref(false)
const selectedNodeData = ref<any>(null)
const selectedNode = ref<any>(null)

const formState = reactive({
  label: '',
  properties: [] as string[],
})

provide('graph', graph)

let currentSelectedId = 'de3fd8c0-9766-4d96-826f-a20fda70ee77';

onMounted(() => {
  if (!containerRef.value) return

  graph.value = new Graph({
    container: containerRef.value,
    width: 1300,
    height: 1000,
    grid: {
      visible: true,
      type: 'doubleMesh',
      args: [
        { color: '#eee', thickness: 1 },
        { color: '#ddd', thickness: 1, factor: 4 },
      ],
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
      maxScale: 3,
    },
    background: {
      color: '#f8f9fa',
    },
    connecting: {
      router: 'manhattan',
      connector: {
        name: 'rounded',
        args: { radius: 8 },
      },
      anchor: 'center',
      connectionPoint: 'boundary',
      allowBlank: false,
      snap: {
        radius: 20,
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
                height: 8,
              },
            },
          },
        })
      },
    },
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
  graph.value.use(
    new Snapline({
      enabled: true,
    }),
  )
  // 初始化图形事件
  initGraphEvents()

  initDndEvents()

  const data = {
    "cells": [
      {
        "position": {
          "x": 50,
          "y": 440
        },
        "size": {
          "width": 120,
          "height": 120
        },
        "view": "vue-shape-view",
        "shape": "custom-basic-node",
        "data": {
          "label": "标准节点",
          "properties": [
            "数据处理"
          ],
          "imageUrl": "https://picos.imagocore.top/public/1928052943001227266/2025-09-18_AOdmjrQeWl2gYK0g.webp"
        },
        "id": "de3fd8c0-9766-4d96-826f-a20fda70ee77",
        "label": "标准节点",
        "ports": {
          "groups": {
            "in": {
              "position": "left",
              "attrs": {
                "circle": {
                  "r": 4,
                  "magnet": true,
                  "stroke": "#5F95FF",
                  "strokeWidth": 1,
                  "fill": "#fff"
                }
              }
            },
            "out": {
              "position": "right",
              "attrs": {
                "circle": {
                  "r": 4,
                  "magnet": true,
                  "stroke": "#5F95FF",
                  "strokeWidth": 1,
                  "fill": "#fff"
                }
              }
            }
          },
          "items": [
            {
              "group": "in",
              "id": "in-1761552066223"
            },
            {
              "group": "out",
              "id": "out-1761552066223"
            }
          ]
        },
        "zIndex": 1
      },
      {
        "position": {
          "x": 248,
          "y": 440
        },
        "size": {
          "width": 120,
          "height": 120
        },
        "view": "vue-shape-view",
        "shape": "custom-select-node",
        "data": {
          "label": "选择分支节点",
          "branchConditions": {
            // key: 目标节点ID, value: 条件描述文本
            '8d22439d-0603-4833-a248-f9a98905d0f4': '当用户是管理员时',
            'ca8fa8de-425a-4e01-baab-905b7fd4e8ce': '当用户是普通用户时',
          },
          "properties": [
            "条件判断"
          ],
          "imageUrl": "https://picos.imagocore.top/public/1928052943001227266/2025-09-18_AOdmjrQeWl2gYK0g.webp"
        },
        "id": "4a29d4a1-d4d1-426e-a3cc-059066c2ab0f",
        "label": "选择分支节点",
        "ports": {
          "groups": {
            "in": {
              "position": "left",
              "attrs": {
                "circle": {
                  "r": 4,
                  "magnet": true,
                  "stroke": "#5F95FF",
                  "strokeWidth": 1,
                  "fill": "#fff"
                }
              }
            },
            "out": {
              "position": "right",
              "attrs": {
                "circle": {
                  "r": 4,
                  "magnet": true,
                  "stroke": "#5F95FF",
                  "strokeWidth": 1,
                  "fill": "#fff"
                }
              }
            }
          },
          "items": [
            {
              "group": "in",
              "id": "in-1761552078167"
            },
            {
              "group": "out",
              "id": "out-1761552078167"
            }
          ]
        },
        "zIndex": 2
      },
      {
        "shape": "custom-edge",
        "connector": {
          "name": "rounded"
        },
        "router": {
          "name": "manhattan"
        },
        "id": "154a5caf-3ed9-464a-b6a6-31f5804092e5",
        "source": {
          "cell": "de3fd8c0-9766-4d96-826f-a20fda70ee77",
          "port": "out-1761552066223"
        },
        "target": {
          "cell": "4a29d4a1-d4d1-426e-a3cc-059066c2ab0f",
          "port": "in-1761552078167"
        },
        "zIndex": 3
      },
      {
        "position": {
          "x": 460,
          "y": 370
        },
        "size": {
          "width": 120,
          "height": 120
        },
        "view": "vue-shape-view",
        "shape": "custom-basic-node",
        "data": {
          "label": "标准节点",
          "properties": [
            "数据处理"
          ],
          "imageUrl": "https://picos.imagocore.top/public/1928052943001227266/2025-09-18_AOdmjrQeWl2gYK0g.webp"
        },
        "id": "8d22439d-0603-4833-a248-f9a98905d0f4",
        "label": "标准节点",
        "ports": {
          "groups": {
            "in": {
              "position": "left",
              "attrs": {
                "circle": {
                  "r": 4,
                  "magnet": true,
                  "stroke": "#5F95FF",
                  "strokeWidth": 1,
                  "fill": "#fff"
                }
              }
            },
            "out": {
              "position": "right",
              "attrs": {
                "circle": {
                  "r": 4,
                  "magnet": true,
                  "stroke": "#5F95FF",
                  "strokeWidth": 1,
                  "fill": "#fff"
                }
              }
            }
          },
          "items": [
            {
              "group": "in",
              "id": "in-1761552092596"
            },
            {
              "group": "out",
              "id": "out-1761552092596"
            }
          ]
        },
        "zIndex": 4
      },
      {
        "position": {
          "x": 460,
          "y": 527
        },
        "size": {
          "width": 120,
          "height": 120
        },
        "view": "vue-shape-view",
        "shape": "custom-basic-node",
        "data": {
          "label": "标准节点",
          "properties": [
            "数据处理"
          ],
          "imageUrl": "https://picos.imagocore.top/public/1928052943001227266/2025-09-18_AOdmjrQeWl2gYK0g.webp"
        },
        "id": "ca8fa8de-425a-4e01-baab-905b7fd4e8ce",
        "label": "标准节点",
        "ports": {
          "groups": {
            "in": {
              "position": "left",
              "attrs": {
                "circle": {
                  "r": 4,
                  "magnet": true,
                  "stroke": "#5F95FF",
                  "strokeWidth": 1,
                  "fill": "#fff"
                }
              }
            },
            "out": {
              "position": "right",
              "attrs": {
                "circle": {
                  "r": 4,
                  "magnet": true,
                  "stroke": "#5F95FF",
                  "strokeWidth": 1,
                  "fill": "#fff"
                }
              }
            }
          },
          "items": [
            {
              "group": "in",
              "id": "in-1761552095317"
            },
            {
              "group": "out",
              "id": "out-1761552095317"
            }
          ]
        },
        "zIndex": 5
      },
      {
        "shape": "custom-edge",
        "connector": {
          "name": "rounded"
        },
        "router": {
          "name": "manhattan"
        },
        "id": "18852f2c-2ba9-49f4-9cdd-8618242fe37f",
        "source": {
          "cell": "4a29d4a1-d4d1-426e-a3cc-059066c2ab0f",
          "port": "out-1761552078167"
        },
        "target": {
          "cell": "8d22439d-0603-4833-a248-f9a98905d0f4",
          "port": "in-1761552092596"
        },
        "zIndex": 6
      },
      {
        "shape": "custom-edge",
        "connector": {
          "name": "rounded"
        },
        "router": {
          "name": "manhattan"
        },
        "id": "a6c49226-cc01-4c18-b073-02f1db7f77e7",
        "source": {
          "cell": "4a29d4a1-d4d1-426e-a3cc-059066c2ab0f",
          "port": "out-1761552078167"
        },
        "target": {
          "cell": "ca8fa8de-425a-4e01-baab-905b7fd4e8ce",
          "port": "in-1761552095317"
        },
        "zIndex": 7
      },
      {
        "position": {
          "x": 679,
          "y": 370
        },
        "size": {
          "width": 120,
          "height": 120
        },
        "view": "vue-shape-view",
        "shape": "custom-game-node",
        "data": {
          "label": "游戏分支节点",
          "properties": [
            "条件判断"
          ],
          "imageUrl": "https://picos.imagocore.top/public/1928052943001227266/2025-09-18_AOdmjrQeWl2gYK0g.webp"
        },
        "id": "aaa631c6-19af-42a9-9916-da3b8a578c6f",
        "label": "游戏分支节点",
        "ports": {
          "groups": {
            "in": {
              "position": "left",
              "attrs": {
                "circle": {
                  "r": 4,
                  "magnet": true,
                  "stroke": "#5F95FF",
                  "strokeWidth": 1,
                  "fill": "#fff"
                }
              }
            },
            "out": {
              "position": "right",
              "attrs": {
                "circle": {
                  "r": 4,
                  "magnet": true,
                  "stroke": "#5F95FF",
                  "strokeWidth": 1,
                  "fill": "#fff"
                }
              }
            }
          },
          "items": [
            {
              "group": "in",
              "id": "in-1761552106654"
            },
            {
              "group": "out",
              "id": "out-1761552106654"
            }
          ]
        },
        "zIndex": 8
      },
      {
        "shape": "custom-edge",
        "connector": {
          "name": "rounded"
        },
        "router": {
          "name": "manhattan"
        },
        "id": "76108925-8b3b-4bc9-8657-7e46d9b58772",
        "source": {
          "cell": "8d22439d-0603-4833-a248-f9a98905d0f4",
          "port": "out-1761552092596"
        },
        "target": {
          "cell": "aaa631c6-19af-42a9-9916-da3b8a578c6f",
          "port": "in-1761552106654"
        },
        "zIndex": 9
      },
      {
        "position": {
          "x": 855,
          "y": 250
        },
        "size": {
          "width": 120,
          "height": 120
        },
        "view": "vue-shape-view",
        "shape": "custom-basic-node",
        "data": {
          "label": "标准节点",
          "properties": [
            "数据处理"
          ],
          "imageUrl": "https://picos.imagocore.top/public/1928052943001227266/2025-09-18_AOdmjrQeWl2gYK0g.webp"
        },
        "id": "51fd3560-ff39-4e43-bc68-045244f54959",
        "label": "标准节点",
        "ports": {
          "groups": {
            "in": {
              "position": "left",
              "attrs": {
                "circle": {
                  "r": 4,
                  "magnet": true,
                  "stroke": "#5F95FF",
                  "strokeWidth": 1,
                  "fill": "#fff"
                }
              }
            },
            "out": {
              "position": "right",
              "attrs": {
                "circle": {
                  "r": 4,
                  "magnet": true,
                  "stroke": "#5F95FF",
                  "strokeWidth": 1,
                  "fill": "#fff"
                }
              }
            }
          },
          "items": [
            {
              "group": "in",
              "id": "in-1761552112327"
            },
            {
              "group": "out",
              "id": "out-1761552112327"
            }
          ]
        },
        "zIndex": 10
      },
      {
        "position": {
          "x": 855,
          "y": 475
        },
        "size": {
          "width": 120,
          "height": 120
        },
        "view": "vue-shape-view",
        "shape": "custom-basic-node",
        "data": {
          "label": "标准节点",
          "properties": [
            "数据处理"
          ],
          "imageUrl": "https://picos.imagocore.top/public/1928052943001227266/2025-09-18_AOdmjrQeWl2gYK0g.webp"
        },
        "id": "62ef2b9c-897c-460b-8764-450a3f332f7e",
        "label": "标准节点",
        "ports": {
          "groups": {
            "in": {
              "position": "left",
              "attrs": {
                "circle": {
                  "r": 4,
                  "magnet": true,
                  "stroke": "#5F95FF",
                  "strokeWidth": 1,
                  "fill": "#fff"
                }
              }
            },
            "out": {
              "position": "right",
              "attrs": {
                "circle": {
                  "r": 4,
                  "magnet": true,
                  "stroke": "#5F95FF",
                  "strokeWidth": 1,
                  "fill": "#fff"
                }
              }
            }
          },
          "items": [
            {
              "group": "in",
              "id": "in-1761552114851"
            },
            {
              "group": "out",
              "id": "out-1761552114851"
            }
          ]
        },
        "zIndex": 11
      },
      {
        "shape": "custom-edge",
        "connector": {
          "name": "rounded"
        },
        "router": {
          "name": "manhattan"
        },
        "id": "638bc5d8-e77d-4124-a57e-6107aa2b8222",
        "source": {
          "cell": "aaa631c6-19af-42a9-9916-da3b8a578c6f",
          "port": "out-1761552106654"
        },
        "target": {
          "cell": "51fd3560-ff39-4e43-bc68-045244f54959",
          "port": "in-1761552112327"
        },
        "zIndex": 12
      },
      {
        "shape": "custom-edge",
        "connector": {
          "name": "rounded"
        },
        "router": {
          "name": "manhattan"
        },
        "id": "5ccdbdbf-73b0-486b-94e7-0110257ff663",
        "source": {
          "cell": "aaa631c6-19af-42a9-9916-da3b8a578c6f",
          "port": "out-1761552106654"
        },
        "target": {
          "cell": "62ef2b9c-897c-460b-8764-450a3f332f7e",
          "port": "in-1761552114851"
        },
        "zIndex": 13
      }
    ]
  }

  graph.value.fromJSON(data);

  const startNode = graph.value.getCellById(currentSelectedId);
  if (startNode) {
    graph.value.select(startNode); // 选中开始节点
  }

})

onUnmounted(() => {
  graph.value?.dispose()
})

const selectNext = () => {
  const currentNode = graph.value?.getCellById(currentSelectedId);
  if (!currentNode || !currentNode.isNode()) return;

  const outgoingEdges = graph.value?.getOutgoingEdges(currentNode);
  if (!outgoingEdges || outgoingEdges.length === 0) {
    Modal.info({ title: '提示', content: '流程已结束！' });
    return;
  }

  // --- 核心逻辑：处理分支 ---
  if (outgoingEdges.length > 1) {
    const branchConditions = currentNode.getData()?.branchConditions;
    if (!branchConditions || Object.keys(branchConditions).length === 0) {
      Modal.warning({ title: '警告', content: '分支节点未设置条件！请双击节点进行编辑。' });
      return;
    }

    // 弹出包含选择按钮的 Modal
    Modal.confirm({
      title: '请选择下一步',
      content: h('div', { style: 'display: flex; flex-direction: column; gap: 8px;' }, [
        // 遍历 branchConditions，为每个分支创建一个按钮
        ...Object.entries(branchConditions).map(([targetNodeId, conditionText]) =>
          h(Button, {
            key: targetNodeId,
            type: 'primary',
            block: true, // 按钮占满一行
            onClick: () => {
              const targetNode = graph.value?.getCellById(targetNodeId);
              if (targetNode) {
                graph.value?.cleanSelection();
                graph.value?.select(targetNode);
                currentSelectedId = targetNode.id;
              }
              Modal.destroyAll(); // 点击后关闭所有弹窗
            },
          }, () => conditionText) // 按钮文本为条件描述
        ),
      ]),
      // 隐藏默认的 "OK" 和 "Cancel" 按钮
      okText: '取消',
      cancelButtonProps: { style: { display: 'none' } },
    });

  } else {
    // --- 普通线性节点 ---
    const nextNode = outgoingEdges[0].getTargetNode();
    if (nextNode) {
      graph.value?.cleanSelection();
      graph.value?.select(nextNode);
      currentSelectedId = nextNode.id;
      console.log(nextNode.shape)
    }
  }
};

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
                  fill: '#fff',
                },
              },
            },
            out: {
              position: 'right',
              attrs: {
                circle: {
                  r: 4,
                  magnet: true,
                  stroke: '#5F95FF',
                  strokeWidth: 1,
                  fill: '#fff',
                },
              },
            },
          },
          items: [
            { group: 'in', id: `in-${Date.now()}` },
            { group: 'out', id: `out-${Date.now()}` },
          ],
        },
      })

      graph.value!.addNode(node)
    } catch (error) {
      console.error('拖放创建节点失败:', error)
    }
  })
}

const initGraphEvents = () => {
  if (!graph.value) return

  // 节点双击事件
  graph.value.on('node:dblclick', ({ node }) => {
    if(node.shape === 'ellipse' && (node.getData().label === '开始' || node.getData().label === '结束')){
      editDrawerVisible.value = false
      return
    }
    // 判断是否为我们定义的分支节点
    if (node.shape === 'custom-game-node' || node.shape === 'custom-select-node') {
      message.success('选择了分支节点')
      const edges = graph.value?.getOutgoingEdges(node.id);
      // 没有后续节点
      if (!edges || edges.length === 0) {}else {
        for (const edge of edges) {
          const nextNode = edge.getTargetNode();
          console.log(nextNode?.id)
        }
      }
    }
    selectedNode.value = node
    selectedNodeData.value = node.getData()
    formState.label = selectedNodeData.value.label
    formState.properties = selectedNodeData.value.properties
    editDrawerVisible.value = true
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
