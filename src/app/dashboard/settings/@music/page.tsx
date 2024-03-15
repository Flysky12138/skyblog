'use client'

import { CustomFetch } from '@/lib/server/fetch'
import { CustomToast } from '@/lib/toast'
import { Avatar, Dropdown, Menu, MenuButton, MenuItem } from '@mui/joy'
import { useAsyncRetry } from 'react-use'
import { useImmer } from 'use-immer'
import Login from './_/Login'

const getMusicOptions = async () => {
  return await CustomFetch('/api/dashboard/music/neteasecloud/options')
}
const patchSelectPlaylist = async (id: number) => {
  return await CustomFetch(`/api/dashboard/music/neteasecloud/options`, {
    body: { id },
    method: 'PATCH'
  })
}
const checkStatus = async () => {
  return await CustomFetch('/api/dashboard/music/neteasecloud/login/status')
}
const logout = async () => {
  return await CustomFetch('/api/dashboard/music/neteasecloud/logout')
}

interface MusicOptions {
  playlist: Array<{ id: number; name: string }>
  selectId: number
  user: { avatarUrl: string; nickname: string }
}

export default function Page() {
  const [music, setMusic] = useImmer<MusicOptions | null>(null)

  const { loading, retry } = useAsyncRetry(() => getMusicOptions().then(setMusic))
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
            <MenuItem onClick={() => CustomToast(checkStatus(), '已登录')}>检查状态</MenuItem>
            <MenuItem
              onClick={async () => {
                await CustomToast(logout(), '已退出登录')
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
                    await CustomToast(patchSelectPlaylist(id))
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
