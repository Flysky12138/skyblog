import a from './A'
import code from './Code'
import * as heading from './Heading'
import img from './Img'
import pre from './Pre'

export const element = {
  a,
  code,
  ...heading,
  img,
  pre
}
