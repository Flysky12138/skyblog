import { HEADER } from '../constants'
import { AesGcm } from '../crypto/aes-gcm'

export class CustomResponse {
  /**
   * 统一的响应数据加密
   * @param content 待加密的响应对象
   * @param status 状态码
   * @returns 加密过的响应数据
   * @default
   * status = 200
   */
  static async encrypt(content: null | object, status = 200) {
    if (process.env.NEXT_PUBLIC_ENCRYPT_API == 'false') {
      return Response.json(content, { status })
    }

    const { buffer, ivJwk } = await AesGcm.encrypt(content)

    const headers = new Headers({
      'Content-Type': 'application/octet-stream',
      [HEADER.AES_GCM_IVJWK]: ivJwk
    })

    return new Response(buffer, {
      headers,
      status
    })
  }

  /**
   * 统一的错误响应
   * @param message 错误消息
   * @param status 状态码
   * @returns 响应数据
   * @default
   * status = 500
   */
  static async error(message: unknown, status = 500) {
    return Response.json({ message } as ResponseError, { status })
  }
}
