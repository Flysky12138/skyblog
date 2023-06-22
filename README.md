[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

快了快了（新建文件夹中。。。）

## 数据存储

- [Vercel KV](https://vercel.com/docs/storage/vercel-kv): 存储上传到 Github 的图片信息
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres): 存储博客几乎所有的内容
- [Vercel Blob](https://vercel.com/docs/storage/vercel-blob): 存储友链的网站封面图片
- [Vercel Edge Config](https://vercel.com/docs/storage/edge-config): 存储一些配置文件，如：封禁、歌单信息、Live2D直链等

## 环境变量

以下是不适合公开的环境变量

```ini
# https://ipinfo.io/
TOKEN_IPINFO=7f4c6f9e0a32d8c

# netease cloud music
API_NETEASECLOUDMUSIC=https://netease-cloud-music-api-flysky.vercel.app

# https://cloud.browserless.io/
TOKEN_BROWSERLESS=3d0f06ec-ff26-4b05-8937-80fb1269f60d

# edge config edit
EDGE_ID=ecfg_7bhjqwklveuyz9ix4n2tr3mfa5gd8sp
## https://vercel.com/account/tokens
TOKEN_VERCEL=Z6Wn8v7YkAf5Ml0DxJzI1gBp

# github assets
## https://github.com/settings/tokens
NEXT_PUBLIC_TOKEN_GITHUB_ACCESS=ghp_v9Lq4GjDn5Nh2Tg1Yz3Rb7Oc8Jw0Ee5Pf
NEXT_PUBLIC_GITHUB_ACCESS_OWNER_REPO=flysky12138/repository-name

# 登陆
## https://github.com/settings/developers
## Authorization callback URL example: https://blog.flysky.xyz/api/auth/callback/github
GITHUB_ID=p2j1w7l0i4e9t5k8u3y6c
GITHUB_SECRET=5c8e2b4f7a3d9b1e6c0g2a5h9j1k4l6m7n0o
## 库用来加密令牌和电子邮件验证哈希的随机字符串
## 访问 https://generate-secret.vercel.app/32 可获取一个随机值
NEXTAUTH_SECRET=8j1a9s2d0f5g4h7j6k8l3m4n5b0v
## 使用自己的 CDN 一定要在 vercel 控制面板里添加 CDN 域名。未知原因，添加在 .env 里无效
AUTH_URL=
```

## 开发

- 从 Vercel 拉取私有环境变量

  `vercel env pull`

### 规范

1. 优先使用 `tailwindcss`，只有在使用 `mui` & `joy` 组建时需要修改内部指定类或 CSS 变量时才使用 `sx` 调整样式
2. 为了减少客户端包的大小并充分利用服务器，请尽可能将状态 `'use client'` 移动到组件树的较低位置 [参考 ↗](https://nextjs.org/docs/getting-started/react-essentials#moving-client-components-to-the-leaves)
3. `/src/app/**/_` 是对应路由用的非通用组建。为了和文件路由区分，文件夹名用大驼峰
4. 组件根标签是 `div` 等无意义标签，换成 `section`；`React.Fragment` 除外
5. 接口请求体类型命名 `<name><Get|Post...>RequestType`，接口返回值类型命名 `<name><Get|Post...>ResponseType`
6. 对数据库的 CRUD 方法提取到外层，并命名为 `db<Get|Post...>`，以便使用 `Prisma.PromiseReturnType<typeof dbGet>` 获取返回类型

### 坑

1. 若遇到无论如何都不能刷新缓存，看下 vercel 的构建日志吧，api 可能被识别为 `ISR Function` 了，api 文件中添加 `export const dynamic = 'force-dynamic'` 解决 [参考 ↗](https://github.com/vercel/next.js/issues/57632#issuecomment-1806936644)
