import { Live2D } from './_components/live2d'
import { NeteaseCloudMusic } from './_components/netease-cloud-music'

export default function Page() {
  return (
    <div className="gap-card-large flex flex-col">
      <Live2D />
      <NeteaseCloudMusic />
    </div>
  )
}
