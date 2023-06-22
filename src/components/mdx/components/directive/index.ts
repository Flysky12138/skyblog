import { default as accordion } from './Accordion'
import hr from './Divider'
import GithubImages from './GithubImages'
import images from './Images'
import masonry from './Masonry'
import mdx from './Mdx'
import modal from './Modal'
import tabs from './Tabs'

const directive = {
  hr,
  images,
  masonry,
  mdx,
  modal,
  tabs,
  ...accordion,
  'github-images': GithubImages
}

export default directive
