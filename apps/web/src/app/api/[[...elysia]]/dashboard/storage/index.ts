import { Elysia } from 'elysia'

import { directories } from './directories'
import { files } from './files'
import { objects } from './objects'
import { paths } from './paths'

export const storage = new Elysia({ prefix: '/storage' }).use(directories).use(files).use(objects).use(paths)
