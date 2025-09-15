import React from 'react'

import { A } from './a'
import { Code } from './code'
import * as heading from './heading'
import { Img } from './img'
import { Li } from './li'
import { Pre } from './pre'
import { Style } from './style'
import * as table from './table'

export const element = {
  ...heading,
  ...table,
  a: A,
  code: Code,
  img: Img,
  li: Li,
  pre: Pre,
  style: Style
} as Record<React.HTMLElementType, React.ComponentType>
