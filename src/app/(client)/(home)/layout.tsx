import Card from '@/components/layout/Card'
import Developer from './_/Developer'
import GuestInfo from './_/GuestInfo'
import Navigate from './_/Navigate'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6 sm:flex-row">
      <div className="relative flex grow flex-col gap-y-6">
        <Card className="s-subtitle p-5 text-center font-title text-base">开发中</Card>
        {children}
      </div>
      <div className="flex shrink-0 flex-col gap-y-6 sm:w-56 md:w-64">
        <Developer />
        <Navigate />
        <div className="sticky top-[calc(theme(height.header)+theme(height.9))] empty:hidden">
          <GuestInfo />
        </div>
      </div>
    </section>
  )
}
