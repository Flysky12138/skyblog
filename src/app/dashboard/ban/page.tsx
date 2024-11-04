'use client'

import { EdgeBanKeysType } from '@/app/api/dashboard/ban/route'
import { CustomRequest } from '@/lib/server/request'
import { Toast } from '@/lib/toast'
import { produce } from 'immer'
import React from 'react'
import useSWR from 'swr'
import CardBan from './_components/CardBan'

export default function Page() {
  const { data: edgeBanConfig, mutate } = useSWR('/api/dashboard/ban', () => CustomRequest('GET api/dashboard/ban', {}))

  const editEdgeBanConfigItem = React.useCallback(
    async (type: 'PUT' | 'DELETE', key: EdgeBanKeysType, value: string[]) => {
      await Toast(CustomRequest('PUT api/dashboard/ban', { body: { key, value } }), {
        success: type == 'PUT' ? '添加成功' : '删除成功'
      })
      mutate(
        produce(state => {
          state[key] = value
        }),
        { revalidate: false }
      )
    },
    [mutate]
  )

  return (
    <section className="space-y-10">
      <CardBan
        label="Ip"
        value={edgeBanConfig?.['ban-ips'] || []}
        onDelete={payload => editEdgeBanConfigItem('DELETE', 'ban-ips', payload)}
        onSubmit={payload => editEdgeBanConfigItem('PUT', 'ban-ips', payload)}
      />
      <CardBan
        label="Country"
        value={edgeBanConfig?.['ban-countries'] || []}
        onDelete={payload => editEdgeBanConfigItem('DELETE', 'ban-countries', payload)}
        onSubmit={payload => editEdgeBanConfigItem('PUT', 'ban-countries', payload)}
      />
      <CardBan
        label="Country Region"
        value={edgeBanConfig?.['ban-country-regions'] || []}
        onDelete={payload => editEdgeBanConfigItem('DELETE', 'ban-country-regions', payload)}
        onSubmit={payload => editEdgeBanConfigItem('PUT', 'ban-country-regions', payload)}
      />
      <CardBan
        label="City"
        value={edgeBanConfig?.['ban-cities'] || []}
        onDelete={payload => editEdgeBanConfigItem('DELETE', 'ban-cities', payload)}
        onSubmit={payload => editEdgeBanConfigItem('PUT', 'ban-cities', payload)}
      />
      <CardBan
        description="不区分大小写"
        label="Agent"
        value={edgeBanConfig?.['ban-agents'] || []}
        onDelete={payload => editEdgeBanConfigItem('DELETE', 'ban-agents', payload)}
        onSubmit={payload => editEdgeBanConfigItem('PUT', 'ban-agents', payload)}
      />
      <CardBan
        description="不区分大小写"
        label="Referer"
        value={edgeBanConfig?.['ban-referers'] || []}
        onDelete={payload => editEdgeBanConfigItem('DELETE', 'ban-referers', payload)}
        onSubmit={payload => editEdgeBanConfigItem('PUT', 'ban-referers', payload)}
      />
    </section>
  )
}
