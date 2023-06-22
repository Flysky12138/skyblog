'use client'

import {
  ClashTemplateGetResponseType,
  ClashTemplatePostRequest,
  ClashTemplatePostResponseType,
  ClashTemplatePutRequest,
  ClashTemplatePutResponseType
} from '@/app/api/dashboard/clash/template/route'
import ModalDelete from '@/components/modal/ModalDelete'
import TableTbodyEmpty from '@/components/table/TableTbodyEmpty'
import TableTheadProgress from '@/components/table/TableTheadProgress'
import TableWrapper from '@/components/table/TableWrapper'
import { formatISOTime } from '@/lib/parser/time'
import { CustomFetch } from '@/lib/server/fetch'
import { Toast } from '@/lib/toast'
import { Button, Table } from '@mui/joy'
import { produce } from 'immer'
import useSWR from 'swr'
import ModalTemplate from './ModalTemplate'

const getClashTemplates = async () => {
  return await CustomFetch<ClashTemplateGetResponseType>('/api/dashboard/clash/template')
}
const postClashTemplate = async (payload: ClashTemplatePostRequest) => {
  return await CustomFetch<ClashTemplatePostResponseType>('/api/dashboard/clash/template', {
    body: payload,
    method: 'POST'
  })
}
const putClashTemplate = async (id: number, payload: ClashTemplatePutRequest) => {
  return await CustomFetch<ClashTemplatePutResponseType>(`/api/dashboard/clash/template?id=${id}`, {
    body: payload,
    method: 'PUT'
  })
}
const deleteClashTemplate = async (id: number) => {
  return await CustomFetch<ClashTemplatePutResponseType>(`/api/dashboard/clash/template?id=${id}`, {
    method: 'DELETE'
  })
}

export default function Template() {
  const {
    data: clashTemplates,
    isLoading,
    mutate: setClashTemplates
  } = useSWR('/api/dashboard/clash/template', getClashTemplates, {
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
                onSubmit={async payload => {
                  const data = await Toast(postClashTemplate(payload), '添加成功')
                  setClashTemplates(
                    produce(state => {
                      state.unshift(data)
                    })
                  )
                }}
              />
            </th>
          </tr>
          <TableTheadProgress colSpan={6} loading={isLoading} />
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
                    await Toast(deleteClashTemplate(clashTemplate.id), '删除成功')
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
                    const data = await Toast(putClashTemplate(clashTemplate.id, { name, content }), '修改成功')
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
