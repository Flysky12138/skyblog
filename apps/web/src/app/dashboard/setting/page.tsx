import { NeteaseCloudMusic } from './_components/netease-cloud-music'
import { Tiptap } from './_components/tiptap'

export default function Page() {
  return (
    <div className="flex flex-col gap-bp-4">
      <NeteaseCloudMusic />
      <Tiptap />
    </div>
  )
}
