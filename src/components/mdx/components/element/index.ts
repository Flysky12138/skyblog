import React from 'react'

import { A } from './a'
import { Code } from './code'
import { Figure } from './figure'
import * as heading from './heading'
import { Img } from './img'
import { Li } from './li'
import { P } from './p'
import { Pre } from './pre'
import { Style } from './style'
import * as table from './table'

export const element = {
  ...heading,
  ...table,
  a: A,
  code: Code,
  figure: Figure,
  img: Img,
  li: Li,
  p: P,
  pre: Pre,
  style: Style
} as Record<React.HTMLElementType, React.ComponentType>
