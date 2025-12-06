import { Shapes, SwatchBook, Tag } from 'lucide-react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { PostCategoryTable } from './_components/post-category-table'
import { PostTable } from './_components/post-table'
import { PostTagTable } from './_components/post-tag-table'

export default function Page() {
  return (
    <Tabs className="gap-card-small!" defaultValue="post">
      <TabsList>
        <TabsTrigger className="px-4 sm:px-8" value="post">
          <SwatchBook /> Post
        </TabsTrigger>
        <TabsTrigger className="px-4 sm:px-8" value="category">
          <Shapes /> Category
        </TabsTrigger>
        <TabsTrigger className="px-4 sm:px-8" value="tag">
          <Tag /> Tag
        </TabsTrigger>
      </TabsList>
      <TabsContent value="post">
        <PostTable />
      </TabsContent>
      <TabsContent value="category">
        <PostCategoryTable />
      </TabsContent>
      <TabsContent value="tag">
        <PostTagTable />
      </TabsContent>
    </Tabs>
  )
}
