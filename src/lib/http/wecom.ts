/**
 * 企业微信相关接口
 * @see https://work.weixin.qq.com/api/doc/90000/90136/91770
 */
export abstract class WeCom {
  static async markdown(content: string) {
    'use server'

    if (!process.env.WECOM_WEBHOOK_URL) {
      throw new Error('WECOM_WEBHOOK_URL is not set')
    }

    await fetch(process.env.WECOM_WEBHOOK_URL, {
      method: 'POST',
      body: JSON.stringify({
        msgtype: 'markdown',
        markdown: {
          content
        }
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  static async markdown_v2(content: string) {
    'use server'

    if (!process.env.WECOM_WEBHOOK_URL) {
      throw new Error('WECOM_WEBHOOK_URL is not set')
    }

    await fetch(process.env.WECOM_WEBHOOK_URL, {
      method: 'POST',
      body: JSON.stringify({
        msgtype: 'markdown_v2',
        markdown_v2: {
          content
        }
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  static async text(
    content: string,
    options?: {
      mentioned_list?: StringLiteralsOrString<'@all'>[]
      mentioned_mobile_list?: StringLiteralsOrString<'@all'>[]
    }
  ) {
    'use server'

    if (!process.env.WECOM_WEBHOOK_URL) {
      throw new Error('WECOM_WEBHOOK_URL is not set')
    }

    await fetch(process.env.WECOM_WEBHOOK_URL, {
      method: 'POST',
      body: JSON.stringify({
        msgtype: 'text',
        text: {
          content,
          ...options
        }
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
