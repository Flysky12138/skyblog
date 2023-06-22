export default function Layout({ children }: { children: React.ReactNode }) {
  return <section className="absolute inset-0 -mt-60 flex items-center justify-center">{children}</section>
}
