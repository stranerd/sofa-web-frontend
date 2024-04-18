import { CourseEntity } from '../entities/courses'
import { CourseSectionsFactory } from '../factories/courseSections'
import { CourseFactory } from '../factories/courses'
import { ICourseRepository } from '../irepositories/icourses'
import { DraftStatus } from '../types'
import { Conditions, Listeners, QueryKeys, QueryParams } from '@modules/core'

export class CoursesUseCase {
	private repository: ICourseRepository

	constructor(repository: () => ICourseRepository) {
		this.repository = repository()
	}

	async add(factory: CourseFactory) {
		return await this.repository.add(await factory.toModel())
	}

	async update(id: string, factory: CourseFactory) {
		return await this.repository.update(id, await factory.toModel())
	}

	async publish(id: string) {
		return await this.repository.publish(id)
	}

	async updateSections(id: string, factory: CourseSectionsFactory) {
		return await this.repository.updateSections(id, await factory.toModel())
	}

	async delete(id: string) {
		return await this.repository.delete(id)
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async listenToOne(id: string, listener: Listeners<CourseEntity>) {
		return await this.repository.listenToOne(id, listener)
	}

	async getUserCourses(userId: string) {
		const conditions: QueryParams = {
			where: [{ field: 'user.id', value: userId }],
			all: true,
			sort: [{ field: 'createdAt', desc: true }],
		}

		return await this.repository.get(conditions)
	}

	async getUserPublicCourses(userId: string) {
		const conditions: QueryParams = {
			where: [
				{ field: 'user.id', value: userId },
				{ field: 'status', value: DraftStatus.published },
			],
			whereType: QueryKeys.and,
			all: true,
			sort: [{ field: 'createdAt', desc: true }],
		}

		return await this.repository.get(conditions)
	}

	async listenToUserCourses(userId: string, listener: Listeners<CourseEntity>) {
		const conditions: QueryParams = {
			where: [{ field: 'user.id', value: userId }],
			all: true,
			sort: [{ field: 'createdAt', desc: true }],
		}

		return await this.repository.listenToMany(conditions, listener, (entity) => entity.user.id === userId)
	}

	async listenToUserPublicCourses(userId: string, listener: Listeners<CourseEntity>) {
		const conditions: QueryParams = {
			where: [
				{ field: 'user.id', value: userId },
				{ field: 'status', value: DraftStatus.published },
			],
			whereType: QueryKeys.and,
			all: true,
			sort: [{ field: 'createdAt', desc: true }],
		}

		return await this.repository.listenToMany(conditions, listener, (entity) => entity.user.id === userId && entity.isPublished)
	}

	async getInList(ids: string[]) {
		const courses = await this.repository.get({
			where: [{ field: 'id', value: ids, condition: Conditions.in }],
			all: true,
		})
		return courses.results
	}

	async listenToInList(ids: () => string[], listener: Listeners<CourseEntity>) {
		return await this.repository.listenToMany(
			{
				where: [{ field: 'id', value: ids(), condition: Conditions.in }],
				all: true,
			},
			listener,
			(entity) => ids().includes(entity.id),
		)
	}

	async getWithQuery(query: QueryParams) {
		const result = await this.repository.get(query)
		return result.results
	}
}
