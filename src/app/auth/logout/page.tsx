import { redirect, RedirectType } from 'next/navigation'

import { auth, signOut } from '@/lib/auth'

import { ButtonClickOnce } from '../_components/button-click-once'

export default async function Page() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/login', RedirectType.replace)
  }

  return (
    <form
      action={async () => {
        'use server'
        await signOut()
      }}
    >
      <ButtonClickOnce className="min-w-3xs" size="lg" type="submit" variant="destructive">
        注销
      </ButtonClickOnce>
    </form>
  )
}
