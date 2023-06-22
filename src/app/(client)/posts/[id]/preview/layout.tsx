import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Preview'
}

export default function Layout({ children }: React.PropsWithChildren) {
  return children
}
