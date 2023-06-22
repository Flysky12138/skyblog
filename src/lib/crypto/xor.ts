/**
 * 异或混淆字符串
 * @default
 * key = 31
 */
export const xor = (data: string, key = 0x1f) => data.replace(/./g, char => String.fromCharCode(char.charCodeAt(0) ^ key))
