import Card from '@/components/layout/Card'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Card title="网易云音乐">{children}</Card>
}
