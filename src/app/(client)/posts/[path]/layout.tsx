export default function Layout({ children }: LayoutProps<'/posts/[path]'>) {
  return <div className="gap-card flex flex-col">{children}</div>
}
