import { cn } from '@/lib/cn'
import { DividerProps, Divider as JoyDivider } from '@mui/joy'

interface DividerPropsType extends Omit<DividerProps, 'ref'> {
  left?: string
}

export default function Divider({ children, className, left, ...props }: DividerPropsType) {
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
