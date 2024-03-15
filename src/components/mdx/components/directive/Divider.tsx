import { cn } from '@/lib/cn'
import { Divider as JoyDivider, DividerProps as MuiDividerProps } from '@mui/joy'

interface DividerProps extends Omit<MuiDividerProps, 'ref'> {
  left?: string
}

export default function Divider({ children, className, left, ...props }: DividerProps) {
  return (
    <JoyDivider
      className={cn('my-3', className)}
      {...props}
      sx={{
        ...(left && {
          '--Divider-childPosition': `${left}%`
        })
      }}
    >
      {children}
    </JoyDivider>
  )
}
