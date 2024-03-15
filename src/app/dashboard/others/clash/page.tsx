'use client'

import { ClashGetResponseType, ClashPostRequest, ClashPostResponseType, ClashPutResponseType } from '@/app/api/dashboard/clash/route'
import ModalCore from '@/components/modal/ModalCore'
import ModalDelete from '@/components/modal/ModalDelete'
import TableTbodyEmpty from '@/components/table/TableTbodyEmpty'
import TableTheadProgress from '@/components/table/TableTheadProgress'
import TableWrapper from '@/components/table/TableWrapper'
import { formatISOTime } from '@/lib/parser/time'
import { CustomFetch } from '@/lib/server/fetch'
import { CustomToast } from '@/lib/toast'
import { Button, Chip, Table, Typography } from '@mui/joy'
import { produce } from 'immer'
import { useCopyToClipboard } from 'react-use'
import { toast } from 'sonner'
import useSWR from 'swr'
import ModalClash from './_/ModalClash'

const getClashs = async () => {
  return await CustomFetch<ClashGetResponseType>('/api/dashboard/clash')
}
const postClash = async (payload: ClashPostRequest) => {
  return await CustomFetch<ClashPostResponseType>('/api/dashboard/clash', {
    body: payload,
    method: 'POST'
  })
}
const putClash = async (id: string, payload: ClashPostRequest) => {
  return await CustomFetch<ClashPutResponseType>(`/api/dashboard/clash?id=${id}`, {
    body: payload,
    method: 'PUT'
  })
}
const deleteClash = async (id: string) => {
  return await CustomFetch<ClashPutResponseType>(`/api/dashboard/clash?id=${id}`, {
    method: 'DELETE'
  })
}

export default function Page() {
  const [{}, copy] = useCopyToClipboard()

  const {
    data: clashs,
    isLoading,
    mutate: setClashs
  } = useSWR('/api/dashboard/clash', getClashs, {
    fallbackData: [],
    refreshInterval: 10 * 1000
  })

  return (
    <TableWrapper>
      <Table>
        <thead>
          <tr>
            <th className="w-10 align-middle">#</th>
            <th className="w-40 align-middle">名称</th>
            <th className="w-40 align-middle">描述</th>
            <th className="w-16 align-middle">设备</th>
            <th className="w-16 align-middle">次数</th>
            <th className="w-44 align-middle">最近订阅时间</th>
            <th className="w-44 align-middle">更新时间</th>
            <th className="w-44 text-end">
              <ModalClash
                component={props => (
                  <Button color="success" size="sm" variant="plain" {...props}>
                    新建
                  </Button>
                )}
                onSubmit={async payload => {
                  const data = await CustomToast(postClash(payload), '添加成功')
                  setClashs(
                    produce(state => {
                      state.unshift(data)
                    })
                  )
                }}
              />
            </th>
          </tr>
          <TableTheadProgress colSpan={8} loading={isLoading} />
        </thead>
        <tbody>
          {clashs.map((clash, index) => (
            <tr key={clash.id}>
              <td>{index + 1}</td>
              <td>{clash.name}</td>
              <td>{clash.subtitle}</td>
              <td>
                <ModalCore
                  component={props => (
                    <Chip className="rounded" color="warning" disabled={clash.visitorInfos.length == 0} {...props}>
                      {clash.visitorInfos.length}
                    </Chip>
                  )}
                >
                  {clash.visitorInfos.map(visitorInfo => (
                    <div key={visitorInfo.id} className="ml-4 mt-2 list-item max-w-screen-xl space-y-1.5 first:mt-0">
                      <div className="space-x-3">
                        <Chip className="rounded" color="primary">
                          {visitorInfo.ip}
                        </Chip>
                        <Chip className="rounded" color="warning">
                          {formatISOTime(visitorInfo.createdAt)}
                        </Chip>
                      </div>
                      <Typography className="break-all" level="body-sm">
                        {visitorInfo.agent}
                      </Typography>
                    </div>
                  ))}
                </ModalCore>
              </td>
              <td>{clash.subscribeTimes}</td>
              <td>{clash.subscribeLastAt ? formatISOTime(clash.subscribeLastAt) : null}</td>
              <td>{formatISOTime(clash.updatedAt)}</td>
              <td className="text-end">
                <ModalDelete
                  component={props => (
                    <Button color="danger" size="sm" variant="plain" {...props}>
                      删除
                    </Button>
                  )}
                  title="删除"
                  onSubmit={async () => {
                    await CustomToast(deleteClash(clash.id), '删除成功')
                    setClashs(
                      produce(state => {
                        state.splice(index, 1)
                      })
                    )
                  }}
                />
                <Button
                  color="warning"
                  size="sm"
                  variant="plain"
                  onClick={() => {
                    copy(new URL(`/api/clash?subscribe=${clash.id}`, window.location.href).href)
                    toast.success('复制成功')
                  }}
                >
                  分享
                </Button>
                <ModalClash
                  component={props => (
                    <Button size="sm" variant="plain" {...props}>
                      编辑
                    </Button>
                  )}
                  value={clash}
                  onSubmit={async payload => {
                    const data = await CustomToast(putClash(clash.id, payload), '修改成功')
                    setClashs(
                      produce(state => {
                        state.splice(index, 1, data)
                      })
                    )
                  }}
                />
              </td>
            </tr>
          ))}
          <TableTbodyEmpty colSpan={8} enable={clashs.length == 0 && !isLoading} />
        </tbody>
      </Table>
    </TableWrapper>
  )
}
