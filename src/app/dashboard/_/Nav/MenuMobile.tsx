'use client'

import { Close, Menu as MenuIcon } from '@mui/icons-material'
import { Drawer, IconButton } from '@mui/joy'
import { useToggle } from 'react-use'
import Menu, { MenuProps } from './Menu'

interface MenuMobileProps extends MenuProps {}

export default function MenuMobile({ className }: MenuMobileProps) {
  const [open, openToggle] = useToggle(false)

  return (
    <>
      <IconButton onClick={openToggle}>
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="right"
        open={open}
        sx={{
          '--Drawer-horizontalSize': '200px'
        }}
        onClose={openToggle}
      >
        <>
          <div className="s-divider-color flex h-header items-center justify-end border-b bg-zinc-50 px-8 dark:bg-zinc-800">
            <IconButton onClick={openToggle}>
              <Close />
            </IconButton>
          </div>
          <Menu className={className} />
        </>
      </Drawer>
    </>
  )
}
