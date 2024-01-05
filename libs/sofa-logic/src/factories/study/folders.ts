import { valleyed } from '@utils/commons'
import { CreateFolderInput, Folder } from '../../logic'
import { BaseFactory } from '@modules/core'

const v = valleyed.v
export class FolderFactory extends BaseFactory<Folder, CreateFolderInput, CreateFolderInput> {
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

	loadEntity = (entity: Folder) => {
		this.reset()
		this.entityId = entity.id
		this.title = entity.title
	}

	toModel = async () => {
		if (this.valid) {
			const { title } = this.validValues
			return { title }
		} else {
			throw new Error('Validation errors')
		}
	}
}
