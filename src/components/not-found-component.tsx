import { NotFound } from '@/components/svg-icon/not-found'

export const NotFoundComponent = () => {
  return (
    <section className="absolute inset-0 flex items-center justify-center">
      <NotFound className="h-2/3 w-2/3 lg:h-1/2 lg:w-1/2" />
    </section>
  )
}
