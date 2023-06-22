'use client'

import { cn } from '@/lib/cn'
import { QueueMusic } from '@mui/icons-material'
import { Dropdown, IconButton, ListItem, ListItemButton, Menu, MenuButton } from '@mui/joy'
import { motion } from 'framer-motion'
import React from 'react'
import { useClickAway } from 'react-use'
import { FixedSizeList } from 'react-window'
import { Player } from '.'

interface MusicPlaylistProps {
  activeIndex: number
  onClick?: (index: number) => void
  value: Player['list']
}

export default function MusicPlaylist({ value: playlist, activeIndex, onClick }: MusicPlaylistProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  // 正在播放歌曲定位
  const playlistRef = React.useRef<FixedSizeList>(null)

  // 不使用 MenuItem 自带的点击外部自动关闭功能，是因为 MenuItem 组件会导致虚拟滚动抖动
  const menuRef = React.useRef(null)
  useClickAway(
    menuRef,
    event => {
      if (isOpen) event.preventDefault()
      setIsOpen(false)
    },
    ['touchend', 'mousedown']
  )

  return (
    <Dropdown
      open={isOpen}
      onOpenChange={(_, open) => {
        setIsOpen(state => !state)
        if (open) playlistRef.current?.scrollToItem(activeIndex, 'center')
      }}
    >
      <MenuButton
        disabled={playlist.length <= 1 || isOpen}
        slotProps={{ root: { className: 'rounded-full', color: 'neutral', variant: 'plain' } }}
        slots={{ root: IconButton }}
      >
        <QueueMusic />
      </MenuButton>
      <Menu ref={menuRef} keepMounted className="z-[calc(var(--joy-zIndex-modal)+10)] p-0 dark:bg-zinc-800" component="div" placement="top-end" size="sm">
        <motion.ul
          animate={isOpen ? 'open' : 'closed'}
          variants={{
            closed: { opacity: 0 },
            open: { opacity: 1 }
          }}
        >
          <FixedSizeList ref={playlistRef} height={400} itemCount={playlist.length} itemSize={32} overscanCount={5} width={250}>
            {({ index, style }) => (
              <ListItem
                slotProps={{
                  root: {
                    title: playlist[index].name
                  }
                }}
                style={style}
                onClick={() => {
                  onClick?.(index)
                }}
              >
                <ListItemButton
                  className={cn('inline-block truncate after:absolute after:inset-y-1 after:left-0 after:w-1 after:rounded', {
                    'after:bg-blue-400': activeIndex == index
                  })}
                  selected={activeIndex == index}
                >
                  {index + 1}. {playlist[index].name}
                </ListItemButton>
              </ListItem>
            )}
          </FixedSizeList>
        </motion.ul>
      </Menu>
    </Dropdown>
  )
}
