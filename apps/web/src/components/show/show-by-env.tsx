import { Show, ShowProps } from '.'

interface ShowByEnvProps extends Omit<ShowProps, 'when'> {
  env: typeof process.env.NODE_ENV
}

export function ShowByEnv({ env, ...props }: ShowByEnvProps) {
  return <Show when={process.env.NODE_ENV === env} {...props} />
}
