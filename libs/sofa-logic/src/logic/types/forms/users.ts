export interface CustomizeAIInput {
  name: string
  tagline: string
  photo?: Blob
}

export interface UpdateUserCollegeInput {
  data: {
    type: string
    school: {
      type: string
      departmentId: string
    }
  }
}

export interface OrganizationMember {
  hash: string
  id: string
  email: string
  organizationId: string
  pending: boolean
  withCode: boolean
  accepted?: {
    is: boolean
    at: number
  }
  createdAt: number
  updatedAt: number
}

export interface CreateTutorRequestForm {
  topicId: string
  verification: Blob
  qualification: Blob[]
}

export interface UpdateUserAspirantInput {
  data: {
    type: string
    school?: {
      type: string
      exams: {
        institutionId: string
        startDate: number
        endDate: number
        courseIds: string[]
      }
    }
    name?: string
    code?: string
  }
}

export interface UpdateUserTeacherInput {
  data: {
    type: string
    school: string
  }
}

export interface CreateVerificationInput {
  content: {
    quizzes: string[]
    courses: string[]
  }
}

export interface VerificationStatusInput {
  accept: boolean
  id: string
}

export interface PushNotificationTokenInput {
  token: string
}

export interface UpdateUserLocationInput {
  location: {
    country: string
    state: string
  }
}

export interface UpdateUserSocialInput {
  socials: {
    ref: string
    link: string
  }[]
}
