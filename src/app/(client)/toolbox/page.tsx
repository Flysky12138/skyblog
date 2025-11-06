import { ExternalLinkIcon } from 'lucide-react'
import { Route } from 'next'
import Link from 'next/link'

import { Card } from '@/components/static/card'
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ToolGroup {
  children: {
    description: string
    href: `/toolbox/${string}`
    label: string
  }[]
  title: string
}

const toolGroup: ToolGroup[] = [
  {
    children: [{ description: '共享会员，下载网易云音乐歌曲', href: '/toolbox/netease-cloud-music', label: '网易云音乐' }],
    title: '工具'
  },
  {
    children: [{ description: 'ECharts 在线编辑预览，带类型提示', href: '/toolbox/echarts', label: 'ECharts' }],
    title: '开发'
  },
  {
    children: [{ description: '在线计算圆周率数值', href: '/toolbox/pi', label: 'Pi' }],
    title: '其他'
  }
]

export default function Page() {
  return (
    <Tabs className="gap-3" defaultValue={toolGroup[0].title}>
      <TabsList>
        {toolGroup.map(item => (
          <TabsTrigger key={item.title} className="w-20 sm:w-32" value={item.title}>
            {item.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {toolGroup.map(item => (
        <TabsContent key={item.title} className="space-y-3" value={item.title}>
          {item.children.map(child => (
            <Card key={child.label} asChild>
              <Item asChild>
                <Link href={child.href as Route}>
                  <ItemContent>
                    <ItemTitle>{child.label}</ItemTitle>
                    <ItemDescription>{child.description}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <ExternalLinkIcon className="size-4" />
                  </ItemActions>
                </Link>
              </Item>
            </Card>
          ))}
        </TabsContent>
      ))}
    </Tabs>
  )
}
