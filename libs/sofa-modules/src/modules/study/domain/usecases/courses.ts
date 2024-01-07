import { Listeners } from '@modules/core'
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
}
