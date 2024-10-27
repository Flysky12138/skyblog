namespace NodeJS {
  interface ProcessEnv {
    CDN_URL?: string
    EDGE_ID: string
    GITHUB_ID: string
    GITHUB_SECRET: string
    NEXTAUTH_SECRET: string
    NEXT_PUBLIC_DESCRIPTION: string
    NEXT_PUBLIC_GITHUB_NAME: string
    NEXT_PUBLIC_PAGE_POSTCARD_COUNT: string
    NEXT_PUBLIC_R2_SECRET: string
    NEXT_PUBLIC_R2_URL: StartsWith<Protocol>
    NEXT_PUBLIC_TITLE: string
    NEXT_PUBLIC_WEBSITE_URL: StartsWith<Protocol>
    TOKEN_BROWSERLESS: string
    TOKEN_IPINFO?: string
    TOKEN_VERCEL: string
  }
}
