import { Media } from '@modules/core'

export interface MessageFromModel extends MessageToModel {
	id: string
	conversationId: string
	userId: string
	tags: string[]
	starred: boolean
	readAt: Record<string, number>
	createdAt: number
	updatedAt: number
}

export interface MessageToModel {
	body: string
	media: Media | null
}
