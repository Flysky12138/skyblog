declare module '*?raw' {
  const content: string
  export default content
}

declare module '*.svg' {
  import React from 'react'
  const content: React.FC<React.SVGProps<SVGElement>>
  export default content
}

declare module '*.svg?url' {
  const content: import('next/dist/shared/lib/get-img-props').StaticImageData
  export default content
}
