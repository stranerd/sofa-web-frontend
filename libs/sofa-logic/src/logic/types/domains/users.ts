import { User } from './auth'
import { FileData } from './common'

type RankingValue = {
  value: number
  lastUpdatedAt: number
}

export interface SingleUser {
  hash: string
  id: string
  bio: User
  socials: {
    ref: string
    link: string
  }[]
  roles: {
    isAdmin: boolean
    isSuperAdmin: boolean
    isTutor: boolean
    isVerified: boolean
  }
  dates: {
    createdAt: number
    deletedAt?: number
  }
  status: {
    connections: number[]
    lastUpdatedAt: number
  }
  location: {
    country: string
    state: string
  }
  account: {
    meta: {
      connects: number
      courses: number
      folders: number
      quizzes: number
      images: number
      documents: number
      videos: number
      total: number
      students: number
    }
    rankings: {
      daily: RankingValue
      monthly: RankingValue
      overall: RankingValue
      weekly: RankingValue
    }
    streak: {
      count: number
      lastEvaluatedAt: number
      longestStreak: number
    }
    ratings: {
      total: number
      count: number
      avg: number
    }
    organizationsIn: string[]
  }
  type?: {
    type: string
    name: string
    school: {
      type: string
      exams: {
        institutionId: string
        startDate: number
        endDate: number
        courseIds: string[]
      }
      departmentId: string
      institutionId: string
      facultyId: string
    }
  }
  tutor: {
    conversations: []
  }
  ai: {
    name: string
    tagline: string
    photo: FileData
  }
}

export interface UserVerification {
  hash: string
  id: string
  userId: string
  socials: {
    website: string
    facebook: string
    twitter: string
    instagram: string
    linkedIn: string
    youtube: string
    tiktok: string
  }
  content: {
    quizzes: string[]
    courses: string[]
  }
  pending: boolean
  accepted: boolean
  createdAt: number
  updatedAt: number
}

export interface TutorRequest {
  hash: string
  id: string
  userId: string
  topicId: string
  verification: FileData
  qualification: FileData[]
  pending: boolean
  accepted: boolean
  testId: string
  testFinished: boolean
  createdAt: number
  updatedAt: number
}
