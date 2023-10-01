interface ValidationError {
  field: string
  message: string
}

interface Paginated<D> {
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

interface FileData {
  name: string
  type: string
  size: number
  path: string
  timestamp: number
  link: string
}

interface ContentDetails {
  type: string
  price: number
  image: string
  title: string
  info: string
  id: string
  status: string
  labels: {
    color: string
    main: string
    sub: string
  }
  ratings: {
    total: number
    label: string
    totalCount: number
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

interface Country {
  name: string
  iso2: string
  states: {
    name: string
    state_code: string
  }[]
}

export enum QueryKeys {
  and = 'and',
  or = 'or',
}

export enum Conditions {
  lt = 'lt',
  lte = 'lte',
  gt = 'gt',
  gte = 'gte',
  eq = 'eq',
  ne = 'ne',
  in = 'in',
  nin = 'nin',
  exists = 'exists',
}

export interface QueryParams {
  where?: { field: string; value: any; condition?: Conditions }[]
  whereType?: QueryKeys
  sort?: [{ field: string; desc?: boolean }]
  limit?: number
  all?: boolean
  page?: number
  search?: { value: string; fields: string[] }
}

export { ValidationError, Paginated, FileData, ContentDetails, Country }
