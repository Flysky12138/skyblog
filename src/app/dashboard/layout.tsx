import Logo from '@/components/layout/Logo'
import ToggleTheme from '@/components/toggle/ToggleTheme'
import Admin from './_components/Admin'
import Menu from './_components/Menu'

export const metadata = {
  title: 'Dashboard'
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="s-border-color-divider fixed inset-y-0 left-0 flex w-52 flex-col border-r bg-white dark:bg-zinc-800">
        <div className="flex justify-between rounded-none border-b border-inherit px-4 py-2">
          <Logo />
          <ToggleTheme
            slotsProps={{
              iconbutton: { color: 'neutral' },
              tooltip: { placement: 'left' }
            }}
          />
        </div>
        <Menu className="px-4 py-3" />
        <div className="border-t border-inherit p-2 empty:hidden">
          <Admin />
        </div>
      </nav>
      <main className="ml-52 min-h-screen p-8">{children}</main>
    </>
  )
}
