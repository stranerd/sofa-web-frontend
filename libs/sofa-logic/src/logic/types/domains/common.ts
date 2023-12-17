import { Media } from '@modules/core'

export interface ValidationError {
  field: string
  message: string
}

export type FileData = Media

export interface Paginated<D> {
  pages: {
    start: number
    last: number
    next?: number
    previous?: number
    current: number
  }
  docs: {
    limit: number
    total: number
    count: number
  }
  results: D[]
}

export interface ContentDetails {
  type: string
  price: number
  currency: string
  image: string
  title: string
  info: string
  id: string
  hasCourse: boolean
  courseId: string
  status: string
  labels: {
    color: string
    main: string
    sub: string
  }
  ratings: {
    avg: number
    count: number
    label: string
    stats: any
    reviews: {
      user: {
        name: string
        photoUrl: string
        id: string
      }
      rating: number
      review: string
    }[]
  }
  user: {
    name: string
    photoUrl: string
    role: string
    id: string
    stats: {
      quizzes: number
      courses: number
      followers: string
    },
    roles?: Record<string, boolean>
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

export interface Country {
  name: string
  iso2: string
  states: {
    name: string
    state_code: string
  }[]
}