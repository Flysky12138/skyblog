import { HEADER } from '../constants'
import { AesGcm } from '../crypto/aes-gcm'

export class CustomResponse {
  /**
   * 统一的错误响应
   * @param message 错误消息
   * @param status 状态码
   * @returns 响应数据
   * @default
   * status = 500
   */
  static async error(message: unknown, status = 500) {
    const headers = new Headers()
    headers.set('Content-Type', 'application/json')

    return new Response(JSON.stringify({ message }), {
      headers,
      status
    })
  }

  /**
   * 统一的响应数据加密
   * @param content 待加密的响应对象
   * @param status 状态码
   * @returns 加密过的响应数据
   * @default
   * status = 200
   */
  static async encrypt(content: object | null, status = 200) {
    const headers = new Headers()

    if (process.env.NODE_ENV == 'development') {
      headers.set('Content-Type', 'application/json')
      return new Response(JSON.stringify(content), {
        headers,
        status
      })
    }

    headers.set('Content-Type', 'application/octet-stream')
    const { buffer, ivJwk } = await AesGcm.encrypt(content)
    headers.set(HEADER.AES_GCM_IVJWK, ivJwk)

    return new Response(buffer, {
      headers,
      status
    })
  }
}
