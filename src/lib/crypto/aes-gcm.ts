import { SwapWithSin } from './swap'
import { xor } from './xor'

type IvJwkType = { iv: string; jwk: JsonWebKey }

export class AesGcm {
  /**
   * 定义对称加解密算法
   */
  static #algorithm = (iv: Uint8Array): AesGcmParams => ({ iv, name: 'AES-GCM' })

  /**
   * 加密
   * @param data 待加密字符串
   * @returns 加密后的二进制数据缓冲区、加密过的密钥
   */
  static async encrypt(data: object | null) {
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
    let ivJwk = JSON.stringify({ jwk, iv: Buffer.from(iv).toString('base64') } as IvJwkType)
    ivJwk = xor(ivJwk)
    ivJwk = btoa(ivJwk).slice(0, -2)
    ivJwk = SwapWithSin.encrypt(ivJwk)

    return { buffer, ivJwk }
  }

  /**
   * 解密
   * @param buffer 待解密的二进制数据缓冲区
   * @param ivJwk 加密过的密钥
   * @returns 原始数据
   */
  static async decrypt(buffer: ArrayBuffer, ivJwk: string) {
    // 解码 - 初始化向量、可传输密钥
    ivJwk = SwapWithSin.decrypt(ivJwk)
    ivJwk = atob(ivJwk + '==')
    ivJwk = xor(ivJwk)
    const { iv, jwk }: IvJwkType = JSON.parse(ivJwk)

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
}
