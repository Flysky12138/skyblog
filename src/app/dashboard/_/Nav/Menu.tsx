import Logo from '@/components/layout/Logo'
import ListItemExpand from '@/components/list/ListItemExpand'
import ListItemLink from '@/components/list/ListItemLink'
import ToggleTheme from '@/components/toggle/ToggleTheme'
import { cn } from '@/lib/cn'
import { BlockOutlined, BubbleChart, GitHub, HomeOutlined, PermIdentityOutlined, SettingsOutlined, SourceOutlined } from '@mui/icons-material'
import { List, ListItem, ListItemContent, ListItemDecorator } from '@mui/joy'
import Admin from './Admin'

export interface MenuPropsType {
  className?: string
}

export default function Menu({ className }: MenuPropsType) {
  return (
    <List
      className={cn('s-divider h-full select-none overflow-auto overflow-x-hidden bg-zinc-50 p-0 dark:bg-zinc-800', className)}
      size="sm"
      sx={{
        '--List-gap': '10px',
        '--ListItem-radius': '8px'
      }}
    >
      <ListItem className="hidden justify-between rounded-none border-b border-inherit px-4 py-3 md:flex">
        <Logo />
        <ToggleTheme
          slotsProps={{
            iconbutton: { color: 'neutral' },
            tooltip: { placement: 'left' }
          }}
        />
      </ListItem>
      <div className="overflow-y-auto px-4 py-1">
        <ListItem>
          <ListItemLink href="/dashboard">
            <ListItemDecorator>
              <HomeOutlined />
            </ListItemDecorator>
            <ListItemContent>主页</ListItemContent>
          </ListItemLink>
        </ListItem>
        <ListItem nested>
          <ListItemExpand defaultExpanded icon={<SourceOutlined />} label="文章">
            <List>
              <ListItem>
                <ListItemLink href="/dashboard/posts">
                  <ListItemDecorator></ListItemDecorator>
                  <ListItemContent>列表</ListItemContent>
                </ListItemLink>
              </ListItem>
              <ListItem>
                <ListItemLink href="/dashboard/posts/new">
                  <ListItemDecorator></ListItemDecorator>
                  <ListItemContent>新建</ListItemContent>
                </ListItemLink>
              </ListItem>
            </List>
          </ListItemExpand>
        </ListItem>
        <ListItem nested>
          <ListItemExpand defaultExpanded="users" icon={<PermIdentityOutlined />} label="用户">
            <List>
              <ListItem>
                <ListItemLink href="/dashboard/users/member">
                  <ListItemDecorator></ListItemDecorator>
                  <ListItemContent>成员</ListItemContent>
                </ListItemLink>
              </ListItem>
              <ListItem>
                <ListItemLink href="/dashboard/users/visitor">
                  <ListItemDecorator></ListItemDecorator>
                  <ListItemContent>访客</ListItemContent>
                </ListItemLink>
              </ListItem>
            </List>
          </ListItemExpand>
        </ListItem>
        <ListItem nested>
          <ListItemExpand defaultExpanded="others" icon={<BubbleChart />} label="其他">
            <List>
              <ListItem>
                <ListItemLink href="/dashboard/others/clash">
                  <ListItemDecorator></ListItemDecorator>
                  <ListItemContent>Clash 共享</ListItemContent>
                </ListItemLink>
              </ListItem>
              <ListItem>
                <ListItemLink href="/dashboard/others/friend-links">
                  <ListItemDecorator></ListItemDecorator>
                  <ListItemContent>友情链接</ListItemContent>
                </ListItemLink>
              </ListItem>
            </List>
          </ListItemExpand>
        </ListItem>
        <ListItem>
          <ListItemLink href="/dashboard/ban">
            <ListItemDecorator>
              <BlockOutlined />
            </ListItemDecorator>
            <ListItemContent>黑名单</ListItemContent>
          </ListItemLink>
        </ListItem>
        <ListItem>
          <ListItemLink href="/dashboard/github">
            <ListItemDecorator>
              <GitHub />
            </ListItemDecorator>
            <ListItemContent>仓库</ListItemContent>
          </ListItemLink>
        </ListItem>
        <ListItem>
          <ListItemLink href="/dashboard/settings">
            <ListItemDecorator>
              <SettingsOutlined />
            </ListItemDecorator>
            <ListItemContent>设置</ListItemContent>
          </ListItemLink>
        </ListItem>
      </div>
      <ListItem className="mt-auto min-h-[65px] rounded-none border-t border-inherit p-2">
        <Admin />
      </ListItem>
    </List>
  )
}
