'use client'

import ModalDelete from '@/components/modal/ModalDelete'
import Table from '@/components/table/Table'
import TableStatus from '@/components/table/TableStatus'
import { CustomRequest } from '@/lib/server/request'
import { Toast } from '@/lib/toast'
import { Button, Switch } from '@mui/joy'
import { produce } from 'immer'
import Link from 'next/link'
import useSWR from 'swr'

export default function Page() {
  const {
    data: posts,
    isLoading,
    mutate: setPosts
  } = useSWR('/api/dashboard/posts', () => CustomRequest('GET api/dashboard/posts', {}), {
    fallbackData: []
  })

  return (
    <Table>
      <thead>
        <tr>
          <th className="w-10">#</th>
          <th className="w-52">标题</th>
          <th className="w-80">描述</th>
          <th className="w-40">分类</th>
          <th className="w-40">标签</th>
          <th className="w-16">公开</th>
          <th className="w-44"></th>
        </tr>
      </thead>
      <tbody>
        {posts.map((post, index) => (
          <tr key={post.id}>
            <td>{index + 1}</td>
            <td>{post.title}</td>
            <td>
              <p className="truncate">{post.description}</p>
            </td>
            <td>{post.categories.map(category => category.name).join('、')}</td>
            <td>{post.tags.map(tag => tag.name).join('、')}</td>
            <td className="align-bottom">
              <Switch
                checked={post.published}
                color={post.published ? 'success' : 'warning'}
                onChange={async () => {
                  const data = await Toast(
                    CustomRequest('PATCH api/dashboard/posts/[id]', {
                      body: { published: !post.published },
                      params: { id: post.id }
                    }),
                    {
                      success: '更新成功'
                    }
                  )
                  setPosts(
                    produce(state => {
                      state.splice(index, 1, data)
                    })
                  )
                }}
              />
            </td>
            <td className="text-end">
              <ModalDelete
                component={props => (
                  <Button color="danger" size="sm" variant="plain" {...props}>
                    删除
                  </Button>
                )}
                description={post.title}
                onSubmit={async () => {
                  await Toast(CustomRequest('DELETE api/dashboard/posts/[id]', { params: { id: post.id } }), {
                    success: '删除成功'
                  })
                  setPosts(
                    produce(state => {
                      state.splice(index, 1)
                    })
                  )
                }}
              />
              <Button color="warning" component="a" href={`/posts/${post.id}`} size="sm" target="_blank" variant="plain">
                查看
              </Button>
              <Button component={Link} href={`/dashboard/posts/${post.id}`} size="sm" variant="plain">
                编辑
              </Button>
            </td>
          </tr>
        ))}
        <TableStatus colSpan={7} isEmpty={posts.length == 0} isLoading={isLoading} />
      </tbody>
    </Table>
  )
}
