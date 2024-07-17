export default function Layout({ children }: { children: React.ReactNode }) {
  return <section className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5 py-5">{children}</section>
}
