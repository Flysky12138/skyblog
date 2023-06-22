import Card from '@/components/layout/Card'

export default function Loading() {
  return (
    <>
      <Card className="s-skeleton h-36" />
      <Card className="s-skeleton h-36" />
      <Card className="s-skeleton h-36" />
      <Card className="s-skeleton h-36 md:hidden" />
    </>
  )
}
