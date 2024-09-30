export default function Layout({ children, live2d }: Record<'children' | 'live2d', React.ReactNode>) {
  return <section className="mt-2 flex flex-col gap-y-12">{live2d}</section>
}
