import Card from '@/components/layout/Card'
import ModalDelete from '@/components/modal/ModalDelete'
import { cn } from '@/lib/cn'
import { Add, Delete } from '@mui/icons-material'
import { Chip, IconButton, Input, Typography } from '@mui/joy'
import { motion } from 'framer-motion'
import React from 'react'
import { useClickAway, useSet, useToggle } from 'react-use'

interface CardBanProps {
  description?: string
  label: string
  onDelete: (payload: string[]) => Promise<void>
  onSubmit: (payload: string[]) => Promise<void>
  value: string[]
}

export default function CardBan({ description, label, value, onDelete, onSubmit }: CardBanProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [showInput, showInputToggle] = useToggle(false)
  useClickAway(inputRef, showInputToggle)

  const [select, setSelect] = useSet<string>()

  return (
    <Card className="overflow-hidden">
      <div className="s-bg-title flex h-10 items-center gap-x-3 px-3">
        <Typography level="title-sm">{label}</Typography>
        {description && (
          <Typography className="pt-1" level="body-xs">
            {description}
          </Typography>
        )}
        <span aria-hidden="true" className="grow"></span>
        {select.size > 0 ? (
          <ModalDelete
            component={props => (
              <IconButton color="danger" {...props}>
                <Delete />
              </IconButton>
            )}
            onCancel={setSelect.reset}
            onSubmit={async () => {
              const payload = value.filter(v => !select.has(v))
              await onDelete(payload)
              setSelect.reset()
            }}
          />
        ) : null}
        {showInput ? (
          <Input
            animate={{ width: 200 }}
            component={motion.div}
            initial={{ width: 32 }}
            slotProps={{ input: { ref: inputRef } }}
            transition={{ duration: 0.2, type: 'tween' }}
            onKeyUp={async event => {
              if (event.code != 'Enter') return
              const target = event.target as HTMLInputElement
              if (!target.value) return
              await onSubmit(value.concat(target.value))
              showInputToggle()
            }}
          />
        ) : (
          <IconButton
            onClick={() => {
              showInputToggle()
              setTimeout(() => inputRef.current?.focus(), 100)
            }}
          >
            <Add />
          </IconButton>
        )}
      </div>
      <div
        className={cn('s-border-color-card flex flex-wrap items-center gap-3 px-3 transition-all', {
          'border-t py-3': value.length > 0
        })}
      >
        {value?.map(item => (
          <Chip
            key={item}
            className={cn('border border-inherit', {
              'outline outline-red-300 dark:outline-red-600': select.has(item)
            })}
            color="primary"
            size="lg"
            variant="soft"
            onClick={() => setSelect.toggle(item)}
          >
            {item}
          </Chip>
        ))}
      </div>
    </Card>
  )
}
