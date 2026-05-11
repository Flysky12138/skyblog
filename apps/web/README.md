# ❗️该项目仅适用于作者本人使用

## 数据存储

- [Neon Postgres](https://console.neon.tech): 存储博客几乎所有的文本内容
- [Vercel Edge Config](https://vercel.com/docs/storage/edge-config): 存储一些配置文件，如：Live2D 直链等
- [Cloudflare R2](https://www.cloudflare.com/zh-cn/developer-platform/r2): 存储文件

  Cloudflare R2 CORS 策略

  ```js
  [
    {
      "AllowedOrigins": [
        "http://localhost:3000",
        "https://blog.flysky.xyz"
      ],
      "AllowedMethods": ["GET", "PUT"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["*"]
    }
  ]
  ```

## 环境变量

以下是不适合公开的环境变量，示例为随机生成格式相同的字符串

```ini
# https://ipinfo.io
TOKEN_IPINFO="7f4c6f9e0a32d8c"

# https://cloud.browserless.io
TOKEN_BROWSERLESS="3d0f06ec-ff26-4b05-8937-80fb1269f60d"

# edge config edit
EDGE_ID="ecfg_7bhjqwklveuyz9ix4n2tr3mfa5gd8sp"
## https://vercel.com/account/tokens
TOKEN_VERCEL="Z6Wn8v7YkAf5Ml0DxJzI1gBp"

# cloudflare r2
## https://dash.cloudflare.com/?to=/:account/r2/api-tokens
R2_BUCKET_NAME="skyblog"
R2_S3_API="https://1e7c6cead9e4b1aa143fb3c5aef8cead.r2.cloudflarestorage.com"
R2_ACCESS_KEY_ID="e44e40ebab57c6e45fc8daffc43b8aac"
R2_SECRET_ACCESS_KEY="05e34ea2c231c6baa4d84591bb65df7eb7c2a7989c2d3d6e8638135c526aa65a"
NEXT_PUBLIC_R2_URL="https://r2.flysky.xyz"

# auth
## https://console.neon.tech
## https://github.com/settings/developers
DATABASE_URL="postgresql://neondb_owner:xxxxx@ep-ancient-river-xxxxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
NEON_AUTH_BASE_URL="https://ep-wispy-silence-xxxxx.neonauth.ap-southeast-1.aws.neon.tech/neondb/auth"
NEON_AUTH_COOKIE_SECRET="lFljjfMX9Uxl47JksllrbPg9wTIHXYnUI/vI6d3qE84="
```

## 部署流程概述

1. 创建一个 [Neon Postgres](https://console.neon.tech/) 数据库，并且开启 Neon Auth，得到两个环境变量值 `DATABASE_URL` 和 `NEON_AUTH_BASE_URL`。还需手动生成一个 `NEON_AUTH_COOKIE_SECRET` 值（`openssl rand -base64 32`）
2. 前往 [Vercel](https://vercel.com/) 创建项目，填入各种环境变量，并部署
3. 回到 Neon 控制台，将指定用户设置为管理员。页面顶部才会出现管理页面按钮

### 规范

1. 为了减少客户端包的大小并充分利用服务器，请尽可能将状态 `'use client'` 移动到组件树的较低位置 [参考 ↗](https://nextjs.org/docs/getting-started/react-essentials#moving-client-components-to-the-leaves)
2. `/src/app/**/_components` 是对应路由用的非通用组件
