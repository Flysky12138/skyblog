import { HEADER } from '../constants'
import { encrypt as _encrypt } from '../crypto/aes-gcm'

const error = async (message: any, status = 500) => {
  const headers = new Headers()
  headers.set('Content-Type', 'application/json')

  return new Response(JSON.stringify({ message }), {
    headers,
    status
  })
}

const encrypt = async (content: object | null, status = 200) => {
  const headers = new Headers()

  if (process.env.NODE_ENV == 'development') {
    headers.set('Content-Type', 'application/json')
    return new Response(JSON.stringify(content), {
      headers,
      status
    })
  }

  headers.set('Content-Type', 'application/octet-stream')
  const { buffer, ivJwk } = await _encrypt(content)
  headers.set(HEADER.AES_GCM_IVJWK, ivJwk)

  return new Response(buffer, {
    headers,
    status
  })
}

export const CustomResponse = {
  encrypt,
  error
}
