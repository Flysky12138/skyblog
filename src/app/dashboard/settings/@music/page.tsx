'use client'

import { CustomRequest } from '@/lib/server/request'
import { Toast } from '@/lib/toast'
import { Avatar, Dropdown, Menu, MenuButton, MenuItem } from '@mui/joy'
import { useAsyncRetry } from 'react-use'
import { useImmer } from 'use-immer'
import Login from './_/Login'

interface MusicOptions {
  playlist: Array<{ id: number; name: string }>
  selectId: number
  user: { avatarUrl: string; nickname: string }
}

export default function Page() {
  const [music, setMusic] = useImmer<MusicOptions | null>(null)

  const { loading, retry } = useAsyncRetry(() => CustomRequest('GET api/dashboard/music/neteasecloud/options', {}).then(setMusic))
  if (loading) return <div className="s-skeleton my-px h-8 w-52 rounded"></div>

  if (!music) return <Login onSuccess={() => setTimeout(retry, 2000)} />

  return (
    <section className="flex w-full flex-wrap gap-x-10 gap-y-4">
      <div className="s-subtitle flex items-center">
        用户：
        <Dropdown>
          <MenuButton size="sm" startDecorator={<Avatar src={music.user.avatarUrl.replace('http:', 'https:')} sx={{ '--Avatar-size': '1.5rem' }} />}>
            {music.user.nickname}
          </MenuButton>
          <Menu className="dark:bg-zinc-900" placement="bottom-start">
            <MenuItem onClick={() => Toast(CustomRequest('GET api/dashboard/music/neteasecloud/login/status', {}), '已登录')}>检查状态</MenuItem>
            <MenuItem
              onClick={async () => {
                await Toast(CustomRequest('GET api/dashboard/music/neteasecloud/logout', {}), '已退出登录')
                setMusic(null)
              }}
            >
              退出登录
            </MenuItem>
          </Menu>
        </Dropdown>
      </div>
      <div className="s-subtitle flex items-center">
        歌单：
        {music.playlist.length > 0 ? (
          <Dropdown>
            <MenuButton className="block max-w-64 truncate md:max-w-sm" size="sm">
              {music.playlist.find(item => item.id == music.selectId)?.name || '请选择一个歌单'}
            </MenuButton>
            <Menu className="max-h-96 dark:bg-zinc-900" placement="bottom-start" size="sm">
              {music.playlist.map(({ id, name }) => (
                <MenuItem
                  key={id}
                  className="block max-w-64 truncate text-sm md:max-w-sm"
                  selected={music.selectId == id}
                  title={name}
                  onClick={async () => {
                    if (music.selectId == id) return
                    await Toast(CustomRequest('PATCH api/dashboard/music/neteasecloud/options', { body: { id } }))
                    setMusic(state => {
                      if (state) {
                        state.selectId = id
                      }
                    })
                  }}
                >
                  {name}
                </MenuItem>
              ))}
            </Menu>
          </Dropdown>
        ) : (
          '你连歌单都没吗？'
        )}
      </div>
    </section>
  )
}
