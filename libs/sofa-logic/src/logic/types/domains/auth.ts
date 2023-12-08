import { FileData } from './common'

export enum AuthTypes {
  email = 'email',
  google = 'google',
  apple = 'apple'
}

export type Phone = {
  code: string
  number: string
}

interface User {
  name: {
    first: string
    last: string
    middle: string
    full: string
  }
  email: string
  description: string
  photo: FileData | null
  phone: Phone | null
}

interface AuthUser extends User {
  hash: string
  id: string
  isEmailVerified: boolean
  authTypes: AuthTypes[]
  roles: {
    isAdmin: boolean
    isSuperAdmin: boolean
    isVerified: boolean
    isSubscribed: boolean
  }
  lastSignedInAt: number
  signedUpAt: number
  allNames: {
    first: string
    last: string
    full: string
  }
}

interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

export { AuthUser, AuthResponse, User }
