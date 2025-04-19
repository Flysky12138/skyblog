export default function Layout({ children }: React.PropsWithChildren) {
  return <section className="absolute inset-0 flex items-center justify-center">{children}</section>
}
