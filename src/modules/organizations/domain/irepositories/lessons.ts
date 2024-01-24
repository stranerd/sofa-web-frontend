import { ClassEntity } from '../entities/classes'
import { ClassLesson, LessonToModel } from '../types'

export interface ILessonRepository {
	add: (data: LessonToModel) => Promise<ClassEntity>
	update: (id: string, data: LessonToModel) => Promise<ClassEntity>
	delete: (id: string) => Promise<boolean>
	join: (data: { id: string; join: boolean }) => Promise<ClassEntity>
	manageTeachers: (data: { id: string; userId: string; add: boolean }) => Promise<ClassEntity>
	updateCurriculum: (data: { id: string; curriculum: ClassLesson['curriculum'] }) => Promise<ClassEntity>
}
