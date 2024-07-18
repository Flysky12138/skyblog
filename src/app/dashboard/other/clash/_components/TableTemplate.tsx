'use client'

import ModalDelete from '@/components/modal/ModalDelete'
import TableTbodyEmpty from '@/components/table/TableTbodyEmpty'
import TableTheadLoading from '@/components/table/TableTheadLoading'
import TableWrapper from '@/components/table/TableWrapper'
import { formatISOTime } from '@/lib/parser/time'
import { CustomRequest } from '@/lib/server/request'
import { Toast } from '@/lib/toast'
import { Button, Table } from '@mui/joy'
import { produce } from 'immer'
import useSWR from 'swr'
import ModalTemplate from './ModalTemplate'

export default function TableTemplate() {
  const {
    data: clashTemplates,
    isLoading,
    mutate: setClashTemplates
  } = useSWR('/api/dashboard/clash/template', () => CustomRequest('GET api/dashboard/clash/template', {}), {
    fallbackData: []
  })

  return (
    <TableWrapper>
      <Table>
        <thead>
          <tr>
            <th className="w-10 align-middle">#</th>
            <th className="w-40 align-middle xl:w-96">名称</th>
            <th className="w-16 align-middle">引用</th>
            <th className="w-44 align-middle">创建时间</th>
            <th className="w-44 align-middle">更新时间</th>
            <th className="w-44 text-end">
              <ModalTemplate
                component={props => (
                  <Button color="success" size="sm" variant="plain" {...props}>
                    新建
                  </Button>
                )}
                onSubmit={async body => {
                  const data = await Toast(CustomRequest('POST api/dashboard/clash/template', { body }), '添加成功')
                  setClashTemplates(
                    produce(state => {
                      state.unshift(data)
                    })
                  )
                }}
              />
            </th>
          </tr>
          <TableTheadLoading colSpan={6} loading={isLoading} />
        </thead>
        <tbody>
          {clashTemplates.map((clashTemplate, index) => (
            <tr key={clashTemplate.id}>
              <td>{index + 1}</td>
              <td>{clashTemplate.name}</td>
              <td>{clashTemplate._count.clashs}</td>
              <td>{formatISOTime(clashTemplate.createdAt)}</td>
              <td>{formatISOTime(clashTemplate.updatedAt)}</td>
              <td className="text-end">
                <ModalDelete
                  component={props => (
                    <Button color="danger" size="sm" variant="plain" {...props}>
                      删除
                    </Button>
                  )}
                  title="删除"
                  onSubmit={async () => {
                    await Toast(CustomRequest('DELETE api/dashboard/clash/template', { search: { id: clashTemplate.id } }), '删除成功')
                    setClashTemplates(
                      produce(state => {
                        state.splice(index, 1)
                      })
                    )
                  }}
                />
                <ModalTemplate
                  component={props => (
                    <Button size="sm" variant="plain" {...props}>
                      编辑
                    </Button>
                  )}
                  value={clashTemplate}
                  onSubmit={async ({ name, content }) => {
                    const data = await Toast(
                      CustomRequest('PUT api/dashboard/clash/template', {
                        body: { content, name },
                        search: { id: clashTemplate.id }
                      }),
                      '修改成功'
                    )
                    setClashTemplates(
                      produce(state => {
                        state.splice(index, 1, data)
                      })
                    )
                  }}
                />
              </td>
            </tr>
          ))}
          <TableTbodyEmpty colSpan={6} enable={clashTemplates.length == 0 && !isLoading} />
        </tbody>
      </Table>
    </TableWrapper>
  )
}
