import { Route } from 'next'
import Link from 'next/link'

import { Avatar } from '@/components/avatar'
import { Card } from '@/components/static/card'

interface ToolGroup {
  children: {
    description: string
    href: `/toolbox/${string}`
    label: string
  }[]
  title: string
}

const ToolGroup: ToolGroup[] = [
  {
    children: [
      {
        description: '共享会员，下载网易云音乐歌曲',
        href: '/toolbox/netease-cloud-music',
        label: '网易云音乐'
      }
    ],
    title: '工具'
  },
  {
    children: [
      {
        description: 'ECharts 在线编辑预览，带类型提示',
        href: '/toolbox/echarts',
        label: 'ECharts'
      }
    ],
    title: '开发'
  },
  {
    children: [
      {
        description: '在线计算圆周率数值',
        href: '/toolbox/pi',
        label: 'Pi'
      }
    ],
    title: '其他'
  }
]

export default function Page() {
  return (
    <div className="space-y-8">
      {ToolGroup.map(group => (
        <div key={group.title}>
          <h2 className="font-title text-xl font-medium">{group.title}</h2>
          <ul className="gap-card mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {group.children.map(child => (
              <li key={child.label}>
                <Card asChild className="p-card flex gap-4">
                  <Link href={child.href as Route}>
                    <Avatar border shadow size={55} style="shape" value={child.label} />
                    <div className="space-y-1">
                      <h3 className="text-lg">{child.label}</h3>
                      <h4 className="text-muted-foreground text-sm">{child.description}</h4>
                    </div>
                  </Link>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
