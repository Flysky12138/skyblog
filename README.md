快了快了（新建文件夹中。。。）

## 数据存储

- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres): 存储博客几乎所有的文本内容
- [Vercel Edge Config](https://vercel.com/docs/storage/edge-config): 存储一些配置文件，如：Live2D直链等
- [Cloudflare R2](https://www.cloudflare.com/zh-cn/developer-platform/r2/): 存储文件

## 环境变量

以下是不适合公开的环境变量，示例为随机生成格式相同的字符串

```ini
# https://ipinfo.io
TOKEN_IPINFO=7f4c6f9e0a32d8c

# https://cloud.browserless.io
TOKEN_BROWSERLESS=3d0f06ec-ff26-4b05-8937-80fb1269f60d

# edge config edit
EDGE_ID=ecfg_7bhjqwklveuyz9ix4n2tr3mfa5gd8sp
## https://vercel.com/account/tokens
TOKEN_VERCEL=Z6Wn8v7YkAf5Ml0DxJzI1gBp

# cloudflare r2
## https://dash.cloudflare.com/?to=/:account/r2/api-tokens
NEXT_PUBLIC_R2_BUCKET_NAME=skyblog
NEXT_PUBLIC_R2_URL=https://r2.flysky.xyz
NEXT_PUBLIC_S3_API=https://1e7c6cead9e4b1aa143fb3c5aef8cead.r2.cloudflarestorage.com
NEXT_PUBLIC_S3_ACCESS_ID=e44e40ebab57c6e45fc8daffc43b8aac
NEXT_PUBLIC_S3_ACCESS_KEY=05e34ea2c231c6baa4d84591bb65df7eb7c2a7989c2d3d6e8638135c526aa65a

# 登录
## https://github.com/settings/developers
## Authorization callback URL example: https://blog.flysky.xyz/api/auth/callback/github
GITHUB_ID=p2j1w7l0i4e9t5k8u3y6c
GITHUB_SECRET=5c8e2b4f7a3d9b1e6c0g2a5h9j1k4l6m7n0o
## 库用来加密令牌和电子邮件验证哈希的随机字符串
## 访问 https://generate-secret.vercel.app/32 可获取一个随机值
NEXTAUTH_SECRET=8j1a9s2d0f5g4h7j6k8l3m4n5b0v
```

### 规范

1. 优先使用 `tailwindcss`，只有在使用 `mui` & `joy` 组建时需要修改内部指定类或 CSS 变量时才使用 `sx` 调整样式
2. 为了减少客户端包的大小并充分利用服务器，请尽可能将状态 `'use client'` 移动到组件树的较低位置 [参考 ↗](https://nextjs.org/docs/getting-started/react-essentials#moving-client-components-to-the-leaves)
3. `/src/app/**/_components` 是对应路由用的非通用组建
4. 组件根标签是 `div` 等无意义标签，换成 `section`；`React.Fragment` 除外
5. 接口类型导出 `export type POST = MethodRouteType<{}>`
6. 对数据库的 CRUD 方法提取到外层，并命名为 `db<Get|Post...>`，以便使用 `Prisma.PromiseReturnType<typeof dbGet>` 获取返回类型

### 坑

1. 若遇到无论如何都不能刷新缓存，看下 vercel 的构建日志吧，api 可能被识别为 `ISR Function` 了，api 文件中添加 `export const dynamic = 'force-dynamic'` 解决 [参考 ↗](https://github.com/vercel/next.js/issues/57632#issuecomment-1806936644)
