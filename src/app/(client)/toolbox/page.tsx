import { ExternalLinkIcon } from 'lucide-react'
import { Route } from 'next'
import Link from 'next/link'

import { Card } from '@/components/static/card'
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { ToolGroup, toolGroup } from './utils'

export default async function Page({ searchParams }: PageProps<'/toolbox'>) {
  const { tab = 'tool' } = (await searchParams) as { tab?: ToolGroup['id'] }

  return (
    <Tabs className="gap-card-small!" defaultValue={tab}>
      <TabsList>
        {toolGroup.map(item => (
          <TabsTrigger key={item.id} asChild className="w-20 sm:w-32" value={item.id}>
            <Link
              replace
              href={{
                pathname: '/toolbox',
                query: {
                  tab: item.id
                }
              }}
            >
              {item.title}
            </Link>
          </TabsTrigger>
        ))}
      </TabsList>
      {toolGroup.map(item => (
        <TabsContent key={item.id} className="space-y-3" value={item.id}>
          {item.children.map(child => (
            <Card key={child.id} asChild>
              <Item asChild>
                <Link href={child.href as Route} {...(child._blank ? { target: '_blank' } : {})}>
                  <ItemContent>
                    <ItemTitle>{child.title}</ItemTitle>
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
