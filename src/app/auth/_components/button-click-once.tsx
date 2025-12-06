'use client'

import React from 'react'

import { Button } from '@/components/ui/button'

interface ButtonClickOnceProps extends React.ComponentProps<typeof Button> {}

export const ButtonClickOnce = (props: ButtonClickOnceProps) => {
  const [isClicked, setIsClicked] = React.useState(false)

  return (
    <Button
      {...props}
      disabled={isClicked}
      onClick={event => {
        setIsClicked(true)
        event.currentTarget.closest('form')?.requestSubmit()
      }}
    />
  )
}
