export default function Layout({ children }: React.PropsWithChildren) {
  return <div className="absolute inset-0 flex items-center justify-center">{children}</div>
}
