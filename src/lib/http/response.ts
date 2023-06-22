import { toMerged } from 'es-toolkit'

import { HEADER } from '../constants'
import { AesGcm } from '../crypto/aes-gcm'

export class CustomResponse {
  /**
   * 统一的响应数据加密
   * @param body 待加密的响应对象
   * @param init 初始化参数
   * @returns 加密过的响应数据
   */
  static async encrypt(body: null | object, init: ResponseInit = {}) {
    init = toMerged<ResponseInit, ResponseInit>({ status: 200 }, init)

    if (process.env.NEXT_PUBLIC_ENCRYPT_API == 'false') {
      return Response.json(body, init)
    }

    const { buffer, ivJwk } = await AesGcm.encrypt(body)

    const headers = new Headers({
      'Content-Type': 'application/octet-stream',
      [HEADER.AES_GCM_IVJWK]: ivJwk
    })

    init = toMerged<ResponseInit, ResponseInit>(init, { headers })

    return new Response(buffer, init)
  }

  /**
   * 统一的错误响应
   * @param error 错误消息
   * @param init 初始化参数
   * @returns 响应数据
   */
  static async error(error: unknown, init: ResponseInit = {}) {
    init = toMerged<ResponseInit, ResponseInit>({ status: 500 }, init)

    const message = error instanceof Error ? error.message : error

    return Response.json({ message } as ResponseError, init)
  }
}
