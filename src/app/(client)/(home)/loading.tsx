import { Card } from '@/components/layout/card'

export default function Loading() {
  return (
    <>
      <Card className="skeleton h-36" />
      <Card className="skeleton h-36" />
      <Card className="skeleton h-36" />
      <Card className="skeleton h-36 md:hidden" />
    </>
  )
}
