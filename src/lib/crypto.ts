/**
 * 异或混淆字符串
 * @default
 * digit = 31
 */
const xor = (data: string, digit = 0x1f) => data.replace(/./g, char => String.fromCharCode(char.charCodeAt(0) ^ digit))

interface IvJwk {
  iv: string
  jwk: JsonWebKey
}

export abstract class AesGcm {
  /**
   * 解密
   * @param buffer 待解密的二进制数据缓冲区
   * @param ivJwk 加密过的密钥
   * @returns 原始数据
   */
  static async decrypt(buffer: ArrayBuffer, ivJwk: string) {
    // 解码 - 初始化向量、可传输密钥
    ivJwk = atob(ivJwk)
    ivJwk = xor(ivJwk)
    const { iv, jwk }: IvJwk = JSON.parse(ivJwk)

    // 解密算法
    const alg = this.#algorithm(new Uint8Array(Buffer.from(iv, 'base64')))
    // 解密密钥
    const key = await crypto.subtle.importKey('jwk', jwk, alg, false, ['decrypt'])

    // 解密
    const source = await crypto.subtle.decrypt(alg, key, Buffer.from(buffer))

    // 8 位无符号整型数组 => 原始内容
    const data = JSON.parse(new TextDecoder().decode(source))

    return data
  }

  /**
   * 加密
   * @param data 待加密字符串
   * @returns 加密后的二进制数据缓冲区、加密过的密钥
   */
  static async encrypt(data: unknown) {
    // 初始化向量
    const iv = crypto.getRandomValues(new Uint8Array(12))
    // 生成加密密钥
    const key = await crypto.subtle.generateKey({ length: 256, name: 'AES-GCM' }, true, ['encrypt', 'decrypt'])
    // 原始内容转 8 位无符号整型数组
    const source = new TextEncoder().encode(JSON.stringify(data))

    // 加密
    const buffer = await crypto.subtle.encrypt(this.#algorithm(iv), key, source)

    // 导出可传输密钥（可以在网络上传输的格式）
    const jwk = await crypto.subtle.exportKey('jwk', key)

    // 编码 - 初始化向量、可传输密钥
    let ivJwk = JSON.stringify({ iv: Buffer.from(iv).toString('base64'), jwk } satisfies IvJwk)
    ivJwk = xor(ivJwk)
    ivJwk = btoa(ivJwk)

    return { buffer, ivJwk }
  }

  /**
   * 定义对称加解密算法
   */
  static #algorithm = (iv: Uint8Array<ArrayBuffer>): AesGcmParams => ({ iv, name: 'AES-GCM' })
}

/**
 * SHA-256 摘要运算
 */
export const sha256 = async (file: File) => {
  const buffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  return Array.from(new Uint8Array(hashBuffer), b => b.toString(16).padStart(2, '0')).join('')
}
