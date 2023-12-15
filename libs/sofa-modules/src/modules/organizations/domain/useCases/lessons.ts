import { QueryParams } from '@modules/core'
import { LessonToModel } from '../../data/models/lessons'
import { ILessonRepository } from '../irepositories/lessons'

export class LessonsUseCase {
	private repository: (organizationId: string, classId: string) => ILessonRepository

	constructor (repository: (organizationId: string, classId: string) => ILessonRepository) {
		this.repository = repository
	}

	async add (data: LessonToModel) {
		return await this.repository(data.organizationId, data.classId).add(data)
	}

	async delete (data: { organizationId: string, classId: string, id: string }) {
		return await this.repository(data.organizationId, data.classId).delete(data.id)
	}

	async find (organizationId: string, classId: string, id: string) {
		return await this.repository(organizationId, classId).find(id)
	}

	async get (organizationId: string, classId: string, query: QueryParams) {
		return await this.repository(organizationId, classId).get(query)
	}
}
