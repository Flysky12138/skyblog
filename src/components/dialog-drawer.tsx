'use client'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui-overwrite/dialog'
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

export const DialogDrawer = ({ ...props }: React.ComponentProps<typeof Dialog | typeof Drawer>) => {
  const isMobile = useIsMobile()
  const Comp = isMobile ? Drawer : Dialog
  return <Comp {...props} />
}

export const DialogDrawerTrigger = ({ ...props }: React.ComponentProps<typeof DialogTrigger | typeof DrawerTrigger>) => {
  const isMobile = useIsMobile()
  const Comp = isMobile ? DrawerTrigger : DialogTrigger
  return <Comp {...props} />
}

export const DialogDrawerHeader = ({ ...props }: React.ComponentProps<typeof DialogHeader | typeof DrawerHeader>) => {
  const isMobile = useIsMobile()
  const Comp = isMobile ? DrawerHeader : DialogHeader
  return <Comp {...props} />
}

export const DialogDrawerTitle = ({ ...props }: React.ComponentProps<typeof DialogTitle | typeof DrawerTitle>) => {
  const isMobile = useIsMobile()
  const Comp = isMobile ? DrawerTitle : DialogTitle
  return <Comp {...props} />
}

export const DialogDrawerDescription = ({ ...props }: React.ComponentProps<typeof DialogDescription | typeof DrawerDescription>) => {
  const isMobile = useIsMobile()
  const Comp = isMobile ? DrawerDescription : DialogDescription
  return <Comp {...props} />
}

export const DialogDrawerContent = ({
  className,
  classNameDialog,
  classNameDrawer,
  showCloseButton,
  ...props
}: React.ComponentProps<typeof DialogContent | typeof DrawerContent> & {
  classNameDialog?: string
  classNameDrawer?: string
  showCloseButton?: boolean
}) => {
  const isMobile = useIsMobile()
  if (isMobile) return <DrawerContent className={cn(className, classNameDrawer)} {...props} />
  return <DialogContent className={cn(className, classNameDialog)} showCloseButton={showCloseButton} {...props} />
}

export const DialogDrawerFooter = ({ ...props }: React.ComponentProps<typeof DialogFooter | typeof DrawerFooter>) => {
  const isMobile = useIsMobile()
  const Comp = isMobile ? DrawerFooter : DialogFooter
  return <Comp {...props} />
}
