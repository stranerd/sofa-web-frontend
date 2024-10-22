import { v } from 'valleyed'
import { TagToModel } from '../../data/models/tags'
import { TagEntity } from '../entities/tags'
import { TagTypes } from '@modules/interactions/domain/types'
import { BaseFactory } from '@modules/core'

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

	load = (entity: TagEntity) => {
		this.title = entity.title
		this.type = entity.type
		this.parent = entity.parent
	}

	model = () => {
		const { title, type, parent } = this.validValues
		return { title, type, parent }
	}
}
