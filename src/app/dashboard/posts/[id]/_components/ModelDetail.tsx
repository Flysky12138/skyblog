import FormInputMultiple from '@/components/form/FormInputMultiple'
import ModalCore, { ModalCoreProps } from '@/components/modal/ModalCore'
import { CustomRequest } from '@/lib/server/request'
import { FormControl, FormLabel, Input, Switch, Textarea } from '@mui/joy'
import useSWR from 'swr'
import { Updater } from 'use-immer'
import { uuidv7 } from 'uuidv7'
import { DefaultPostType } from '../page'
import ModalChips from './ModalChips'

interface ModelDetailProps extends Pick<ModalCoreProps, 'component'> {
  onChange: Updater<ModelDetailProps['value']>
  value: DefaultPostType
}

export default function ModelDetail({ component: Component, value: post, onChange: setPost }: ModelDetailProps) {
  const { data: categories } = useSWR('/api/dashboard/posts/categories', () => CustomRequest('GET api/dashboard/posts/categories', {}))
  const { data: tags } = useSWR('/api/dashboard/posts/tags', () => CustomRequest('GET api/dashboard/posts/tags', {}))

  return (
    <ModalCore component={Component}>
      <section className="grid max-w-screen-md grid-cols-2 gap-x-6 gap-y-4">
        <FormControl required className="col-span-2">
          <FormLabel>标题</FormLabel>
          <Input
            value={post.title}
            variant="outlined"
            onChange={event => {
              setPost(state => {
                state.title = event.target.value
              })
            }}
          />
        </FormControl>
        <FormControl className="col-span-2">
          <FormLabel>描述</FormLabel>
          <Textarea
            className="min-h-[64px]"
            minRows={2}
            value={post.description || ''}
            variant="outlined"
            onChange={event => {
              setPost(state => {
                state.description = event.target.value || null
              })
            }}
          />
        </FormControl>
        <FormControl className="col-span-2 md:col-span-1">
          <FormLabel>分类</FormLabel>
          <FormInputMultiple
            endDecorator={
              <ModalChips
                select={post.categories}
                value={categories || []}
                onChange={payload => {
                  setPost(state => {
                    state.categories = payload
                  })
                }}
              />
            }
            getChipValue={({ name }) => name}
            value={post.categories}
            onAdd={name => {
              setPost(state => {
                state.categories.push({ name, id: uuidv7() })
              })
            }}
            onDelete={names => {
              setPost(state => {
                state.categories = state.categories.filter(({ name }) => !names.includes(name))
              })
            }}
          />
        </FormControl>
        <FormControl className="col-span-2 md:col-span-1">
          <FormLabel>标签</FormLabel>
          <FormInputMultiple
            endDecorator={
              <ModalChips
                select={post.tags}
                value={tags || []}
                onChange={payload => {
                  setPost(state => {
                    state.tags = payload
                  })
                }}
              />
            }
            getChipValue={({ name }) => name}
            value={post.tags}
            onAdd={name => {
              setPost(state => {
                state.tags.push({ name, id: uuidv7() })
              })
            }}
            onDelete={names => {
              setPost(state => {
                state.tags = state.tags.filter(({ name }) => !names.includes(name))
              })
            }}
          />
        </FormControl>
        <div className="col-span-2 my-1 flex gap-x-10">
          <FormControl className="w-32" orientation="horizontal">
            <FormLabel className="shrink-0">置顶</FormLabel>
            <Input
              type="number"
              value={post.sticky}
              variant="outlined"
              onChange={event => {
                setPost(state => {
                  state.sticky = Math.max(0, Number.parseInt(event.target.value || '0'))
                })
              }}
              onFocus={event => event.target.select()}
            />
          </FormControl>
          <FormControl orientation="horizontal">
            <FormLabel>显示标题卡片</FormLabel>
            <Switch
              checked={post.showTitleCard}
              color={post.showTitleCard ? 'success' : 'neutral'}
              size="lg"
              onChange={event => {
                setPost(state => {
                  state.showTitleCard = event.target.checked
                })
              }}
            />
          </FormControl>
        </div>
      </section>
    </ModalCore>
  )
}
