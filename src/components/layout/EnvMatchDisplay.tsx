import React from 'react'

interface EnvMatchDisplayProps {
  children: React.ReactNode
  env: typeof process.env.NODE_ENV
  /**
   * 反向匹配
   * @default false
   */
  reverse?: boolean
}

export default function EnvMatchDisplay({ children, env, reverse = false }: EnvMatchDisplayProps) {
  if ((process.env.NODE_ENV == env) == !reverse) return children
  return null
}
