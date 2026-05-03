'use client'

import React from 'react'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui-overwrite/dialog'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { breakpoints, useBreakpoint } from '@/hooks/use-breakpoint'
import { cn } from '@/lib/utils'

import { DisplayByConditional } from './display/display-by-conditional'

interface DialogDrawerContextProps {
  isMobile: boolean
}

const DialogDrawerContext = React.createContext<DialogDrawerContextProps>(null!)
const useDialogDrawerContext = () => React.useContext(DialogDrawerContext)

export function DialogDrawer(props: Pick<React.ComponentProps<typeof Drawer>, 'children' | 'onOpenChange' | 'open'>) {
  const breakpoint = useBreakpoint()

  const isMobile = breakpoints[breakpoint] <= breakpoints.zero

  return (
    <DialogDrawerContext value={{ isMobile }}>
      <DisplayByConditional condition={isMobile} fallback={<Dialog {...props} />}>
        <Drawer shouldScaleBackground {...props} />
      </DisplayByConditional>
    </DialogDrawerContext>
  )
}

export function DialogDrawerClose({
  render,
  ...props
}: React.ComponentProps<'button'> & {
  render?: React.ReactElement
}) {
  const { isMobile } = useDialogDrawerContext()
  if (isMobile) {
    props.children = render ?? props.children
    return <DrawerClose asChild={!!render} {...props} />
  }
  return <DialogClose render={render} {...props} />
}

export function DialogDrawerContent({
  className,
  dialogClassName,
  drawerClassName,
  showCloseButton,
  ...props
}: React.ComponentProps<'div'> & {
  dialogClassName?: string
  drawerClassName?: string
  showCloseButton?: boolean
}) {
  const { isMobile } = useDialogDrawerContext()
  if (isMobile) return <DrawerContent className={cn(className, drawerClassName)} {...props} />
  return <DialogContent className={cn(className, dialogClassName)} showCloseButton={showCloseButton} {...props} />
}

export function DialogDrawerDescription(props: React.ComponentProps<'div'>) {
  const { isMobile } = useDialogDrawerContext()
  const Comp = isMobile ? DrawerDescription : DialogDescription
  return <Comp {...props} />
}

export function DialogDrawerFooter(props: React.ComponentProps<'div'>) {
  const { isMobile } = useDialogDrawerContext()
  const Comp = isMobile ? DrawerFooter : DialogFooter
  return <Comp {...props} />
}

export function DialogDrawerHeader(props: React.ComponentProps<'div'>) {
  const { isMobile } = useDialogDrawerContext()
  const Comp = isMobile ? DrawerHeader : DialogHeader
  return <Comp {...props} />
}

export function DialogDrawerTitle(props: React.ComponentProps<'div'>) {
  const { isMobile } = useDialogDrawerContext()
  const Comp = isMobile ? DrawerTitle : DialogTitle
  return <Comp {...props} />
}

export function DialogDrawerTrigger({
  render,
  ...props
}: React.ComponentProps<'button'> & {
  render?: React.ReactElement
}) {
  const { isMobile } = useDialogDrawerContext()
  if (isMobile) {
    props.children = render ?? props.children
    return <DrawerTrigger asChild={!!render} {...props} />
  }
  return <DialogTrigger render={render} {...props} />
}
