interface GithubRepoCommon {
  _links: {
    git: string | null
    html: string | null
    self: string
  }
  git_url: string | null
  html_url: string | null
  name: string
  path: string
  sha: string
  size: number
  url: string
}

interface le1MB {
  content: string
  encoding: 'base64'
}

interface gt1MB {
  content: ''
  encoding: 'none'
}

type GithubRepoFileType = {
  download_url: string
  type: 'file'
} & GithubRepoCommon &
  (le1MB | gt1MB)

type GithubRepoFolderType = {
  download_url: null
  type: 'dir'
} & GithubRepoCommon

interface GithubRepoRef {
  node_id: string
  object: {
    sha: string
    type: string
    url: string
  }
  ref: string
  url: string
}

interface GithubRepoTree {
  sha: string
  tree: Array<{
    mode: string
    path: string
    sha: string
    size?: number
    type: 'blob' | 'tree'
    url: string
  }>
  truncated: boolean
  url: string
}
