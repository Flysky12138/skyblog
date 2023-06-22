import NotFound from '@/assets/svg/not-found.svg'

export const NotFoundComponent = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <NotFound className="size-2/3 lg:size-1/2" />
    </div>
  )
}
