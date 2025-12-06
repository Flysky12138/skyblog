import { DisplayByConditional, DisplayByConditionalProps } from './display-by-conditional'

interface DisplayByEnvProps extends Omit<DisplayByConditionalProps, 'condition'> {
  env: typeof process.env.NODE_ENV
}

export function DisplayByEnv({ env, ...props }: DisplayByEnvProps) {
  return <DisplayByConditional condition={process.env.NODE_ENV == env} {...props} />
}
