import { Graph } from '@antv/x6'
import { register } from '@antv/x6-vue-shape'
import BasicNode from '@/components/BasicNode.vue'


// 注册Vue节点
register({
  shape: 'custom-basic-node',
  width: 120,
  height: 'auto',
  component: BasicNode,
  data: {
    label: '',
    properties: []
  }
})

// 注册自定义边
Graph.registerEdge(
  'custom-edge',
  {
    inherit: 'edge',
    attrs: {
      line: {
        stroke: '#A2B1C3',
        strokeWidth: 2,
        strokeDasharray: '0',
        targetMarker: {
          name: 'block',
          width: 12,
          height: 8
        }
      }
    },
    connector: { name: 'rounded' },
    router: {
      name: 'manhattan'
    }
  },
  true
)

// 定义节点类型
export const nodeTypes = [
  {
    type: 'process',
    name: '处理节点',
    shape: 'custom-basic-node',
    width: 120,
    height: 80,
    data: {
      label: '处理节点',
      properties: ['数据处理']
    }
  },
  {
    type: 'decision',
    name: '判断节点',
    shape: 'custom-basic-node',
    width: 120,
    height: 80,
    data: {
      label: '判断节点',
      properties: ['条件判断']
    }
  },
  {
    type: 'start',
    name: '开始节点',
    shape: 'custom-basic-node',
    width: 120,
    height: 80,
    data: {
      label: '开始',
      properties: ['开始流程']
    }
  },
  {
    type: 'end',
    name: '结束节点',
    shape: 'custom-basic-node',
    width: 120,
    height: 80,
    data: {
      label: '结束',
      properties: ['结束流程']
    }
  }
]
