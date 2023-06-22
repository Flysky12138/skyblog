import { Metadata } from 'next'

export const metadata: Metadata = {
  description: '共享会员，下载网易云音乐歌曲',
  openGraph: {
    description: '共享会员，下载网易云音乐歌曲',
    title: '网易云音乐'
  },
  title: '网易云音乐',
  twitter: {
    description: '共享会员，下载网易云音乐歌曲',
    title: '网易云音乐'
  }
}

export default function Layout({ children }: React.PropsWithChildren) {
  return children
}
