export default function Layout({ children }: React.PropsWithChildren) {
  return <div className="fixed inset-0 flex items-center justify-center overflow-clip p-6">{children}</div>
}
