import Link from 'next/link'

export default function Logo() {
  return (
    <Link className="select-none bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text font-title text-lg font-semibold text-transparent" href="/pages/1">
      {process.env.NEXT_PUBLIC_TITLE}
    </Link>
  )
}
