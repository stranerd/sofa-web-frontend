import { QueryParams } from '@modules/core'
import { LessonToModel } from '../../data/models/lessons'
import { ILessonRepository } from '../irepositories/lessons'
import { LessonMembers } from '../types'

export class LessonsUseCase {
	private repository: ILessonRepository

	constructor (repository: ILessonRepository) {
		this.repository = repository
	}

	async add (data: LessonToModel) {
		return await this.repository.add(data)
	}

	async delete (data: { organizationId: string, classId: string, id: string }) {
		return await this.repository.delete(data.organizationId, data.classId, data.id)
	}

	async find (organizationId: string, classId: string, id: string) {
		return await this.repository.find(organizationId, classId, id)
	}

	async get (organizationId: string, classId: string, query: QueryParams) {
		return await this.repository.get(organizationId, classId, query)
	}
}
