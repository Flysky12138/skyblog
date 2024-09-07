import React from 'react'

interface EnvMatchDisplayProps {
  children: React.ReactNode
  env: typeof process.env.NODE_ENV
  /**
   * @default false
   */
  not?: boolean
}

export default function EnvMatchDisplay({ children, env, not = false }: EnvMatchDisplayProps) {
  if ((process.env.NODE_ENV == env) == !not) return children
  return null
}
