import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { useIsMobile } from '@/hooks/use-mobile'

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

export const DialogDrawerContent = ({ ...props }: React.ComponentProps<typeof DialogContent | typeof DrawerContent>) => {
  const isMobile = useIsMobile()
  const Comp = isMobile ? DrawerContent : DialogContent
  return <Comp {...props} />
}

export const DialogDrawerFooter = ({ ...props }: React.ComponentProps<typeof DialogFooter | typeof DrawerFooter>) => {
  const isMobile = useIsMobile()
  const Comp = isMobile ? DrawerFooter : DialogFooter
  return <Comp {...props} />
}
