'use cache'

import { Octokit } from '@octokit/rest'
import { AlertCircleIcon, ChevronRightIcon } from 'lucide-react'
import { cacheLife } from 'next/cache'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { Item, ItemActions, ItemContent, ItemTitle } from '@/components/ui/item'

export default async function Page() {
  cacheLife('hours')

  const octokit = new Octokit()

  const [{ data: release1 }, { data: release2 }] = await Promise.all([
    octokit.repos.getLatestRelease({ owner: 'MetaCubeX', repo: 'ClashMetaForAndroid' }),
    octokit.repos.getLatestRelease({ owner: 'clash-verge-rev', repo: 'clash-verge-rev' })
  ])

  return (
    <div className="mx-auto max-w-md space-y-10 p-4">
      <div className="mt-4 sm:mt-10">
        <Alert>
          <AlertCircleIcon />
          <AlertTitle>禁止浏览器访问</AlertTitle>
          <AlertDescription>这是 Clash 的订阅地址，请直接在客户端中添加订阅，不要用浏览器打开。</AlertDescription>
        </Alert>
      </div>

      <FieldSet>
        <FieldLegend>客户端下载</FieldLegend>
        <FieldDescription>点击将跳转到 Github Release 页面</FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel>Android</FieldLabel>
            <Item asChild size="sm" variant="outline">
              <a href={release1.html_url} target="_blank">
                <ItemContent>
                  <ItemTitle>ClashMetaForAndroid@{release1.tag_name}</ItemTitle>
                </ItemContent>
                <ItemActions>
                  <ChevronRightIcon className="size-4" />
                </ItemActions>
              </a>
            </Item>
          </Field>
          <Field>
            <FieldLabel>Windows / macOS / Linux</FieldLabel>
            <Item asChild size="sm" variant="outline">
              <a href={release2.html_url} target="_blank">
                <ItemContent>
                  <ItemTitle>clash-verge-rev@{release2.tag_name}</ItemTitle>
                </ItemContent>
                <ItemActions>
                  <ChevronRightIcon className="size-4" />
                </ItemActions>
              </a>
            </Item>
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  )
}
