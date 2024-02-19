import { PlayToModel } from '../../data/models/plays'
import { PlayEntity } from '../entities/plays'
import { IPlayRepository } from '../irepositories/plays'
import { QueryParams } from '@modules/core'

export class PlaysUseCase<E extends PlayEntity, T extends PlayToModel, R extends IPlayRepository<E, T>> {
	protected repository: R

	constructor(repository: R) {
		this.repository = repository
	}

	async create(data: T) {
		return await this.repository.create(data)
	}

	async delete(id: string) {
		return await this.repository.delete(id)
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async get(query: QueryParams) {
		return await this.repository.get(query)
	}

	async start(id: string) {
		return await this.repository.start(id)
	}

	async end(id: string) {
		return await this.repository.end(id)
	}
}
