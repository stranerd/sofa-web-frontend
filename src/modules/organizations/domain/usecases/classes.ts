import { Listeners, QueryParams } from '@modules/core'
import { ClassEntity } from '../entities/classes'
import { ClassFactory } from '../factories/classes'
import { IClassRepository } from '../irepositories/classes'

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

	async listenToOne(organizationId: string, classId: string, listeners: Listeners<ClassEntity>) {
		return await this.repository(organizationId).listenToOne(classId, listeners)
	}

	async explore() {
		return await this.repository('').get({
			// TODO: add explore query params
			all: true,
		})
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

	async purchase(organizationId: string, classId: string) {
		return await this.repository(organizationId).purchase(classId)
	}

	async cancelPurchase(organizationId: string, classId: string) {
		return await this.repository(organizationId).cancelPurchase(classId)
	}
}
