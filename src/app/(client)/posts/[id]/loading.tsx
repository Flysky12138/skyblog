import Card from '@/components/layout/Card'

export default function Loading() {
  return (
    <section className="space-y-5">
      <Card className="s-skeleton h-36 px-5 py-7">
        <div className="s-skeleton h-7 w-60 rounded"></div>
        <div className="s-skeleton my-3 h-5 w-40 rounded"></div>
        <div className="s-skeleton h-5 w-full max-w-sm rounded"></div>
      </Card>
      <Card className="s-skeleton h-72"></Card>
    </section>
  )
}
