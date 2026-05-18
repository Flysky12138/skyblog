interface Cron {
  /**
   * 企业微信
   */
  WeCom: {
    markdown(content: string): Promise<void>
    markdown_v2(content: string): Promise<void>
    text(
      content: string,
      options?: {
        mentioned_list?: ('@all' | (string & {}))[]
        mentioned_mobile_list?: ('@all' | (string & {}))[]
      }
    ): Promise<void>
  }

  /**
   * 当前时间 UTC+8
   */
  now: () => string
}
