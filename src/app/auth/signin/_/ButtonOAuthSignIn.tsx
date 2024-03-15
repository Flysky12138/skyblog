'use client'

import { KeyboardArrowRight } from '@mui/icons-material'
import { Button, ButtonProps } from '@mui/joy'
import { BuiltInProviderType } from 'next-auth/providers'
import { LiteralUnion, signIn } from 'next-auth/react'
import { useToggle } from 'react-use'

interface ButtonOAuthSignInProps extends Pick<ButtonProps, 'startDecorator' | 'children'> {
  type: LiteralUnion<BuiltInProviderType>
}

export default function ButtonOAuthSignIn({ startDecorator, children, type }: ButtonOAuthSignInProps) {
  const [loading, loadingToggle] = useToggle(false)

  return (
    <Button
      className="group max-w-xs justify-start font-normal"
      color="neutral"
      endDecorator={<KeyboardArrowRight />}
      loading={loading}
      size="lg"
      slotProps={{
        endDecorator: {
          className: 'ml-auto group-hover:translate-x-1/2 group-focus:translate-x-1/2 transition-transform'
        }
      }}
      startDecorator={startDecorator}
      variant="outlined"
      onClick={() => {
        loadingToggle()
        signIn(type)
      }}
    >
      {children}
    </Button>
  )
}
