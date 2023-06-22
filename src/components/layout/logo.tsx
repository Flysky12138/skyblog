export const Logo = () => {
  return (
    <span className="font-title bg-linear-to-r from-cyan-500 to-blue-500 bg-clip-text text-lg font-semibold whitespace-nowrap text-transparent select-none">
      {process.env.NEXT_PUBLIC_TITLE}
    </span>
  )
}
