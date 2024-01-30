import { FolderFromModel } from '../../data/models/folders'
import { FolderSaved } from '../types'
import { BaseEntity } from '@modules/core'
import { EmbeddedUser } from '@modules/users'

export class FolderEntity extends BaseEntity {
	public readonly id: string
	public readonly title: string
	public readonly saved: Record<FolderSaved, string[]>
	public readonly user: EmbeddedUser
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor({ id, title, saved, user, createdAt, updatedAt }: FolderFromModel) {
		super()
		this.id = id
		this.title = title
		this.saved = saved
		this.user = user
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}
