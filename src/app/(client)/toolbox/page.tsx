'use client'

import { ExternalLinkIcon } from 'lucide-react'
import { Route } from 'next'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

import { Card } from '@/components/static/card'
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { toolGroup } from './utils'

const ids = toolGroup.map(group => group.id)

export default function Page() {
  const router = useRouter()

  let tab = useSearchParams().get('tab')
  tab = tab && ids.includes(tab) ? tab : null

  const [activeTab, setActiveTab] = React.useState(tab)

  const handleValueChange = React.useCallback(
    (value: null | string) => {
      setActiveTab(value)
      if (value) {
        router.replace(`/toolbox?tab=${value}`)
      }
    },
    [router]
  )

  React.useEffect(() => {
    handleValueChange(tab)
  }, [handleValueChange, tab])

  return (
    <Tabs className="gap-card-small!" value={activeTab || toolGroup[0].id} onValueChange={handleValueChange}>
      <TabsList>
        {toolGroup.map(item => (
          <TabsTrigger key={item.id} className="w-20 sm:w-32" value={item.id}>
            {item.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {toolGroup.map(item => (
        <TabsContent key={item.id} className="space-y-3" value={item.id}>
          {item.children.map(child => (
            <Card key={child.id} asChild>
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
