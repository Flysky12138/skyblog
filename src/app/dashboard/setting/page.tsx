import { Live2D } from './_components/live2d'
import { NeteaseCloudMusic } from './_components/netease-cloud-music'

export default function Page() {
  return (
    <div className="flex flex-col gap-12">
      <Live2D />
      <NeteaseCloudMusic />
    </div>
  )
}
