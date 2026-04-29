'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'

export interface AlertDialogDeleteProps extends React.PropsWithChildren {
  description?: string
  disabled?: boolean
  title: string
  onCancel?: React.MouseEventHandler<HTMLButtonElement>
  onConfirm: React.MouseEventHandler<HTMLButtonElement>
}

export function AlertDialogDelete({
  children,
  description = '此操作无法撤消，将永久删除该项',
  disabled,
  title,
  onCancel,
  onConfirm
}: AlertDialogDeleteProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="break-all">{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>取消</AlertDialogCancel>
          <AlertDialogAction className="min-w-32" disabled={disabled} onClick={onConfirm}>
            确定
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
