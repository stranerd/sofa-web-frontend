import { FileData } from './common'
import { SingleUser } from './users'

export interface Conversation {
  hash: string
  id: string
  title: string
  user: SingleUser
  tutor: SingleUser
  tags: string[]
  starred: boolean
  createdAt: number
  updatedAt: number
  last?: {
    hash: string
    id: string
    conversationId: string
    userId: string
    body: string
    media?: FileData
    tags: string[]
    starred: boolean
    createdAt: number
    updatedAt: number
    readAt: {
      'ai-bot': number
    }
  }
  readAt: {
    'ai-bot': number
  }
}

export interface Message {
  hash: string
  id: string
  conversationId: string
  userId: string
  body: string
  media: FileData
  tags: string[]
  starred: boolean
  createdAt: number
  updatedAt: number
  readAt: {}
}

export interface ConversationTutorRequest {
  hash: string
  id: string
  tutor: SingleUser
  userId: string
  conversationId: string
  pending: boolean
  message: string
  accepted: boolean
  createdAt: number
  updatedAt: number
  user: SingleUser
}
