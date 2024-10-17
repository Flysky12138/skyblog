'use client'

import Breakpoint from '@/components/layout/Breakpoint'
import Card from '@/components/layout/Card'
import Portal from '@/components/layout/Portal'
import ModalCore from '@/components/modal/ModalCore'
import { ATTRIBUTE } from '@/lib/constants'
import { ForumRounded } from '@mui/icons-material'
import { Button, IconButton, ModalClose, Textarea, Tooltip } from '@mui/joy'
import { useSession } from 'next-auth/react'
// import Image from 'next/image'
import React from 'react'

const PostIssuesItem = () => {
  const { data: session } = useSession()
  return (
    <Card className="h-10 rounded-md">
      {/* <Avatar sx={{ '--Avatar-size': '3rem' }}>
        {session?.user && (
          <Image priority alt={session.user.name || ''} height={200} src={session.user.image?.replace('https://', '/cdn/') || ''} width={200} />
        )}
      </Avatar> */}
    </Card>
  )
}

const PostIssuesContent = () => {
  const [minRows, setMinRows] = React.useState(1)

  return (
    <section className="flex h-full flex-col">
      <div className="grow space-y-6 overflow-y-auto p-5">
        {Array.from({ length: 20 }).map((_, i) => (
          <PostIssuesItem key={i} />
        ))}
      </div>
      <Card className="flex gap-x-4 rounded-none border-x-0 border-b-0 p-5">
        <Textarea
          className="grow"
          maxRows={10}
          minRows={minRows}
          slotProps={{
            textarea: {
              className: 'transition-[height] duration-300 ease-out delay-50'
            }
          }}
          spellCheck="false"
          onBlur={() => setMinRows(1)}
          onFocus={() => setMinRows(3)}
        />
        <Button disabled className="shrink-0 self-end">
          提交
        </Button>
      </Card>
    </section>
  )
}

export default function PostIssues() {
  return (
    <>
      <Breakpoint down="lg">
        <Portal selector={`#${ATTRIBUTE.ID.ISSUES_MOBILE}`}>
          <ModalCore
            keepMounted
            className="overflow-hidden p-0"
            component={props => (
              <Tooltip title="评论">
                <IconButton {...props}>
                  <ForumRounded />
                </IconButton>
              </Tooltip>
            )}
            layout="fullscreen"
          >
            <ModalClose variant="soft" />
            <PostIssuesContent />
          </ModalCore>
        </Portal>
      </Breakpoint>
      <Breakpoint up="lg">
        <Portal selector={`#${ATTRIBUTE.ID.ISSUES_PC}`}>
          <ModalCore
            keepMounted
            className="h-full w-full max-w-screen-md overflow-hidden p-0"
            component={props => (
              <IconButton color="success" variant="solid" {...props}>
                <ForumRounded />
              </IconButton>
            )}
          >
            <PostIssuesContent />
          </ModalCore>
        </Portal>
      </Breakpoint>
    </>
  )
}
