declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * github OAuth app's id for `next-auth`
     * @see https://github.com/settings/developers
     * @example
     * "p2j1w7l0i4e9t5k8u3y6c"
     */
    AUTH_GITHUB_ID: string
    /**
     * github OAuth app's secret for `next-auth`
     * @see https://github.com/settings/developers
     * @example
     * "5c8e2b4f7a3d9b1e6c0g2a5h9j1k4l6m7n0o"
     */
    AUTH_GITHUB_SECRET: string
    /**
     * `next-auth` 用来加密令牌和电子邮件验证哈希的随机字符串
     * @example
     * "8j1a9s2d0f5g4h7j6k8l3m4n5b0v"
     */
    AUTH_SECRET: string
    /**
     * vercel edge storage id
     * @example
     * "ecfg_7bhjqwklveuyz9ix4n2tr3mfa5gd8sp"
     */
    EDGE_ID: string
    /**
     * ffmpeg cdn
     * @example
     * "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/"
     */
    NEXT_PUBLIC_CDN_FFMPEG: string
    /**
     * monaco editor cdn
     * @example
     * "/cdn/cdn.jsdelivr.net/npm/monaco-editor@0.51.0/"
     */
    NEXT_PUBLIC_CDN_MONACO_EDITOR: string
    /** 博客描述 */
    NEXT_PUBLIC_DESCRIPTION: string
    /** 加密响应内容 */
    NEXT_PUBLIC_ENCRYPT_API: 'false' | 'true'
    /** github username */
    NEXT_PUBLIC_GITHUB_NAME: string
    /**
     * 单页显示文章数
     * @example
     * "8"
     */
    NEXT_PUBLIC_PAGE_POSTCARD_COUNT: string
    /**
     * cloudflare r2 bucket's name
     * @example
     * "skyblog"
     */
    NEXT_PUBLIC_R2_BUCKET_NAME: string
    /**
     * cloudflare r2 bucket's origin url for direct visit file
     * @example
     * "https://r2.flysky.xyz"
     */
    NEXT_PUBLIC_R2_URL: StartsWith<Protocol>
    /**
     * rybbit id
     * @see https://www.rybbit.io/
     */
    NEXT_PUBLIC_RYBBIT_ID?: string
    /**
     * cloudflare r2 api id
     * @see https://dash.cloudflare.com/?to=/:account/r2/api-tokens
     * @example
     * "e44e40ebab57c6e45fc8daffc43b8aac"
     */
    NEXT_PUBLIC_S3_ACCESS_ID: string
    /**
     * cloudflare r2 api key
     * @see https://dash.cloudflare.com/?to=/:account/r2/api-tokens
     * @example
     * "05e34ea2c231c6baa4d84591bb65df7eb7c2a7989c2d3d6e8638135c526aa65a"
     */
    NEXT_PUBLIC_S3_ACCESS_KEY: string
    /**
     * s3 api url
     * @see https://dash.cloudflare.com/?to=/:account/r2/api-tokens
     * @example
     * "https://1e7c6cead9e4b1aa143fb3c5aef8cead.r2.cloudflarestorage.com"
     */
    NEXT_PUBLIC_S3_API: StartsWith<Protocol>
    /** 博客名称 */
    NEXT_PUBLIC_TITLE: string
    /**
     * 博客访问地址
     * @example
     * "http://localhost:3000"
     */
    NEXT_PUBLIC_WEBSITE_URL: StartsWith<Protocol>
    /**
     * token for browserless api
     * @see https://cloud.browserless.io
     * @example
     * "3d0f06ec-ff26-4b05-8937-80fb1269f60d"
     */
    TOKEN_BROWSERLESS: string
    /**
     * token for ipinfo api
     * @see https://ipinfo.io
     * @example
     * "7f4c6f9e0a32d8c"
     */
    TOKEN_IPINFO?: string
    /**
     * token for vercel api
     * @see https://vercel.com/account/tokens
     * @example
     * "Z6Wn8v7YkAf5Ml0DxJzI1gBp"
     */
    TOKEN_VERCEL: string
  }
}
