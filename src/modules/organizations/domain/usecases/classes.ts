import { ClassEntity } from '../entities/classes'
import { ClassFactory } from '../factories/classes'
import { IClassRepository } from '../irepositories/classes'
import { UserEntity } from '@modules/users'
import { Conditions, Listeners, QueryKeys, QueryParams } from '@modules/core'

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

	async explore(search: string) {
		return await this.repository('').explore({
			// TODO: add explore query params
			...(search
				? {
						search: {
							value: search,
							fields: ['title', 'description', 'lessons.title'],
						},
					}
				: {}),
			all: true,
		})
	}

	async getMyClassesIn(user: UserEntity) {
		return await this.repository('').explore({
			where: [
				{ field: 'organizationId', condition: Conditions.in, value: user.myOrgsIn },
				{ field: 'members.students', value: user.id },
				{ field: 'lessons.users.students', value: user.id },
				{ field: 'lessons.users.teachers', value: user.id },
			],
			whereType: QueryKeys.or,
			all: true,
		})
	}

	async getInList(ids: string[]) {
		const classes = await this.repository('').explore({
			where: [{ field: 'id', value: ids, condition: Conditions.in }],
			all: true,
		})
		return classes.results
	}

	async getAll(organizationId: string) {
		return await this.repository(organizationId).get({
			all: true,
		})
	}

	async getSimilarClasses(organizationId: string, classId: string) {
		return await this.repository(organizationId).similar(classId)
	}

	async listenToAll(organizationId: string, listener: Listeners<ClassEntity>) {
		const conditions: QueryParams = {
			all: true,
		}

		return await this.repository(organizationId).listenToMany(conditions, listener, () => true)
	}

	async purchase(organizationId: string, classId: string, methodId: string | null) {
		return await this.repository(organizationId).purchase(classId, methodId)
	}

	async cancelPurchase(organizationId: string, classId: string) {
		return await this.repository(organizationId).cancelPurchase(classId)
	}
}
