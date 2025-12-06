export interface ToolGroup {
  children: {
    _blank?: boolean
    description: string
    href: `/toolbox/${string}`
    id: 'echarts' | 'netease-cloud-music' | 'pi'
    title: string
  }[]
  id: 'develop' | 'other' | 'tool'
  title: string
}

export const toolGroup: ToolGroup[] = [
  {
    children: [
      {
        description: '共享会员，下载网易云音乐歌曲',
        href: '/toolbox/netease-cloud-music',
        id: 'netease-cloud-music',
        title: '网易云音乐'
      }
    ],
    id: 'tool',
    title: '工具'
  },
  {
    children: [
      {
        _blank: true,
        description: 'ECharts 在线编辑预览，带类型提示',
        href: '/toolbox/echarts',
        id: 'echarts',
        title: 'ECharts'
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
        title: 'Pi'
      }
    ],
    id: 'other',
    title: '其他'
  }
]
