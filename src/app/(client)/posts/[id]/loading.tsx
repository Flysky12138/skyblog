import { Card } from '@/components/layout/card'

export default function Loading() {
  return (
    <>
      <Card className="flex h-[138px] flex-col justify-center gap-4 p-3 md:p-5">
        <div className="skeleton h-7 w-60 rounded-md" />
        <div className="skeleton h-5 w-40 rounded-md" />
        <div className="skeleton h-5 w-full max-w-sm rounded-md" />
      </Card>
      <Card className="h-72" />
    </>
  )
}
