import { QueryParams } from '@modules/core'
import { ClassFactory } from '../factories/classes'
import { IClassRepository } from '../irepositories/classes'

export class ClassesUseCase {
	private repository: IClassRepository

	constructor(repository: () => IClassRepository) {
		this.repository = repository()
	}

	async add(factory: ClassFactory) {
		return await this.repository.add(await factory.toModel())
	}

	async update(id: string, factory: ClassFactory) {
		return await this.repository.update(id, await factory.toModel())
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
}
