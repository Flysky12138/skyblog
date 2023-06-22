import a from './A'
import code from './Code'
import * as heading from './Heading'
import img from './Img'
import pre from './Pre'
import directive from './directive'

export const components = {
  a,
  code,
  ...heading,
  img,
  pre,
  ...directive
}
