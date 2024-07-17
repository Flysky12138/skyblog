'use client'

import { Edit as EditIcon } from '@mui/icons-material'
import { IconButton, Link, Tooltip } from '@mui/joy'
import { useSession } from 'next-auth/react'

interface PostEditProps {
  className?: string
  id: string
}

export default function PostEdit({ id, className }: PostEditProps) {
  const session = useSession()

  if (session?.data?.role != 'ADMIN') return null

  return (
    <Tooltip title="编辑">
      <IconButton className={className} component={Link} href={`/dashboard/posts/${id}`} target="_blank" variant="plain">
        <EditIcon />
      </IconButton>
    </Tooltip>
  )
}
