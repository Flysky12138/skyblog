import { ExternalLinkIcon } from 'lucide-react'
import Link from 'next/link'

import { Card } from '@/components/static/card'
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Tool, tools } from './utils'

export default async function Page() {
  return (
    <Tabs className="gap-4" defaultValue={tools[0].id}>
      <TabsList>
        {tools.map(item => (
          <TabsTrigger key={item.id} className="w-20 sm:w-32" value={item.id}>
            {item.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {tools.map(item => (
        <TabsContent key={item.id} className="space-y-3" value={item.id}>
          {item.children.length ? (
            item.children.map(child => (
              <Card
                key={child.id}
                className="rounded-lg"
                render={
                  <Item render={<Link href={child.href} target={(child as Tool['children'][number])._blank ? '_blank' : undefined} />}>
                    <ItemContent>
                      <ItemTitle>{child.title}</ItemTitle>
                      <ItemDescription>{child.description}</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <ExternalLinkIcon className="size-4" />
                    </ItemActions>
                  </Item>
                }
              />
            ))
          ) : (
            <p className="py-card font-heading px-1">无内容</p>
          )}
        </TabsContent>
      ))}
    </Tabs>
  )
}
