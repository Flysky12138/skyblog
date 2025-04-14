/**
 * 异或混淆字符串
 * @default
 * digit = 31
 */
export const xor = (data: string, digit = 0x1f) => data.replace(/./g, char => String.fromCharCode(char.charCodeAt(0) ^ digit))
