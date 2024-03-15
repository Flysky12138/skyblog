import ModalCore from '@/components/modal/ModalCore'
import { cn } from '@/lib/cn'
import { Apps } from '@mui/icons-material'
import { Chip, IconButton } from '@mui/joy'
import { Tag } from '@prisma/client'

interface ModalChipsProps<T> {
  onChange: (payload: T[]) => void
  select: T[]
  value: T[]
}

export default function ModalChips<T extends Pick<Tag, 'id' | 'name'>>({ select, value, onChange }: ModalChipsProps<T>) {
  return (
    <ModalCore
      className="flex max-w-screen-md flex-row flex-wrap gap-4"
      component={props => (
        <IconButton className="rounded-md" variant="plain" {...props}>
          <Apps />
        </IconButton>
      )}
    >
      {value.map(item => {
        const index = select.findIndex(({ id }) => id == item.id)
        return (
          <Chip
            key={item.id}
            className={cn('min-w-10 text-center shadow outline-cyan-500', {
              outline: index != -1
            })}
            color={index != -1 ? 'primary' : 'neutral'}
            size="lg"
            onClick={() => {
              const ans = Array.from(select)
              index != -1 ? ans.splice(index, 1) : ans.push(item)
              onChange(ans)
            }}
          >
            {item.name}
          </Chip>
        )
      })}
    </ModalCore>
  )
}
