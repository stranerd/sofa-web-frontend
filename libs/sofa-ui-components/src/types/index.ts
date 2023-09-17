export interface SelectOption {
  key: any
  value: string
  extras?: string
  hasIcon?: boolean
  isImage?: boolean
  isString?: boolean
}

export interface FormRule {
  type:
    | 'isRequired'
    | 'isGreaterThan'
    | 'isLessThan'
    | 'isEqualsTo'
    | 'isGreaterThanOrEqualsTo'
    | 'isLessThanOrEqualsTo'
    | 'isRegex'
    | 'isCondition'
  value: any | undefined
  errorMessage: string | undefined
}

export interface CourseSectionInput {
  label: string
  items: {
    id: string
    type: string
  }[]
}

export interface UpdateCourseSectionsInput {
  sections: CourseSectionInput[]
  id: string
}

export interface ContentDetails {
  type: string
  price: number
  id: string
  image: string
  title: string
  info: string
  labels: {
    color: string
    main: string
    sub: string
  }
  ratings: {
    total: 4
    label: string
    totalCount: number
    stats: any
    reviews: {
      user: {
        name: string
        photoUrl: string
      }
      rating: number
      review: string
    }[]
  }
  user: {
    name: string
    photoUrl: string
    role: string
    stats: {
      quizzes: number
      courses: number
      followers: string
    }
  }
  lastUpdated: string
  tags: string[]
  content: {
    materialsCount: number
    sections: {
      title: string
      data: {
        title: string
        sub: string
        type: string
        isLocked: boolean
      }[]
      opened: boolean
    }[]
  }
  questions: {
    type: any
    duration: any
    content: string
    answer: string
  }[]
}
