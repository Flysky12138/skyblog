import React from 'react'

import { A } from './a'
import { Code } from './code'
import * as heading from './heading'
import { Img } from './img'
import { Li } from './li'
import { Pre } from './pre'
import { Style } from './style'
import * as table from './table'
import { Ul } from './ul'

export const original = {
  ...heading,
  ...table,
  a: A,
  code: Code,
  img: Img,
  li: Li,
  pre: Pre,
  style: Style,
  ul: Ul
} as Record<React.HTMLElementType, React.FunctionComponent>
