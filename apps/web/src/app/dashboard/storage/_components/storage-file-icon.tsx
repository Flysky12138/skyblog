import {
  FileArchiveIcon,
  FileAudio2Icon,
  FileIcon,
  FileImageIcon,
  FileJson2Icon,
  FileTextIcon,
  FileType2Icon,
  FileVideo2Icon,
  LucideProps
} from 'lucide-react'

import { FileHelper } from '@/lib/helper/file'

interface StorageFileIconProps extends LucideProps {
  mimeType: string
}

export function StorageFileIcon({ mimeType, ...props }: StorageFileIconProps) {
  const type = FileHelper.getFileType(mimeType)

  switch (type) {
    case 'audio':
      return <FileAudio2Icon {...props} />
    case 'font':
      return <FileType2Icon {...props} />
    case 'image':
      return <FileImageIcon {...props} />
    case 'json':
      return <FileJson2Icon {...props} />
    case 'text':
      return <FileTextIcon {...props} />
    case 'video':
      return <FileVideo2Icon {...props} />
    case 'zip':
      return <FileArchiveIcon {...props} />
    default:
      return <FileIcon {...props} />
  }
}
