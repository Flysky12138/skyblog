/**
 * 网易云音乐 API 的独立实现
 *
 * 替代 NeteaseCloudMusicApi 包，解决与 Next.js Turbopack 的兼容性问题。
 * 使用 Node.js 内置的 crypto 模块实现加密，无需外部依赖。
 */

import crypto from 'node:crypto'

const AES_IV = '0102030405060708'
const API_DOMAIN = 'https://interface.music.163.com'
const BASE62 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const DOMAIN = 'https://music.163.com'
const EAPI_KEY = 'e82ckenh8dichen8'
const PRESET_KEY = '0CoJUm6Qyw8W8jud'
const RSA_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDgtQn2JZ34ZC28NWYpAUd98iZ3
7BUrX/aKzmFbt7clFSs6sXqHauqKWqdtLkF2KexO40H1YTX8z2lSgBBOAxLsvakl
V8k4cBFK9snQXE9/DDaFt6Rr7iVZMldczhC0JNgTz+SHXT6CBHuX3e9SdB1Ua44o
ncaTWz7OBGLbCiK45wIDAQAB
-----END PUBLIC KEY-----`

const cookieObjToString = (cookie: Record<string, string>): string =>
  Object.entries(cookie)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('; ')

const cookieStringToObj = (cookie: string): Record<string, string> => {
  if (!cookie) return {}
  const obj: Record<string, string> = {}
  for (const item of cookie.split(';')) {
    const [key, ...rest] = item.trim().split('=')
    if (key && rest.length > 0) {
      obj[key.trim()] = rest.join('=').trim()
    }
  }
  return obj
}

/**
 * AES-128-CBC 加密，返回 base64
 */
const aesCbcEncrypt = (text: string, key: string, iv: string): string => {
  const cipher = crypto.createCipheriv('aes-128-cbc', Buffer.from(key), Buffer.from(iv))
  let encrypted = cipher.update(text, 'utf8', 'base64')
  encrypted += cipher.final('base64')
  return encrypted
}

/**
 * AES-128-ECB 加密，返回大写 hex
 */
const aesEcbEncrypt = (text: string, key: string): string => {
  const cipher = crypto.createCipheriv('aes-128-ecb', Buffer.from(key), null as unknown as Buffer)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return encrypted.toUpperCase()
}

/**
 * RSA 无填充加密
 *
 * node-forge 的 'NONE' 模式直接对输入做 m^e mod n 运算，
 * 而 Node.js crypto RSA_NO_PADDING 要求输入严格等于 key 长度（128 字节）。
 * 此处将原文右对齐填充至 128 字节以保证兼容。
 */
const rsaEncrypt = (str: string): string => {
  const buffer = Buffer.from(str, 'utf8')
  const padded = Buffer.alloc(128)
  buffer.copy(padded, 128 - buffer.length)

  const encrypted = crypto.publicEncrypt({ key: RSA_PUBLIC_KEY, padding: crypto.constants.RSA_NO_PADDING }, padded)
  return encrypted.toString('hex')
}

/**
 * eapi 加密
 */
const eapiEncrypt = (uri: string, data: Record<string, unknown>): { params: string } => {
  const text = JSON.stringify(data)
  const message = `nobody${uri}use${text}md5forencrypt`
  const digest = crypto.createHash('md5').update(message).digest('hex')
  const encryptedData = `${uri}-36cd479b6b5-${text}-36cd479b6b5-${digest}`

  return { params: aesEcbEncrypt(encryptedData, EAPI_KEY) }
}

/**
 * weapi 加密
 */
const weapiEncrypt = (data: Record<string, unknown>): { encSecKey: string; params: string } => {
  const text = JSON.stringify(data)

  // 第一次 AES-CBC 加密
  const firstEncrypted = aesCbcEncrypt(text, PRESET_KEY, AES_IV)

  // 生成随机 16 位密钥
  let secretKey = ''
  for (let i = 0; i < 16; i++) {
    secretKey += BASE62[Math.floor(Math.random() * 62)]
  }

  // 第二次 AES-CBC 加密
  const params = aesCbcEncrypt(firstEncrypted, secretKey, AES_IV)

  // RSA 加密（逆转后的密钥）
  const encSecKey = rsaEncrypt(secretKey.split('').reverse().join(''))

  return { encSecKey, params }
}

/**
 * 发送请求到网易云音乐 API
 */
export const neteaseRequest = async <T>(
  uri: string,
  data: Record<string, unknown>,
  options: {
    cookie?: Record<string, string> | string
    crypto: 'eapi' | 'weapi'
  }
) => {
  const cookieObj = (() => {
    if (typeof options.cookie === 'string') {
      return cookieStringToObj(options.cookie)
    } else {
      return { ...options.cookie }
    }
  })()

  let url: string
  let formData: URLSearchParams
  const headers: Record<string, string> = {}

  if (options.crypto === 'weapi') {
    headers.Referer = DOMAIN
    headers['User-Agent'] =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0'

    data.csrf_token = cookieObj.__csrf || ''
    const encrypted = weapiEncrypt(data)
    formData = new URLSearchParams({
      encSecKey: encrypted.encSecKey,
      params: encrypted.params
    })
    url = `${DOMAIN}/weapi${uri.slice(4)}`
  } else {
    // eapi
    const header: Record<string, string> = {
      __csrf: cookieObj.__csrf || '',
      appver: cookieObj.appver || '3.1.17.204416',
      buildver: cookieObj.buildver || Date.now().toString().slice(0, 10),
      channel: cookieObj.channel || 'netease',
      deviceId: cookieObj.deviceId || crypto.randomUUID(),
      mobilename: cookieObj.mobilename || '',
      os: cookieObj.os || 'pc',
      osver: cookieObj.osver || '10',
      resolution: cookieObj.resolution || '1920x1080',
      versioncode: cookieObj.versioncode || '140',
      requestId: `${Date.now()}_${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(4, '0')}`
    }

    if (cookieObj.MUSIC_U) header.MUSIC_U = cookieObj.MUSIC_U
    if (cookieObj.MUSIC_A) header.MUSIC_A = cookieObj.MUSIC_A

    headers.Cookie = cookieObjToString(header)
    headers['User-Agent'] = 'NeteaseMusic 9.0.90/5038 (iPhone; iOS 16.2; zh_CN)'

    const encrypted = eapiEncrypt(uri, { ...data, header })
    formData = new URLSearchParams({ params: encrypted.params })
    url = `${API_DOMAIN}/eapi${uri.slice(4)}`
  }

  const response = await fetch(url, {
    body: formData.toString(),
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })

  const setCookie = response.headers.getSetCookie?.() ?? []
  const resCookie = setCookie.map((x: string) => x.replace(/\s*Domain=[^(;|$)]+;*/, ''))

  const body = (await response.json()) as T & { code: number }

  return {
    body,
    cookie: resCookie,
    status: body.code ?? response.status
  }
}
