export class SwapWithSin {
  static decrypt(data: string) {
    const ans = data.split('')
    for (let i = 0; i < ans.length; i++) {
      const j = Math.abs(Math.sin(i) * ans.length) >> 0
      ;[ans[i], ans[j]] = [ans[j], ans[i]]
    }
    return ans.join('')
  }

  static encrypt(data: string) {
    const ans = data.split('')
    for (let i = ans.length - 1; i >= 0; i--) {
      const j = Math.abs(Math.sin(i) * ans.length) >> 0
      ;[ans[i], ans[j]] = [ans[j], ans[i]]
    }
    return ans.join('')
  }
}
