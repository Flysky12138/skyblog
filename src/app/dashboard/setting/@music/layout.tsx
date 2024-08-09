import Card from '@/components/layout/Card'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <p className="s-subtitle mb-2 pl-3">网易云音乐</p>
      <Card className="p-5">{children}</Card>
    </section>
  )
}
