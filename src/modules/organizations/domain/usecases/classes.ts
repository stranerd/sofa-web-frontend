import { ClassEntity } from '../entities/classes'
import { ClassFactory } from '../factories/classes'
import { IClassRepository } from '../irepositories/classes'
import { UserEntity } from '@modules/users'
import { Conditions, Listeners, QueryKeys, QueryParams } from '@modules/core'
import { SelectedPaymentMethod } from '@modules/payment'

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
				{ field: 'organizationId', value: user.id },
				{ field: 'members.students', value: user.id },
				{ field: 'lessons.users.teachers', value: user.id },
			],
			whereType: QueryKeys.or,
			all: true,
		})
	}

	async listenToMyClassesIn(user: UserEntity, listener: Listeners<ClassEntity>) {
		return await this.repository('').listenToExploreMany(
			{
				where: [
					{ field: 'organizationId', value: user.id },
					{ field: 'members.students', value: user.id },
					{ field: 'lessons.users.teachers', value: user.id },
				],
				whereType: QueryKeys.or,
				all: true,
			},
			listener,
			(entity) =>
				entity.members.students.includes(user.id) ||
				entity.lessons.some((lesson) => lesson.users.teachers.includes(user.id)) ||
				entity.organizationId === user.id,
		)
	}

	async getInList(ids: string[]) {
		const classes = await this.repository('').explore({
			where: [{ field: 'id', value: ids, condition: Conditions.in }],
			all: true,
		})
		return classes.results
	}

	async listenToInList(ids: () => string[], listener: Listeners<ClassEntity>) {
		return await this.repository('').listenToExploreMany(
			{
				where: [{ field: 'id', value: ids(), condition: Conditions.in }],
				all: true,
			},
			listener,
			(entity) => ids().includes(entity.id),
		)
	}

	async getSimilarClasses(organizationId: string, classId: string) {
		return await this.repository(organizationId).similar(classId)
	}

	async purchase(organizationId: string, classId: string, methodId: SelectedPaymentMethod) {
		return await this.repository(organizationId).purchase(classId, methodId)
	}

	async cancelPurchase(organizationId: string, classId: string) {
		return await this.repository(organizationId).cancelPurchase(classId)
	}

	async getAll(date?: number) {
		const query: QueryParams = {
			sort: [{ field: 'createdAt', desc: true }],
			limit: $utils.constants.DEFAULT_PAGINATION_LIMIT,
		}
		if (date) query.where = [{ field: 'createdAt', value: date, condition: Conditions.lt }]
		return await this.repository('').explore(query)
	}

	async listenToAll(listeners: Listeners<ClassEntity>, date?: number) {
		const query: QueryParams = {
			sort: [{ field: 'createdAt', desc: true }],
			all: true,
		}
		if (date) query.where = [{ field: 'createdAt', value: date, condition: Conditions.gte }]
		return await this.repository('').listenToExploreMany(query, listeners, (entity) =>
			[date ? entity.createdAt >= date : true].every(Boolean),
		)
	}
}
