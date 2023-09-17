import { FileData } from './common'
import { SingleUser } from './users'

export interface Folder {
  hash: string
  id: string
  title: string
  saved: {
    courses: string[]
    quizzes: string[]
  }
  courses: Course[]
  quizzes: Quiz[]
  user: SingleUser
  createdAt: number
  updatedAt: number
}

export interface Quiz {
  hash: string
  id: string
  title: string
  description: string
  photo?: FileData
  questions: string[]
  courseId?: string
  user: SingleUser
  topicId: string
  tagIds: string[]
  status: string
  meta: {
    games: number
    total: number
  }
  ratings: {
    avg: number
    total: number
    count: number
  }
  createdAt: number
  updatedAt: number
  __type: 'QuizEntity'
}

export interface Question {
  hash: string
  id: string
  userId: string
  quizId: string
  key: string
  type: string
  question: string
  questionMedia?: FileData
  timeLimit: number
  explanation?: string
  data: {
    type:
      | 'multipleChoice'
      | 'writeAnswer'
      | 'trueOrFalse'
      | 'fillInBlanks'
      | 'dragAnswers'
      | 'sequence'
      | 'match'
    indicator?: string
    options?: string[]
    answers?: any[]
    answer?: boolean
    set?: {
      q: string
      a: string
    }[]
  }
  createdAt: number
  updatedAt: number
}

export interface Course {
  hash: string
  id: string
  coursables: {
    id: string
    type: string
  }[]
  sections: {
    label: string
    items: {
      id: string
      type: string
    }[]
  }[]
  title: string
  description: string
  photo?: FileData
  user: SingleUser
  topicId: string
  tagIds: string[]
  status: string
  frozen: boolean
  ratings: {
    avg: number
    total: number
    count: number
  }
  price: {
    amount: number
    currency: string
  }
  createdAt: number
  updatedAt: number
  __type: 'CourseEntity'
}

export interface SofaFile {
  hash: string
  id: string
  title: string
  description: string
  photo?: FileData
  type: string
  courseId?: string
  user: SingleUser
  topicId: string
  tagIds: string[]
  status: string
  createdAt: number
  updatedAt: number
}

export interface SofaMediaFile {
  name: string
  type: string
  size: number
  duration: number
  path: string
  timestamp: number
  link: string
}

export interface QuizQuestion {
  title: string
  info: string
  question: string
  duration: string
  answer?: String
  userAnswer?: String
  id: string
  timeLimit: number
  currentTime: number
  options: {
    type: string
    data: {
      content: {
        label: string
        type: string
        value?: string
        extraClass?: string
        shape?: string
      }[]
      shape?: string
      hover?: boolean
    }[]
  }
}

export interface ResourceType {
  title: string
  image: string
  username: string
  subject: string
  labels: {
    main: string
    sub: string
    color: string
  }
  progress: number
  routePath: string
  id: string
  status: string
  showMore: boolean
  userId: string
  type: 'course' | 'quiz' | string
  ratings: {
    avg: number
    count: number
    total: number
  }
}
