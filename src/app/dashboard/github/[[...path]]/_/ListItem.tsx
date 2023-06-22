import { cn } from '@/lib/cn'
import { formatFileSize } from '@/lib/parser/size'
import { Folder, InsertDriveFileOutlined } from '@mui/icons-material'
import { Box } from '@mui/joy'

interface ListItemPropsType {
  className?: string
  disabled?: boolean
  endDecorator?: React.ReactNode
  onClick: () => void
  value?: GithubRepoFileType | GithubRepoFolderType
}

export default function ListItem({ value: file, className, disabled, endDecorator, onClick }: ListItemPropsType) {
  return (
    <section
      className={cn(
        'group grid h-10 grid-cols-[auto_1fr_80px] items-center gap-x-3 px-3 text-sm',
        'text-slate-500 hover:s-bg-card dark:text-zinc-400',
        {
          'cursor-pointer': !disabled
        },
        className
      )}
      onClick={() => {
        if (disabled) return
        onClick()
      }}
      onContextMenu={event => {
        event.preventDefault()
      }}
      onKeyDown={event => {
        if (disabled) return
        if (event.code != 'Enter') return
        onClick()
      }}
    >
      <span className="justify-self-center" tabIndex={disabled ? -1 : 0}>
        {file?.type == 'file' ? <InsertDriveFileOutlined /> : <Folder />}
      </span>
      <span className="truncate text-slate-700 dark:text-white">{file?.name || '..'}</span>
      {file?.type == 'file' && <span className="justify-self-end group-focus-within:opacity-0 group-hover:opacity-0">{formatFileSize(file.size)}</span>}
      {endDecorator && (
        <Box
          className="absolute right-3 hidden space-x-2 group-focus-within:block group-hover:block"
          sx={{
            button: {
              '--IconButton-radius': '6px',
              '--IconButton-size': '1.8rem'
            }
          }}
        >
          {endDecorator}
        </Box>
      )}
    </section>
  )
}
