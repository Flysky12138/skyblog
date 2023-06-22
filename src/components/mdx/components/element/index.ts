import a from './A'
import code from './Code'
import * as heading from './Heading'
import img from './Img'

export const element = {
  a,
  code,
  ...heading,
  img
}
