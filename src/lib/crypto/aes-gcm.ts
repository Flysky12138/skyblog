type IvJwkType = { iv: string; jwk: JsonWebKey }

// 异或混淆字符串
const xorEncrypt = (data: string, key = 0x1f) => data.replace(/./g, char => String.fromCharCode(char.charCodeAt(0) ^ key))

// 交换字符串
const swapString = {
  decrypt: (data: string) => {
    const ans = data.split('')
    for (let i = 0; i < ans.length; i++) {
      const j = Math.abs(Math.sin(i) * ans.length) >> 0
      ;[ans[i], ans[j]] = [ans[j], ans[i]]
    }
    return ans.join('')
  },
  encrypt: (data: string) => {
    const ans = data.split('')
    for (let i = ans.length - 1; i >= 0; i--) {
      const j = Math.abs(Math.sin(i) * ans.length) >> 0
      ;[ans[i], ans[j]] = [ans[j], ans[i]]
    }
    return ans.join('')
  }
}

// 定义对称加解密算法
const algorithm = (iv: Uint8Array): AesGcmParams => ({ iv, name: 'AES-GCM' })

export const encrypt = async (data: object | null) => {
  // 初始化向量
  const iv = crypto.getRandomValues(new Uint8Array(12))
  // 生成加密密钥
  const key = await crypto.subtle.generateKey({ length: 256, name: 'AES-GCM' }, true, ['encrypt', 'decrypt'])
  // 原始内容转 8 位无符号整型数组
  const source = new TextEncoder().encode(JSON.stringify(data))

  // 加密
  const buffer = await crypto.subtle.encrypt(algorithm(iv), key, source)

  // 导出可传输密钥（可以在网络上传输的格式）
  const jwk = await crypto.subtle.exportKey('jwk', key)

  // 编码 - 初始化向量、可传输密钥
  let ivJwk = JSON.stringify({ iv: Buffer.from(iv).toString('base64'), jwk } as IvJwkType)
  ivJwk = xorEncrypt(ivJwk)
  ivJwk = btoa(ivJwk).slice(0, -2)
  ivJwk = swapString.encrypt(ivJwk)

  return { buffer, ivJwk }
}

export const decrypt = async (buffer: ArrayBuffer, ivJwk: string) => {
  // 解码 - 初始化向量、可传输密钥
  ivJwk = swapString.decrypt(ivJwk)
  ivJwk = atob(ivJwk + '==')
  ivJwk = xorEncrypt(ivJwk)
  const { iv, jwk }: IvJwkType = JSON.parse(ivJwk)

  // 解密算法
  const alg = algorithm(new Uint8Array(Buffer.from(iv, 'base64')))
  // 解密密钥
  const key = await crypto.subtle.importKey('jwk', jwk, alg, false, ['decrypt'])

  // 解密
  const source = await crypto.subtle.decrypt(alg, key, Buffer.from(buffer))

  // 8 位无符号整型数组 转 原始内容
  const data = JSON.parse(new TextDecoder().decode(source))

  return data
}
