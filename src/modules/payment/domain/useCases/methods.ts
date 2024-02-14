import { IMethodRepository } from '../irepositories/methods'
import { MethodEntity } from '../entities/methods'
import { QueryParams, Listeners } from '@modules/core'

export class MethodsUseCase {
	repository: IMethodRepository

	constructor(repo: IMethodRepository) {
		this.repository = repo
	}

	async getAll() {
		return await this.repository.get({ all: true })
	}

	async get(input: QueryParams) {
		return await this.repository.get(input)
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async makePrimary(id: string) {
		return await this.repository.makePrimary(id)
	}

	async delete(id: string) {
		return await this.repository.delete(id)
	}
	async listenToAll(listener: Listeners<MethodEntity>) {
		const conditions: QueryParams = {
			all: true,
		}

		return await this.repository.listenToMany(conditions, listener, () => true)
	}
}
