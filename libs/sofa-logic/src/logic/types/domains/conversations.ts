import { FileData } from './common'
import { SingleUser } from './users'

export interface Conversation {
  hash: string
  id: string
  title: string
  user: SingleUser
  tutor: SingleUser | null
  pending: boolean
  accepted: { is: boolean, at: number } | null
  ended: { rating: number, message: string, at: number } | null
  createdAt: number
  updatedAt: number
  last: Message | null
  readAt: Record<string, number>
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
  readAt: Record<string, number>
}
