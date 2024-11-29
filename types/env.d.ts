namespace NodeJS {
  interface ProcessEnv {
    /** vercel edge storage id */
    EDGE_ID: string
    /**
     * github OAuth App's id for `next-auth`
     * @see https://github.com/settings/developers
     */
    GITHUB_ID: string
    /**
     * github OAuth App's secret for `next-auth`
     * @see https://github.com/settings/developers
     */
    GITHUB_SECRET: string
    /** `next-auth` 用来加密令牌和电子邮件验证哈希的随机字符串 */
    NEXTAUTH_SECRET: string
    /** 博客描述 */
    NEXT_PUBLIC_DESCRIPTION: string
    /** github username */
    NEXT_PUBLIC_GITHUB_NAME: string
    /** 单页显示文章数 */
    NEXT_PUBLIC_PAGE_POSTCARD_COUNT: string
    /** cloudflare r2 bucket's name */
    NEXT_PUBLIC_R2_BUCKET_NAME: string
    /** cloudflare r2 bucket's origin url for direct visit file */
    NEXT_PUBLIC_R2_URL: StartsWith<Protocol>
    /**
     * cloudflare r2 api id
     * @see https://dash.cloudflare.com/?to=/:account/r2/api-tokens
     */
    NEXT_PUBLIC_S3_ACCESS_ID: string
    /**
     * cloudflare r2 api key
     * @see https://dash.cloudflare.com/?to=/:account/r2/api-tokens
     */
    NEXT_PUBLIC_S3_ACCESS_KEY: string
    /**
     * s3 api url
     * @see https://dash.cloudflare.com/?to=/:account/r2/api-tokens
     */
    NEXT_PUBLIC_S3_API: StartsWith<Protocol>
    /** 博客名称 */
    NEXT_PUBLIC_TITLE: string
    /** 博客访问地址 */
    NEXT_PUBLIC_WEBSITE_URL: StartsWith<Protocol>
    /**
     * token for browserless api
     * @see https://cloud.browserless.io
     */
    TOKEN_BROWSERLESS: string
    /**
     * token for ipinfo api
     * @see https://ipinfo.io
     */
    TOKEN_IPINFO?: string
    /**
     * token for vercel api
     * @see https://vercel.com/account/tokens
     */
    TOKEN_VERCEL: string
  }
}
