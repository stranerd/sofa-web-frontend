export interface UpdateUserProfileInput {
  name: {
    first: string
    last: string
  }
  description: string
  photo?: Blob
  socials: {
    ref: string
    link: string
  }[]
}

export interface UpdatePasswordInput {
  oldPassword: string
  password: string
}

export interface UpdatePhoneInput {
  phone: {
    code: string
    number: string
  }
}
