import { CloseRounded } from '@mui/icons-material'
import { IconButton, Select, SelectProps, SelectStaticProps } from '@mui/joy'
import React from 'react'

interface FormSelectClearableProps extends Omit<SelectProps<any, false>, 'action'> {
  clearable: boolean
  onClear: () => void
}

export default function FormSelectClearable({ children, clearable, onClear, ...props }: FormSelectClearableProps) {
  const action: SelectStaticProps['action'] = React.useRef(null)

  return (
    <Select
      action={action}
      {...props}
      {...(clearable && {
        endDecorator: (
          <IconButton
            className="rounded-sm"
            color="neutral"
            sx={{
              '--IconButton-size': '2em'
            }}
            variant="plain"
            onClick={() => {
              onClear()
              action.current?.focusVisible()
            }}
            onMouseDown={event => event.stopPropagation()}
          >
            <CloseRounded />
          </IconButton>
        ),
        indicator: null
      })}
    >
      {children}
    </Select>
  )
}
