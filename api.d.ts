/**
 * 根据 Nextjs 文件路由系统规则生成
 * @generator [api.ts](file:///Users/flysky/codes/skyblog/scripts/api.ts)
 */
enum API {
  'api/clash',
  'api/ipinfo',
  'api/live2d',
  'api/phrase',
  'api/visitor',
  'api/auth/[...nextauth]',
  'api/auth/user',
  'api/dashboard/ban',
  'api/dashboard/clash',
  'api/dashboard/friend-links',
  'api/dashboard/image-info',
  'api/dashboard/live2d',
  'api/dashboard/posts',
  'api/github/[[...path]]',
  'api/post/info',
  'api/post/view',
  'api/dashboard/clash/template',
  'api/dashboard/friend-links/[id]',
  'api/dashboard/posts/[id]',
  'api/dashboard/posts/categories',
  'api/dashboard/posts/tags',
  'api/dashboard/users/member',
  'api/dashboard/users/visitor',
  'api/music/neteasecloud/lyric',
  'api/music/neteasecloud/playlist',
  'api/music/neteasecloud/song',
  'api/dashboard/music/neteasecloud/logout',
  'api/dashboard/music/neteasecloud/options',
  'api/dashboard/music/neteasecloud/login/captcha',
  'api/dashboard/music/neteasecloud/login/cellphone',
  'api/dashboard/music/neteasecloud/login/status'
}

interface ApiMap {
  'GET api/clash': import('@/app/api/clash/route.ts').GET
  'GET api/ipinfo': import('@/app/api/ipinfo/route.ts').GET
  'GET api/live2d': import('@/app/api/live2d/route.ts').GET
  'GET api/phrase': import('@/app/api/phrase/route.ts').GET
  'POST api/visitor': import('@/app/api/visitor/route.ts').POST
  'GET api/auth/[...nextauth]': import('@/app/api/auth/[...nextauth]/route.ts').GET
  'POST api/auth/[...nextauth]': import('@/app/api/auth/[...nextauth]/route.ts').POST
  'POST api/auth/user': import('@/app/api/auth/user/route.ts').POST
  'GET api/dashboard/ban': import('@/app/api/dashboard/ban/route.ts').GET
  'PUT api/dashboard/ban': import('@/app/api/dashboard/ban/route.ts').PUT
  'DELETE api/dashboard/clash': import('@/app/api/dashboard/clash/route.ts').DELETE
  'GET api/dashboard/clash': import('@/app/api/dashboard/clash/route.ts').GET
  'POST api/dashboard/clash': import('@/app/api/dashboard/clash/route.ts').POST
  'PUT api/dashboard/clash': import('@/app/api/dashboard/clash/route.ts').PUT
  'GET api/dashboard/friend-links': import('@/app/api/dashboard/friend-links/route.ts').GET
  'POST api/dashboard/friend-links': import('@/app/api/dashboard/friend-links/route.ts').POST
  'DELETE api/dashboard/image-info': import('@/app/api/dashboard/image-info/route.ts').DELETE
  'GET api/dashboard/image-info': import('@/app/api/dashboard/image-info/route.ts').GET
  'POST api/dashboard/image-info': import('@/app/api/dashboard/image-info/route.ts').POST
  'GET api/dashboard/live2d': import('@/app/api/dashboard/live2d/route.ts').GET
  'PUT api/dashboard/live2d': import('@/app/api/dashboard/live2d/route.ts').PUT
  'GET api/dashboard/posts': import('@/app/api/dashboard/posts/route.ts').GET
  'GET api/github/[[...path]]': import('@/app/api/github/[[...path]]/route.ts').GET
  'GET api/post/info': import('@/app/api/post/info/route.ts').GET
  'POST api/post/view': import('@/app/api/post/view/route.ts').POST
  'DELETE api/dashboard/clash/template': import('@/app/api/dashboard/clash/template/route.ts').DELETE
  'GET api/dashboard/clash/template': import('@/app/api/dashboard/clash/template/route.ts').GET
  'POST api/dashboard/clash/template': import('@/app/api/dashboard/clash/template/route.ts').POST
  'PUT api/dashboard/clash/template': import('@/app/api/dashboard/clash/template/route.ts').PUT
  'DELETE api/dashboard/friend-links/[id]': import('@/app/api/dashboard/friend-links/[id]/route.ts').DELETE
  'PATCH api/dashboard/friend-links/[id]': import('@/app/api/dashboard/friend-links/[id]/route.ts').PATCH
  'PUT api/dashboard/friend-links/[id]': import('@/app/api/dashboard/friend-links/[id]/route.ts').PUT
  'DELETE api/dashboard/posts/[id]': import('@/app/api/dashboard/posts/[id]/route.ts').DELETE
  'GET api/dashboard/posts/[id]': import('@/app/api/dashboard/posts/[id]/route.ts').GET
  'PATCH api/dashboard/posts/[id]': import('@/app/api/dashboard/posts/[id]/route.ts').PATCH
  'POST api/dashboard/posts/[id]': import('@/app/api/dashboard/posts/[id]/route.ts').POST
  'PUT api/dashboard/posts/[id]': import('@/app/api/dashboard/posts/[id]/route.ts').PUT
  'GET api/dashboard/posts/categories': import('@/app/api/dashboard/posts/categories/route.ts').GET
  'GET api/dashboard/posts/tags': import('@/app/api/dashboard/posts/tags/route.ts').GET
  'GET api/dashboard/users/member': import('@/app/api/dashboard/users/member/route.ts').GET
  'GET api/dashboard/users/visitor': import('@/app/api/dashboard/users/visitor/route.ts').GET
  'GET api/music/neteasecloud/lyric': import('@/app/api/music/neteasecloud/lyric/route.ts').GET
  'GET api/music/neteasecloud/playlist': import('@/app/api/music/neteasecloud/playlist/route.ts').GET
  'GET api/music/neteasecloud/song': import('@/app/api/music/neteasecloud/song/route.ts').GET
  'GET api/dashboard/music/neteasecloud/logout': import('@/app/api/dashboard/music/neteasecloud/logout/route.ts').GET
  'GET api/dashboard/music/neteasecloud/options': import('@/app/api/dashboard/music/neteasecloud/options/route.ts').GET
  'PATCH api/dashboard/music/neteasecloud/options': import('@/app/api/dashboard/music/neteasecloud/options/route.ts').PATCH
  'GET api/dashboard/music/neteasecloud/login/captcha': import('@/app/api/dashboard/music/neteasecloud/login/captcha/route.ts').GET
  'GET api/dashboard/music/neteasecloud/login/cellphone': import('@/app/api/dashboard/music/neteasecloud/login/cellphone/route.ts').GET
  'GET api/dashboard/music/neteasecloud/login/status': import('@/app/api/dashboard/music/neteasecloud/login/status/route.ts').GET
}
