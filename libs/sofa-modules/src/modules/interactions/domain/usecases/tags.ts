import { Listeners } from '@modules/core'
import { TagEntity } from '../entities/tags'
import { TagFactory } from '../factories/tags'
import { ITagRepository } from '../irepositories/tags'
import { TagTypes } from '../types'

export class TagsUseCase {
	private repository: ITagRepository

	constructor (repository: () => ITagRepository) {
		this.repository = repository()
	}

	async add (factory: TagFactory) {
		return await this.repository.add(await factory.toModel())
	}

	async delete (id: string) {
		return await this.repository.delete(id)
	}

	async update (id: string, factory: TagFactory) {
		return await this.repository.update(id, await factory.toModel())
	}

	async getAllTopics () {
		return await this.repository.get({
			where: [{ field: 'type', value: TagTypes.topics }],
			all: true
		})
	}

	async getAllGeneric () {
		return await this.repository.get({
			where: [{ field: 'type', value: TagTypes.generic }],
			all: true
		})
	}

	async listenToAllTopics (listener: Listeners<TagEntity>) {
		return await this.repository.listenToMany({
			where: [{ field: 'type', value: TagTypes.topics }],
			all: true
		}, listener, (entity) => entity.type === TagTypes.topics)
	}

	async listenToAllGeneric (listener: Listeners<TagEntity>) {
		return await this.repository.listenToMany({
			where: [{ field: 'type', value: TagTypes.generic }],
			all: true
		}, listener, (entity) => entity.type === TagTypes.generic)
	}
}
