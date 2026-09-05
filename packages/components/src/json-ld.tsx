import Script from 'next/script'
import React from 'react'
import { Thing } from 'schema-dts'

interface JsonLDProps<T extends TypeS> {
  json: Extract<Thing, { '@type': T }>
}
type TypeS = Exclude<Thing, string>['@type']

export function JsonLD<T extends TypeS>({ json }: JsonLDProps<T>) {
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
