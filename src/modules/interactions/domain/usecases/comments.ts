import { CommentEntity } from '../entities/comments'
import { CommentFactory } from '../factories/comments'
import { ICommentRepository } from '../irepositories/comments'
import { Interaction } from '../types'
import { Listeners, QueryParams } from '@modules/core'

export class CommentsUseCase {
	private repository: ICommentRepository

	constructor(repository: () => ICommentRepository) {
		this.repository = repository()
	}

	async add(entity: Interaction, factory: CommentFactory) {
		const data = await factory.toModel()
		return await this.repository.add({ ...data, entity })
	}

	async delete(id: string) {
		return await this.repository.delete(id)
	}

	async update(entity: Interaction, id: string, factory: CommentFactory) {
		const data = await factory.toModel()
		return await this.repository.update(id, { ...data, entity })
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async get(entity: Interaction) {
		const conditions: QueryParams = {
			where: [
				{ field: 'entity.id', value: entity.id },
				{ field: 'entity.type', value: entity.type },
			],
			sort: [{ field: 'createdAt', desc: true }],
			all: true,
		}

		return await this.repository.get(conditions)
	}

	async listenToOne(id: string, listener: Listeners<CommentEntity>) {
		return await this.repository.listenToOne(id, listener)
	}

	async listen(entity: Interaction, listener: Listeners<CommentEntity>) {
		const conditions: QueryParams = {
			where: [
				{ field: 'entity.id', value: entity.id },
				{ field: 'entity.type', value: entity.type },
			],
			sort: [{ field: 'createdAt', desc: true }],
			all: true,
		}

		return await this.repository.listenToMany(conditions, listener, (e) => e.entity.id === entity.id && e.entity.type === entity.type)
	}
}
