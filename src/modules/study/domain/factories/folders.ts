import { BaseFactory } from '@modules/core'
import { v } from 'valleyed'
import { FolderToModel } from '../../data/models/folders'
import { FolderEntity } from '../entities/folders'

export class FolderFactory extends BaseFactory<FolderEntity, FolderToModel, FolderToModel> {
	readonly rules = {
		title: v.string().min(1),
	}

	constructor() {
		super({ title: '' })
	}

	get title() {
		return this.values.title
	}

	set title(value: string) {
		this.set('title', value)
	}

	loadEntity = (entity: FolderEntity) => {
		this.reset()
		this.entityId = entity.id
		this.title = entity.title
	}

	model = async () => {
		const { title } = this.validValues
		return { title }
	}
}
