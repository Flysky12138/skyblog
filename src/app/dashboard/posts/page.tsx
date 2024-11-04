'use client'

import FormSelectClearable from '@/components/form/FormSelectClearable'
import ModalDelete from '@/components/modal/ModalDelete'
import TableStatus from '@/components/table/TableStatus'
import TableWrapper from '@/components/table/TableWrapper'
import { removeDuplicates } from '@/lib/parser/array'
import { CustomRequest } from '@/lib/server/request'
import { Toast } from '@/lib/toast'
import { Search } from '@mui/icons-material'
import { Button, FormControl, FormLabel, Input, Option, Switch, Table } from '@mui/joy'
import { produce } from 'immer'
import Link from 'next/link'
import React from 'react'
import useSWR from 'swr'
import { useImmer } from 'use-immer'

export default function Page() {
  const {
    data: posts,
    isLoading,
    mutate: setPosts
  } = useSWR('/api/dashboard/posts', () => CustomRequest('GET api/dashboard/posts', {}), {
    fallbackData: []
  })

  // 获取所有分类和标签
  const categories = React.useMemo(() => {
    return removeDuplicates(
      posts.flatMap(post => post.categories),
      (pre, cur) => !pre.find(category => category.id == cur.id)
    )
  }, [posts])
  const tags = React.useMemo(() => {
    return removeDuplicates(
      posts.flatMap(post => post.tags),
      (pre, cur) => !pre.find(tag => tag.id == cur.id)
    )
  }, [posts])

  // 过滤表单
  const [form, setForm] = useImmer<{
    categoryId: string | null
    published: boolean | null
    tagId: string | null
    title: string
  }>({ categoryId: null, published: null, tagId: null, title: '' })

  const postsFilter = React.useMemo(() => {
    return posts.filter(post => {
      return (
        (!form.title || post.title.toLowerCase().includes(form.title.toLowerCase())) &&
        (form.published == null || post.published == form.published) &&
        (form.categoryId == null || post.categories.find(({ id }) => id == form.categoryId)) &&
        (form.tagId == null || post.tags.find(({ id }) => id == form.tagId))
      )
    })
  }, [form.categoryId, form.published, form.tagId, form.title, posts])

  return (
    <section className="flex h-full flex-col">
      <div className="flex flex-wrap gap-x-6 gap-y-4">
        <div className="flex w-full grow gap-x-6 lg:w-auto">
          <FormControl className="grow">
            <FormLabel>标题</FormLabel>
            <Input
              startDecorator={<Search />}
              value={form.title}
              variant="outlined"
              onChange={event => {
                setForm(state => {
                  state.title = event.target.value
                })
              }}
            />
          </FormControl>
          <FormControl className="w-28">
            <FormLabel>状态</FormLabel>
            <FormSelectClearable
              clearable={form.published != null}
              value={form.published}
              onChange={(_, newValue) => {
                setForm(state => {
                  state.published = newValue
                })
              }}
              onClear={() => {
                setForm(state => {
                  state.published = null
                })
              }}
            >
              <Option value={true}>公开</Option>
              <Option value={false}>隐藏</Option>
            </FormSelectClearable>
          </FormControl>
        </div>
        <div className="flex w-full gap-x-6 lg:w-96">
          <FormControl className="flex-1">
            <FormLabel>分类</FormLabel>
            <FormSelectClearable
              clearable={form.categoryId != null}
              disabled={!categories.length}
              value={form.categoryId}
              onChange={(_, newValue) => {
                setForm(state => {
                  state.categoryId = newValue
                })
              }}
              onClear={() => {
                setForm(state => {
                  state.categoryId = null
                })
              }}
            >
              {categories.map(({ id, name }) => (
                <Option key={id} value={id}>
                  {name}
                </Option>
              ))}
            </FormSelectClearable>
          </FormControl>
          <FormControl className="flex-1">
            <FormLabel>标签</FormLabel>
            <FormSelectClearable
              clearable={form.tagId != null}
              disabled={!tags.length}
              value={form.tagId}
              onChange={(_, newValue) => {
                setForm(state => {
                  state.tagId = newValue
                })
              }}
              onClear={() => {
                setForm(state => {
                  state.tagId = null
                })
              }}
            >
              {tags.map(({ id, name }) => (
                <Option key={id} value={id}>
                  {name}
                </Option>
              ))}
            </FormSelectClearable>
          </FormControl>
        </div>
      </div>
      <TableWrapper className="mt-6">
        <Table stickyFooter stickyHeader>
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
            {postsFilter.map((post, index) => (
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
            <TableStatus colSpan={7} isEmpty={postsFilter.length == 0} isLoading={isLoading} />
          </tbody>
          {/* <tfoot>
            <tr>
              <td colSpan={7}></td>
            </tr>
          </tfoot> */}
        </Table>
      </TableWrapper>
    </section>
  )
}
