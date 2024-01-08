import { BaseEntity } from '@modules/core'
import { EmbeddedUser } from '@modules/users'
import { ConversationFromModel } from '../../data/models/conversations'
import { MessageEntity } from './messages'

export class ConversationEntity extends BaseEntity {
	public readonly id: string
	public readonly title: string
	public readonly user: EmbeddedUser
	public readonly tutor: EmbeddedUser | null
	public readonly pending: boolean
	public readonly accepted: { is: boolean; at: number } | null
	public readonly ended: { rating: number; message: string; at: number } | null
	public readonly createdAt: number
	public readonly updatedAt: number
	public readonly last: MessageEntity | null
	public readonly readAt: Record<string, number>

	constructor({ id, title, user, tutor, pending, accepted, ended, createdAt, updatedAt, last, readAt }: ConversationFromModel) {
		super()
		this.id = id
		this.title = title
		this.user = user
		this.tutor = tutor
		this.pending = pending
		this.accepted = accepted
		this.ended = ended
		this.createdAt = createdAt
		this.updatedAt = updatedAt
		this.last = last ? new MessageEntity(last) : null
		this.readAt = readAt
	}

	get isActive() {
		return !this.pending && this.accepted.is && !this.ended && !!this.tutor
	}
}
