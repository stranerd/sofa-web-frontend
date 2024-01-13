import { BaseFactory } from '@modules/core'
import { TagTypes } from '@modules/interactions/domain/types'
import { v } from 'valleyed'
import { TagToModel } from '../../data/models/tags'
import { TagEntity } from '../entities/tags'

export class TagFactory extends BaseFactory<TagEntity, TagToModel, TagToModel> {
	readonly rules = {
		title: v.string().min(1),
		type: v.in(Object.values(TagTypes)),
		parent: v.string().min(1).nullable(),
	}

	reserved = []

	constructor() {
		super({ title: '', type: TagTypes.topics, parent: null })
	}

	get title() {
		return this.values.title
	}

	set title(value: string) {
		this.set('title', value)
	}

	get type() {
		return this.values.type
	}

	set type(value: string) {
		this.set('type', value)
	}

	get parent() {
		return this.values.parent
	}

	set parent(value: string | null) {
		this.set('parent', value)
	}

	loadEntity = (entity: TagEntity) => {
		this.entityId = entity.id
		this.title = entity.title
		this.type = entity.type
		this.parent = entity.parent
	}

	model = async () => {
		const { title, type, parent } = this.validValues
		return { title, type, parent }
	}
}
