import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { ClashTable } from './_components/clash-table'
import { ClashTemplateTable } from './_components/clash-template-table'

export default function Page() {
  return (
    <Tabs className="gap-3" defaultValue="1">
      <TabsList className="grid w-60 grid-cols-2">
        <TabsTrigger value="1">共享列表</TabsTrigger>
        <TabsTrigger value="2">通用模板</TabsTrigger>
      </TabsList>
      <TabsContent value="1">
        <ClashTable />
      </TabsContent>
      <TabsContent value="2">
        <ClashTemplateTable />
      </TabsContent>
    </Tabs>
  )
}
