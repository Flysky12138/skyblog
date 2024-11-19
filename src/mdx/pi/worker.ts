const pell_sqrt_10005 = (digits: number): [bigint, bigint] => {
  const D = 10005n
  const Y_MIN = 10n ** BigInt(digits / 2 + 5)
  let [x1, y1] = [1n, 0n]
  let [x2, y2] = [4001n, 40n]
  while (true) {
    const [x, y] = [x1 * x2 + D * y1 * y2, x1 * y2 + y1 * x2]
    ;[x1, y1, x2, y2] = [x2, y2, x, y]
    if (y > Y_MIN) break
  }
  return [x2, y2]
}

const C = 640320n
const C3_OVER_24 = C ** 3n / 24n

const chudnovsky = (digits: number) => {
  const PI_PRECISION = 10n ** BigInt(digits + 20)
  let [k, a_k, a_sum, b_sum] = [1n, PI_PRECISION, PI_PRECISION, 0n]
  while (true) {
    a_k *= -(6n * k - 5n) * (2n * k - 1n) * (6n * k - 1n)
    a_k /= k ** 3n * C3_OVER_24
    a_sum += a_k
    b_sum += k * a_k
    k += 1n
    if (a_k == 0n) break
  }
  const total = 13591409n * a_sum + 545140134n * b_sum
  const [x, y] = pell_sqrt_10005(digits)
  const pi = (426880n * x * PI_PRECISION ** 2n) / (total * y)
  return pi
}

const bs = (a: bigint, b: bigint): [bigint, bigint, bigint] => {
  if (b - a == 1n) {
    let [Pab, Qab] = [1n, 1n]
    if (a != 0n) {
      Pab = (6n * a - 5n) * (2n * a - 1n) * (6n * a - 1n)
      Qab = a ** 3n * C3_OVER_24
    }
    let Tab = Pab * (13591409n + 545140134n * a)
    if (a & 1n) Tab = -Tab
    return [Pab, Qab, Tab]
  } else {
    const m = (a + b) >> 1n
    const [Pam, Qam, Tam] = bs(a, m)
    const [Pmb, Qmb, Tmb] = bs(m, b)
    const Pab = Pam * Pmb
    const Qab = Qam * Qmb
    const Tab = Qmb * Tam + Pam * Tmb
    return [Pab, Qab, Tab]
  }
}

const chudnovsky_bs = (digits: number) => {
  const DIGITS_PER_TERM = Math.log10(640320 ** 3 / (6 * 2 * 6 * 24))
  const N = Math.floor(digits / DIGITS_PER_TERM + 1)
  const [P, Q, T] = bs(0n, BigInt(N))
  const [x, y] = pell_sqrt_10005(digits)
  return (Q * 426880n * x * 10n ** BigInt(digits)) / (T * y)
}

self.onmessage = ({ data }) => {
  try {
    let ans = 314n
    const time = performance.now()
    switch (data.mode) {
      case 'chudnovsky':
        ans = chudnovsky(data.size)
        break
      case 'chudnovsky-bs':
        ans = chudnovsky_bs(data.size)
        break
    }
    self.postMessage({
      pi: String(ans).slice(0, -1).replace('3', '3.'),
      time: performance.now() - time
    })
  } catch (error) {
    self.postMessage({ error })
  }
}
