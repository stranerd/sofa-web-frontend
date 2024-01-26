import { LessonCurriculumFactory } from '../factories/lessonCurriculums'
import { LessonFactory } from '../factories/lessons'
import { ILessonRepository } from '../irepositories/lessons'

export class LessonsUseCase {
	private repository: (organizationId: string, classId: string) => ILessonRepository

	constructor(repository: (organizationId: string, classId: string) => ILessonRepository) {
		this.repository = repository
	}

	async add(organizationId: string, classId: string, factory: LessonFactory) {
		return await this.repository(organizationId, classId).add(await factory.toModel())
	}

	async update(organizationId: string, classId: string, id: string, factory: LessonFactory) {
		return await this.repository(organizationId, classId).update(id, await factory.toModel())
	}

	async delete(data: { organizationId: string; classId: string; id: string }) {
		return await this.repository(data.organizationId, data.classId).delete(data.id)
	}

	async join(organizationId: string, classId: string, id: string, join: boolean) {
		return await this.repository(organizationId, classId).join({ id, join })
	}

	async manageTeachers(organizationId: string, classId: string, id: string, userId: string, add: boolean) {
		return await this.repository(organizationId, classId).manageTeachers({ id, userId, add })
	}

	async updateCurriculum(organizationId: string, classId: string, id: string, factories: LessonCurriculumFactory[]) {
		const curriculum = await Promise.all(factories.map((factory) => factory.toModel()))
		return await this.repository(organizationId, classId).updateCurriculum({ id, curriculum })
	}
}
