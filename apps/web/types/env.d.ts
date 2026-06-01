declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * neon database url
     *
     * @example
     * "postgresql://neondb_owner:xxxxx@ep-ancient-river-xxxxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=30&pool_timeout=30"
     */
    readonly DATABASE_URL: string
    /**
     * vercel edge storage id
     *
     * @example
     * "ecfg_7bhjqwklveuyz9ix4n2tr3mfa5gd8sp"
     */
    readonly EDGE_ID: string
    /**
     * neon auth base url
     *
     * @example
     * "https://ep-damp-breeze-xxxx.neonauth.ap-southeast-1.aws.neon.tech/neondb/auth"
     */
    readonly NEON_AUTH_BASE_URL: string
    /**
     * neon auth cookie secret
     *
     * @example
     * "lFljjfMX9Uxl47JksllrbPg9wTIHXYnUI/vI6d3qE84="
     */
    readonly NEON_AUTH_COOKIE_SECRET: string
    /**
     * ffmpeg cdn
     *
     * @example
     * "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/"
     */
    readonly NEXT_PUBLIC_CDN_FFMPEG: string
    /**
     * monaco editor cdn
     *
     * @example
     * "/cdn/cdn.jsdelivr.net/npm/monaco-editor@0.51.0/min/vs"
     */
    readonly NEXT_PUBLIC_CDN_MONACO_EDITOR: string
    /**
     * 博客描述
     */
    readonly NEXT_PUBLIC_DESCRIPTION: string
    /**
     * github username
     */
    readonly NEXT_PUBLIC_GITHUB_NAME: string
    /**
     * 单页显示文章数
     *
     * @example
     * "8"
     */
    readonly NEXT_PUBLIC_PAGE_POSTCARD_COUNT: string
    /**
     * cloudflare r2 bucket's origin url for direct visit file
     *
     * @example
     * "https://r2.flysky.xyz"
     */
    readonly NEXT_PUBLIC_R2_URL: StartsWith<Protocol>
    /**
     * 博客名称
     */
    readonly NEXT_PUBLIC_TITLE: string
    /**
     * 博客访问地址
     *
     * @example
     * "http://localhost:3000"
     */
    readonly NEXT_PUBLIC_WEBSITE_URL: StartsWith<Protocol>
    /**
     * cloudflare r2 api id
     *
     * @see https://dash.cloudflare.com/?to=/:account/r2/api-tokens
     *
     * @example
     * "e44e40ebab57c6e45fc8daffc43b8aac"
     */
    readonly R2_ACCESS_KEY_ID: string
    /**
     * cloudflare r2 bucket's name
     *
     * @example
     * "skyblog"
     */
    readonly R2_BUCKET_NAME: string
    /**
     * s3 api url
     *
     * @see https://dash.cloudflare.com/?to=/:account/r2/api-tokens
     *
     * @example
     * "https://1e7c6cead9e4b1aa143fb3c5aef8cead.r2.cloudflarestorage.com"
     */
    readonly R2_S3_API: StartsWith<Protocol>
    /**
     * cloudflare r2 api key
     *
     * @see https://dash.cloudflare.com/?to=/:account/r2/api-tokens
     *
     * @example
     * "05e34ea2c231c6baa4d84591bb65df7eb7c2a7989c2d3d6e8638135c526aa65a"
     */
    readonly R2_SECRET_ACCESS_KEY: string
    /**
     * token for browserless api
     *
     * @see https://cloud.browserless.io
     *
     * @example
     * "3d0f06ec-ff26-4b05-8937-80fb1269f60d"
     */
    readonly TOKEN_BROWSERLESS: string
    /**
     * token for ipinfo api
     *
     * @see https://ipinfo.io
     *
     * @example
     * "7f4c6f9e0a32d8c"
     */
    readonly TOKEN_IPINFO?: string
    /**
     * token for vercel api
     *
     * @see https://vercel.com/account/tokens
     *
     * @example
     * "Z6Wn8v7YkAf5Ml0DxJzI1gBp"
     */
    readonly TOKEN_VERCEL: string
    /**
     * 企业微信机器人 webhook url
     *
     * @see https://work.weixin.qq.com/api/doc/90000/90136/91770
     *
     * @example
     * "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxxx-xxxx-xxxx-xxxx"
     */
    readonly WECOM_WEBHOOK_URL?: string
  }
}
