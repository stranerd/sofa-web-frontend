import { IMethodRepository } from '../irepositories/methods'
import { QueryParams } from '@modules/core'

export class MethodsUseCase {
	repository: IMethodRepository

	constructor(repo: IMethodRepository) {
		this.repository = repo
	}

	async get(input: QueryParams) {
		return await this.repository.get(input)
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async makePrimary(data: { id: string; userId: string }) {
		return await this.repository.makePrimary(data.id, data.userId)
	}

	async delete(data: { id: string; userId: string }) {
		return await this.repository.delete(data.id, data.userId)
	}
}
