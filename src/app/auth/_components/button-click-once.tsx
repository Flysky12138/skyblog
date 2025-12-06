'use client'

import React from 'react'

import { Button } from '@/components/ui/button'

interface ButtonClickOnceProps extends React.ComponentProps<typeof Button> {}

export const ButtonClickOnce = (props: ButtonClickOnceProps) => {
  const [isClick, setIsClick] = React.useState(false)

  return (
    <Button
      {...props}
      disabled={isClick}
      onClick={event => {
        setIsClick(true)
        event.currentTarget.closest('form')?.requestSubmit()
      }}
    />
  )
}
