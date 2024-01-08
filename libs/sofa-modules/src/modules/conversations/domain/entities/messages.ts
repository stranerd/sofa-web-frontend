import { BaseEntity, Media } from '@modules/core'
import { MessageFromModel } from '../../data/models/messages'

export class MessageEntity extends BaseEntity {
	public readonly id: string
	public readonly conversationId: string
	public readonly userId: string
	public readonly body: string
	public readonly media: Media | null
	public readonly tags: string[]
	public readonly starred: boolean
	public readonly createdAt: number
	public readonly updatedAt: number
	public readonly readAt: Record<string, number>

	constructor({ id, conversationId, userId, body, media, tags, starred, createdAt, updatedAt, readAt }: MessageFromModel) {
		super()
		this.id = id
		this.conversationId = conversationId
		this.userId = userId
		this.body = body
		this.media = media
		this.tags = tags
		this.starred = starred
		this.createdAt = createdAt
		this.updatedAt = updatedAt
		this.readAt = readAt
	}
}
