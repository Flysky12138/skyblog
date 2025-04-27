import React from 'react'

import { A } from './a'
import { Code } from './code'
import { Figure } from './figure'
import * as heading from './heading'
import { Img } from './img'
import { P } from './p'
import { Pre } from './pre'
import * as table from './table'
import { Ul } from './ul'

export const element = {
  ...heading,
  ...table,
  a: A,
  code: Code,
  figure: Figure,
  img: Img,
  p: P,
  pre: Pre,
  ul: Ul
} as Record<React.HTMLElementType, React.ComponentType>
