import { MessageFromModel } from './messages'
import { EmbeddedUser } from '@modules/users'

export interface ConversationFromModel extends UpdateConversationToModel {
	id: string
	title: string
	user: EmbeddedUser
	tutor: EmbeddedUser | null
	pending: boolean
	accepted: { is: boolean; at: number } | null
	ended: { rating: number; message: string; at: number } | null
	createdAt: number
	updatedAt: number
	readAt: Record<string, number>
	last: MessageFromModel | null
}

export interface CreateConversationToModel {
	body: string
	tutorId: string | null
}

export interface UpdateConversationToModel {
	title: string
}
