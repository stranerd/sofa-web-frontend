import { BaseEntity } from '@modules/core'
import { TagFromModel } from '../../data/models/tags'
import { TagMeta, TagTypes } from '../types'

export class TagEntity extends BaseEntity {
	public readonly id: string
	public readonly title: string
	public readonly type: TagTypes
	public readonly parent: string | null
	public readonly meta: Record<TagMeta, number>
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, title, type, parent, meta, createdAt, updatedAt }: TagFromModel) {
		super()
		this.id = id
		this.title = title
		this.type = type
		this.parent = parent
		this.meta = meta
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}
