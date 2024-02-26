import { v } from 'valleyed'
import { FolderToModel } from '../../data/models/folders'
import { FolderEntity } from '../entities/folders'
import { BaseFactory } from '@modules/core'

export class FolderFactory extends BaseFactory<FolderEntity, FolderToModel, FolderToModel> {
	readonly rules = {
		title: v.string().min(1),
	}

	constructor() {
		super({ title: '' })
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
