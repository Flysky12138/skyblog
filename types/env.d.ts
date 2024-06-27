namespace NodeJS {
  interface ProcessEnv {
    API_NETEASECLOUDMUSIC: StartsWith<'https://'>
    CDN_URL: string | undefined
    EDGE_ID: string
    GITHUB_ID: string
    GITHUB_SECRET: string
    NEXTAUTH_SECRET: string
    NEXT_PUBLIC_DESCRIPTION: string
    NEXT_PUBLIC_GITHUB_ACCESS_OWNER_REPO: string
    NEXT_PUBLIC_PAGE_POSTCARD_COUNT: string
    NEXT_PUBLIC_TITLE: string
    NEXT_PUBLIC_TOKEN_GITHUB_ACCESS: string
    NEXT_PUBLIC_WEBSITE_URL: StartsWith<'http://' | 'https://'>
    TOKEN_BROWSERLESS: string
    TOKEN_IPINFO: string | undefined
    TOKEN_VERCEL: string
  }
}
