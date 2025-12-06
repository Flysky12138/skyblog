import { Metadata } from 'next'

interface ToolGroup {
  id: string
  title: string
  children: {
    _blank?: boolean
    description: string
    href: `/toolbox/${string}`
    id: string
    title: string
  }[]
}

export const toolGroup = [
  {
    id: 'tool',
    title: '工具',
    children: [
      {
        description: '本地处理的图片压缩和格式转换工具',
        href: '/toolbox/image-compression',
        id: 'image-compression',
        title: '图片压缩'
      }
    ]
  },
  {
    id: 'develop',
    title: '开发',
    children: [
      {
        _blank: true,
        description: 'ECharts 在线编辑预览，带类型提示',
        href: '/toolbox/echarts',
        id: 'echarts',
        title: 'ECharts'
      }
    ]
  },
  {
    id: 'other',
    title: '其他',
    children: [
      {
        description: '共享会员，下载网易云音乐歌曲',
        href: '/toolbox/netease-cloud-music',
        id: 'netease-cloud-music',
        title: '网易云音乐'
      },
      {
        description: '在线计算圆周率数值',
        href: '/toolbox/pi',
        id: 'pi',
        title: 'Pi'
      }
    ]
  }
] as const satisfies ToolGroup[]

type StaticToolGroup = (typeof toolGroup)[number]

export const getToolPageMetadata = <T extends StaticToolGroup['id'], K extends Extract<StaticToolGroup, { id: T }>['children'][number]['id']>(
  id: T,
  cId: K
): Metadata => {
  const { description, title } = toolGroup.find(group => group.id == id)!.children.find(child => child.id == cId)!

  return {
    description,
    title
  }
}
