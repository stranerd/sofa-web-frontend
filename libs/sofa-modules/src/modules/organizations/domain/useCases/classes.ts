import { QueryParams } from '@modules/core'
import { ClassToModel } from '../../data/models/classes'
import { IClassRepository } from '../irepositories/classes'

export class ClassesUseCase {
	private repository: (organizationId: string) => IClassRepository

	constructor(repository: (organizationId: string) => IClassRepository) {
		this.repository = repository
	}

	async add(data: ClassToModel) {
		return await this.repository(data.organizationId).add(data)
	}

	async delete(data: { id: string; organizationId: string }) {
		return await this.repository(data.organizationId).delete(data.id)
	}

	async find(organizationId: string, classId: string) {
		return await this.repository(organizationId).find(classId)
	}

	async get(organizationId: string, query: QueryParams) {
		return await this.repository(organizationId).get(query)
	}
}
