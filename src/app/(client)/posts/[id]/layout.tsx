export default function Layout({ children }: LayoutProps<'/posts/[id]'>) {
  return <div className="gap-card flex flex-col">{children}</div>
}
