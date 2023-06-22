'use client'

import { cn } from '@/lib/cn'
import { QueueMusic } from '@mui/icons-material'
import { Dropdown, IconButton, ListItem, ListItemButton, Menu, MenuButton } from '@mui/joy'
import { ClickAwayListener } from '@mui/material'
import { motion } from 'framer-motion'
import React from 'react'
import { FixedSizeList } from 'react-window'
import { PlayerType } from '.'

export interface PlaylistRefType {
  setOpen: (payload: boolean) => void
}
interface PlaylistPropsType {
  activeIndex: number
  onClick?: (index: number) => void
  value: PlayerType['list']
}

export default React.forwardRef<PlaylistRefType, PlaylistPropsType>(function Playlist({ value: playlist, activeIndex, onClick }, ref) {
  // 播放列表菜单开关；不使用组建默认内部控制器，是因为 MenuItem 组件会导致虚拟滚动抖动
  const [isOpen, setIsOpen] = React.useState(false)
  React.useImperativeHandle(ref, () => ({
    setOpen: payload => setIsOpen(payload)
  }))

  // 正在播放歌曲定位
  const playlistRef = React.useRef<FixedSizeList>(null)
  const handleScrollToItem = React.useCallback(() => {
    playlistRef.current?.scrollToItem(activeIndex, 'center')
  }, [activeIndex])
  React.useEffect(() => {
    handleScrollToItem()
  }, [handleScrollToItem])

  return (
    <Dropdown
      open={isOpen}
      onOpenChange={() => {
        setIsOpen(state => !state)
        handleScrollToItem()
      }}
    >
      <ClickAwayListener
        onClickAway={() => {
          if (isOpen) setIsOpen(false)
        }}
      >
        <div className="inline-block">
          <MenuButton
            disabled={playlist.length <= 1}
            slotProps={{ root: { className: 'rounded-full', color: 'neutral', variant: 'plain' } }}
            slots={{ root: IconButton }}
          >
            <QueueMusic />
          </MenuButton>
          <Menu keepMounted className="z-[calc(var(--joy-zIndex-modal)+10)] p-0 dark:bg-zinc-800" component="div" placement="top-end" size="sm">
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
                      setIsOpen(false)
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
        </div>
      </ClickAwayListener>
    </Dropdown>
  )
})
