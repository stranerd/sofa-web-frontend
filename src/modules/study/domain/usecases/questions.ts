import { QuestionToModel } from '../../data/models/questions'
import { QuestionEntity } from '../entities/questions'
import { QuestionFactory } from '../factories/questions'
import { IQuestionRepository } from '../irepositories/iquestions'
import { CoursableAccess, CreateAiQuestionsData } from '../types'
import { Conditions, Listeners } from '@modules/core'

export class QuestionsUseCase {
	private repository: (quizId: string) => IQuestionRepository

	constructor(repository: (quizId: string) => IQuestionRepository) {
		this.repository = repository
	}

	async add(quizId: string, data: QuestionToModel) {
		return await this.repository(quizId).add(data)
	}

	async aiAdd(quizId: string, data: CreateAiQuestionsData) {
		return await this.repository(quizId).aiAdd(data)
	}

	async delete(quizId: string, id: string) {
		return await this.repository(quizId).delete(id)
	}

	async update(quizId: string, id: string, factory: QuestionFactory) {
		return await this.repository(quizId).update(id, await factory.toModel())
	}

	async getAll(quizId: string, access?: CoursableAccess['access']) {
		return await this.repository(quizId).get({
			all: true,
			access,
		})
	}

	async getInList(quizId: string, ids: string[], access: CoursableAccess['access']) {
		const quizzes = await this.repository(quizId).get({
			where: [{ field: 'id', value: ids, condition: Conditions.in }],
			all: true,
			access,
		})
		return quizzes.results
	}

	async listenToInList(quizId: string, ids: () => string[], listener: Listeners<QuestionEntity>, access: CoursableAccess['access']) {
		return await this.repository(quizId).listenToMany(
			{
				where: [{ field: 'id', value: ids(), condition: Conditions.in }],
				all: true,
				access,
			},
			listener,
			(entity) => ids().includes(entity.id),
		)
	}
}
