import { HttpClient } from '@modules/core'
import { ClassEntity } from '../../domain/entities/classes'
import { ILessonRepository } from '../../domain/irepositories/lessons'
import { LessonToModel } from '../../domain/types'
import { ClassFromModel } from '../models/classes'

export class LessonRepository implements ILessonRepository {
	private static instances: Record<string, LessonRepository> = {}
	private client: HttpClient
	private mapper = (model: ClassFromModel | null) => (model ? new ClassEntity(model) : null) as ClassEntity

	private constructor(organizationId: string, classId: string) {
		this.client = new HttpClient(`/organizations/${organizationId}/classes/${classId}/lessons`)
	}

	static getInstance(organizationId: string, classId: string) {
		return (LessonRepository.instances[`${organizationId}-${classId}`] ??= new LessonRepository(organizationId, classId))
	}

	async add(data: LessonToModel) {
		const d = await this.client.post<LessonToModel, ClassFromModel>('/', data)
		return this.mapper(d)
	}

	async update(id: string, data: LessonToModel) {
		const d = await this.client.put<LessonToModel, ClassFromModel>(`/${id}`, data)
		return this.mapper(d)
	}

	async delete(id: string) {
		return await this.client.delete<unknown, boolean>(`/${id}`, {})
	}

	async join(data: { id: string; join: boolean }) {
		const d = await this.client.post<{ join: boolean }, ClassFromModel>(`/${data.id}/members/join`, {
			join: data.join,
		})
		return this.mapper(d)
	}

	async manageTeachers(data: { id: string; userId: string; add: boolean }) {
		const d = await this.client.post<{ userId: string; add: boolean }, ClassFromModel>(`/${data.id}/members/teachers`, {
			userId: data.userId,
			add: data.add,
		})
		return this.mapper(d)
	}
}
