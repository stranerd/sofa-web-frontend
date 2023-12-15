import { QueryParams } from '@modules/core'
import { ClassToModel } from '../../data/models/classes'
import { IClassRepository } from '../irepositories/classes'

export class ClassesUseCase {
	private repository: IClassRepository

	constructor (repository: IClassRepository) {
		this.repository = repository
	}

	async add (data: ClassToModel) {
		return await this.repository.add(data)
	}

	async delete (data: { id: string, organizationId: string }) {
		return await this.repository.delete(data.organizationId, data.id)
	}

	async find (organizationId: string, classId: string) {
		return await this.repository.find(organizationId, classId)
	}

	async get (organizationId: string, query: QueryParams) {
		return await this.repository.get(organizationId, query)
	}
}
