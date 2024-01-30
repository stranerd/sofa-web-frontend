import { CourseEntity } from '../../domain/entities/courses'
import { QuizEntity } from '../../domain/entities/quizzes'
import { IStudyRepository } from '../../domain/irepositories/istudy'
import { StudyKeys } from '../../domain/types'
import { CourseFromModel } from '../models/courses'
import { QuizFromModel } from '../models/quizzes'
import { HttpClient } from '@modules/core'

export class StudyRepository implements IStudyRepository {
	private static instance: StudyRepository
	private client: HttpClient
	private mapper = (model: CourseFromModel | QuizFromModel) =>
		model.__type === 'CourseEntity' ? new CourseEntity(model) : new QuizEntity(model)

	constructor() {
		this.client = new HttpClient('/study/my')
	}

	static getInstance() {
		if (!StudyRepository.instance) StudyRepository.instance = new StudyRepository()
		return StudyRepository.instance
	}

	async get(key: StudyKeys) {
		const d = await this.client.get<any, (CourseFromModel | QuizFromModel)[]>(`/${key}`, {})
		return d.map(this.mapper)
	}
}
