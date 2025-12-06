'use client'

import React from 'react'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui-overwrite/dialog'
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui-overwrite/drawer'
import { breakpoints, useBreakpoint } from '@/hooks/use-breakpoint'
import { cn } from '@/lib/utils'

import { DisplayByConditional } from './display/display-by-conditional'

interface DialogDrawerContextProps {
  isMobile: boolean
}

const DialogDrawerContext = React.createContext<DialogDrawerContextProps>(null!)
const useDialogDrawerContext = () => React.useContext(DialogDrawerContext)

export function DialogDrawer(props: React.ComponentProps<typeof Dialog | typeof Drawer>) {
  const breakpoint = useBreakpoint()
  const breakpointMatchedValue = breakpoints[breakpoint]

  const isMobile = breakpointMatchedValue <= breakpoints.zero

  return (
    <DialogDrawerContext value={{ isMobile }}>
      <DisplayByConditional condition={isMobile} fallback={<Dialog {...props} />}>
        <Drawer shouldScaleBackground {...props} />
      </DisplayByConditional>
    </DialogDrawerContext>
  )
}

export function DialogDrawerContent({
  className,
  dialogClassName,
  drawerClassName,
  showCloseButton,
  ...props
}: React.ComponentProps<typeof DialogContent> &
  React.ComponentProps<typeof DrawerContent> & {
    dialogClassName?: string
    drawerClassName?: string
  }) {
  const { isMobile } = useDialogDrawerContext()
  if (isMobile) {
    return <DrawerContent className={cn(className, drawerClassName)} {...props} />
  }
  return <DialogContent className={cn(className, dialogClassName)} showCloseButton={showCloseButton} {...props} />
}

export function DialogDrawerDescription(props: React.ComponentProps<typeof DialogDescription | typeof DrawerDescription>) {
  const { isMobile } = useDialogDrawerContext()
  const Comp = isMobile ? DrawerDescription : DialogDescription
  return <Comp {...props} />
}

export function DialogDrawerFooter(props: React.ComponentProps<typeof DialogFooter | typeof DrawerFooter>) {
  const { isMobile } = useDialogDrawerContext()
  const Comp = isMobile ? DrawerFooter : DialogFooter
  return <Comp {...props} />
}

export function DialogDrawerHeader(props: React.ComponentProps<typeof DialogHeader | typeof DrawerHeader>) {
  const { isMobile } = useDialogDrawerContext()
  const Comp = isMobile ? DrawerHeader : DialogHeader
  return <Comp {...props} />
}

export function DialogDrawerTitle(props: React.ComponentProps<typeof DialogTitle | typeof DrawerTitle>) {
  const { isMobile } = useDialogDrawerContext()
  const Comp = isMobile ? DrawerTitle : DialogTitle
  return <Comp {...props} />
}

export function DialogDrawerTrigger(props: React.ComponentProps<typeof DialogTrigger | typeof DrawerTrigger>) {
  const { isMobile } = useDialogDrawerContext()
  const Comp = isMobile ? DrawerTrigger : DialogTrigger
  return <Comp suppressHydrationWarning {...props} />
}
