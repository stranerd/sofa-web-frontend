import { Conditions, Listeners, QueryParams } from '@modules/core'
import { CourseEntity } from '../entities/courses'
import { ICourseRepository } from '../irepositories/icourses'

export class CoursesUseCase {
	private repository: ICourseRepository

	constructor(repository: () => ICourseRepository) {
		this.repository = repository()
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
		}

		return await this.repository.get(conditions)
	}

	async listenToUserCourses(userId: string, listener: Listeners<CourseEntity>) {
		const conditions: QueryParams = {
			where: [{ field: 'user.id', value: userId }],
			all: true,
		}

		return await this.repository.listenToMany(conditions, listener, (entity) => {
			return entity.user.id === userId
		})
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
}
