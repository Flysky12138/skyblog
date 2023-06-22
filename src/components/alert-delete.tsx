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
} from '@/components/ui-overwrite/alert-dialog'

export interface AlertDeleteProps extends React.PropsWithChildren {
  description: string
  title: string
  onCancel?: React.MouseEventHandler<HTMLButtonElement>
  onConfirm: React.MouseEventHandler<HTMLButtonElement>
}

export const AlertDelete = ({ children, description, title, onCancel, onConfirm }: AlertDeleteProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="break-all">{title}</AlertDialogTitle>
          <AlertDialogDescription>此操作无法撤消，{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>取消</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>确定</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
