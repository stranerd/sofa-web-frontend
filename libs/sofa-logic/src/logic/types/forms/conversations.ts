import { FileData } from '../domains'

export interface CreateConversationInput {
  body: string
  tutorId: string | null
}

export interface UpdateConversationInput {
  title: string
}

export interface StarMessageInput {
  starred: boolean
}

export interface CreateMessageInput {
  body: string
  media: FileData | null
}

export interface EndConversationInput {
  rating: number
  message: string
}

export interface CreateTutorRequestInput {
  message: string
  conversationId: string
  tutorId: string
}
