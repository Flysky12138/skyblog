import ListItemExpand, { ListItemExpandProps } from '@/components/list/ListItemExpand'
import ListItemLink from '@/components/list/ListItemLink'
import { cn } from '@/lib/cn'
import { BlockOutlined, BubbleChart, GitHub, HomeOutlined, PermIdentityOutlined, SettingsOutlined, SourceOutlined } from '@mui/icons-material'
import { List, ListItem, ListItemContent, ListItemDecorator } from '@mui/joy'
import React from 'react'

type ListOptionType = XOR<
  {
    href: string
    icon: React.ReactElement
    label: string
  },
  {
    children: {
      href: string
      label: string
    }[]
  } & Omit<ListItemExpandProps, 'children'>
>

const listOptions: ListOptionType[] = [
  {
    href: '/dashboard',
    icon: <HomeOutlined />,
    label: '主页'
  },
  {
    defaultExpanded: true,
    icon: <SourceOutlined />,
    label: '文章',
    children: [
      { href: '/dashboard/posts', label: '列表' },
      { href: '/dashboard/posts/new', label: '新建' }
    ]
  },
  {
    defaultExpanded: 'users',
    icon: <PermIdentityOutlined />,
    label: '用户',
    children: [
      { href: '/dashboard/users/member', label: '成员' },
      { href: '/dashboard/users/visitor', label: '访客' }
    ]
  },
  {
    defaultExpanded: 'others',
    icon: <BubbleChart />,
    label: '其他',
    children: [
      { href: '/dashboard/others/clash', label: 'Clash 共享' },
      { href: '/dashboard/others/friend-links', label: '友情链接' }
    ]
  },
  {
    href: '/dashboard/ban',
    icon: <BlockOutlined />,
    label: '黑名单'
  },
  {
    href: '/dashboard/github',
    icon: <GitHub />,
    label: '仓库'
  },
  {
    href: '/dashboard/settings',
    icon: <SettingsOutlined />,
    label: '设置'
  }
]

interface MenuProps {
  className?: string
}

export default function Menu({ className }: MenuProps) {
  return (
    <List
      className={cn('select-none overflow-y-auto overflow-x-hidden first:[&>li]:mt-0', className)}
      size="sm"
      sx={{
        '--List-gap': '10px',
        '--ListItem-radius': '8px'
      }}
    >
      {listOptions.map((it, index) => (
        <React.Fragment key={index}>
          {Reflect.has(it, 'href') ? (
            <ListItem>
              <ListItemLink href={it.href!}>
                <ListItemDecorator>{it.icon}</ListItemDecorator>
                <ListItemContent>{it.label}</ListItemContent>
              </ListItemLink>
            </ListItem>
          ) : (
            <ListItem nested>
              <ListItemExpand defaultExpanded={it.defaultExpanded} icon={it.icon} label={it.label}>
                <List>
                  {it.children?.map(({ href, label }, index) => (
                    <ListItem key={index}>
                      <ListItemLink href={href}>
                        <ListItemDecorator></ListItemDecorator>
                        <ListItemContent>{label}</ListItemContent>
                      </ListItemLink>
                    </ListItem>
                  ))}
                </List>
              </ListItemExpand>
            </ListItem>
          )}
        </React.Fragment>
      ))}
    </List>
  )
}
