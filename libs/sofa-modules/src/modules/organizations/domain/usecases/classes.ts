import { Listeners, QueryParams } from '@modules/core'
import { ClassFactory } from '../factories/classes'
import { IClassRepository } from '../irepositories/classes'
import { ClassEntity } from '../entities/classes'

export class ClassesUseCase {
	private repository: (organizationId: string) => IClassRepository

	constructor(repository: (organizationId: string) => IClassRepository) {
		this.repository = repository
	}

	async add(organizationId: string, factory: ClassFactory) {
		return await this.repository(organizationId).add(await factory.toModel())
	}

	async update(organizationId: string, id: string, factory: ClassFactory) {
		return await this.repository(organizationId).update(id, await factory.toModel())
	}

	async delete(data: { id: string; organizationId: string }) {
		return await this.repository(data.organizationId).delete(data.id)
	}

	async find(organizationId: string, classId: string) {
		return await this.repository(organizationId).find(classId)
	}

	async getAll(organizationId: string) {
		return await this.repository(organizationId).get({
			all: true,
		})
	}

	async listenToAll(organizationId: string, listener: Listeners<ClassEntity>) {
		const conditions: QueryParams = {
			all: true,
		}

		return await this.repository(organizationId).listenToMany(conditions, listener, () => true)
	}
}
