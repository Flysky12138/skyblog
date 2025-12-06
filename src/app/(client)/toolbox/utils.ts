interface ToolGroup {
  children: {
    description: string
    href: `/toolbox/${string}`
    id: string
    label: string
  }[]
  id: string
  title: string
}

export const toolGroup: ToolGroup[] = [
  {
    children: [
      {
        description: '共享会员，下载网易云音乐歌曲',
        href: '/toolbox/netease-cloud-music',
        id: 'netease-cloud-music',
        label: '网易云音乐'
      }
    ],
    id: 'tool',
    title: '工具'
  },
  {
    children: [
      {
        description: 'ECharts 在线编辑预览，带类型提示',
        href: '/toolbox/echarts',
        id: 'echarts',
        label: 'ECharts'
      }
    ],
    id: 'develop',
    title: '开发'
  },
  {
    children: [
      {
        description: '在线计算圆周率数值',
        href: '/toolbox/pi',
        id: 'pi',
        label: 'Pi'
      }
    ],
    id: 'other',
    title: '其他'
  }
]
