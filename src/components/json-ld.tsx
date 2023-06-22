import Script from 'next/script'
import React from 'react'
import { Thing } from 'schema-dts'

interface JsonLDProps<T extends Thing> {
  json: Exclude<T, string>
}

export function JsonLD<T extends Thing>({ json }: JsonLDProps<T>) {
  const id = React.useId()

  return (
    <Script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          ...json
        }).replace(/</g, '\\u003c')
      }}
      id={id}
      type="application/ld+json"
    />
  )
}
