import { File, FileArchive, FileAudio2, FileImage, FileJson2, FileText, FileType2, FileVideo2, LucideProps } from 'lucide-react'

import { getFileType } from '@/lib/file/info'

interface StorageFileIconProps extends LucideProps {
  mimeType: string
}

export function StorageFileIcon({ mimeType, ...props }: StorageFileIconProps) {
  const type = getFileType(mimeType)

  switch (type) {
    case 'audio':
      return <FileAudio2 {...props} />
    case 'font':
      return <FileType2 {...props} />
    case 'image':
      return <FileImage {...props} />
    case 'json':
      return <FileJson2 {...props} />
    case 'text':
      return <FileText {...props} />
    case 'video':
      return <FileVideo2 {...props} />
    case 'zip':
      return <FileArchive {...props} />
    default:
      return <File {...props} />
  }
}
