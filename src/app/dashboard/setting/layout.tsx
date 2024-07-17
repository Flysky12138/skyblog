export default function Layout({ children, music, live2d }: Record<'children' | 'music' | 'live2d', React.ReactNode>) {
  return (
    <section className="mt-2 flex flex-col gap-y-16">
      {music}
      {live2d}
    </section>
  )
}
