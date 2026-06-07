import { Button } from '@repo/ui/components/button'

export function ToggleButton({ pressed, ...props }: React.ComponentProps<typeof Button> & { pressed?: boolean }) {
  return <Button aria-pressed={pressed} size="icon-sm" variant={pressed ? 'default' : 'secondary'} {...props} />
}

export function TriggerButton(props: React.ComponentProps<typeof Button>) {
  return <Button size="icon-sm" variant="outline" {...props} />
}
