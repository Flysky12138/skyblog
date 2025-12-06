import { HEADER_KEY } from '../constants'
import { AesGcm } from '../crypto'

interface ResponseError {
  message: string
}

export class CustomResponse {
  /**
   * 统一的响应数据加密
   * @param body 待加密的响应对象
   * @param init 初始化参数
   * @returns 加密过的响应数据
   */
  static async encrypt(body: null | object, init: ResponseInit = {}) {
    if (process.env.NEXT_PUBLIC_ENCRYPT_API == 'false') {
      return Response.json(body, init)
    }

    const { buffer, ivJwk } = await AesGcm.encrypt(body)

    const headers = new Headers({
      'Content-Type': 'application/octet-stream',
      [HEADER_KEY.AES_GCM_IVJWK]: ivJwk
    })

    return new Response(buffer, {
      headers,
      status: 200,
      ...init
    })
  }

  /**
   * 统一的错误响应
   * @param error 错误消息
   * @param init 初始化参数
   * @returns 响应数据
   */
  static async error(error: unknown, init: ResponseInit = {}) {
    const message = error instanceof Error ? error.message : error

    return Response.json({ message } as ResponseError, {
      status: 500,
      ...init
    })
  }
}
