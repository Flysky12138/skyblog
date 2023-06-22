interface Auth {
  id: number
  role: 'USER' | 'ADMIN'
}

declare module '@auth/core/jwt' {
  interface JWT extends Partial<Auth> {}
}

declare module '@auth/core/types' {
  interface Session extends Partial<Auth> {}
  interface Account extends Auth {}
}

export {}
