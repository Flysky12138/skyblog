import { AuthView } from '@neondatabase/auth/react'

export default async function Page({ params }: PageProps<'/auth/[path]'>) {
  const { path } = await params

  return (
    <main className="container mx-auto flex grow flex-col items-center justify-center gap-3 self-center p-4 md:p-6">
      <AuthView path={path} />
    </main>
  )
}
