import Logo from '@/components/layout/Logo'
import ToggleTheme from '@/components/toggle/ToggleTheme'
import { BubbleChart, CloudOutlined, HomeOutlined, PermIdentityOutlined, SettingsOutlined, SourceOutlined } from '@mui/icons-material'
import { Metadata } from 'next'
import Admin from './_components/Admin'
import Menu from './_components/Menu'

export const metadata: Metadata = {
  title: 'Dashboard'
}

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <>
      <nav className="s-border-color-divider fixed inset-y-0 left-0 flex w-52 flex-col border-r bg-white dark:bg-zinc-800">
        <div className="flex h-header shrink-0 items-center justify-between rounded-none border-b border-inherit px-4">
          <Logo />
          <ToggleTheme
            slotsProps={{
              iconbutton: { color: 'neutral' },
              tooltip: { placement: 'left' }
            }}
          />
        </div>
        <Menu
          className="py-3 pl-4 pr-2"
          lists={[
            { href: '/dashboard', icon: <HomeOutlined />, label: '主页' },
            {
              children: [
                { href: '/dashboard/posts', label: '列表' },
                { href: '/dashboard/posts/new', label: '新建' }
              ],
              defaultExpanded: true,
              icon: <SourceOutlined />,
              label: '文章'
            },
            {
              children: [
                { href: '/dashboard/user/member', label: '成员' },
                { href: '/dashboard/user/visitor', label: '访客' }
              ],
              defaultExpanded: 'users',
              icon: <PermIdentityOutlined />,
              label: '用户'
            },
            {
              children: [
                { href: '/dashboard/other/clash', label: 'Clash 共享' },
                { href: '/dashboard/other/friend-link', label: '友情链接' }
              ],
              defaultExpanded: 'others',
              icon: <BubbleChart />,
              label: '其他'
            },
            { href: '/dashboard/r2', icon: <CloudOutlined />, label: '仓库' },
            { href: '/dashboard/setting', icon: <SettingsOutlined />, label: '设置' }
          ]}
        />
        <div className="border-t border-inherit p-2 empty:hidden">
          <Admin />
        </div>
      </nav>
      <main className="relative ml-52 min-h-screen p-8">{children}</main>
    </>
  )
}
