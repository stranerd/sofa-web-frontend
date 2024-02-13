import { QuestionToModel } from '../../data/models/questions'
import { QuestionEntity } from '../entities/questions'
import { QuestionFactory } from '../factories/questions'
import { IQuestionRepository } from '../irepositories/iquestions'
import { Conditions, Listeners, QueryParams } from '@modules/core'

export class QuestionsUseCase {
	private repository: (quizId: string) => IQuestionRepository

	constructor(repository: (quizId: string) => IQuestionRepository) {
		this.repository = repository
	}

	async add(quizId: string, data: QuestionToModel) {
		return await this.repository(quizId).add(data)
	}

	async delete(quizId: string, id: string) {
		return await this.repository(quizId).delete(id)
	}

	async update(quizId: string, id: string, factory: QuestionFactory) {
		return await this.repository(quizId).update(id, await factory.toModel())
	}

	async getAllQuestions(quizId: string) {
		const conditions: QueryParams = {
			all: true,
		}

		return await this.repository(quizId).get(conditions)
	}

	async listenToAllQuestions(quizId: string, listener: Listeners<QuestionEntity>) {
		const conditions: QueryParams = {
			all: true,
		}

		return await this.repository(quizId).listenToMany(conditions, listener, () => true)
	}

	async getInList(quizId: string, ids: string[]) {
		const quizzes = await this.repository(quizId).get({
			where: [{ field: 'id', value: ids, condition: Conditions.in }],
			all: true,
		})
		return quizzes.results
	}

	async listenToInList(quizId: string, ids: () => string[], listener: Listeners<QuestionEntity>) {
		return await this.repository(quizId).listenToMany(
			{
				where: [{ field: 'id', value: ids(), condition: Conditions.in }],
				all: true,
			},
			listener,
			(entity) => ids().includes(entity.id),
		)
	}
}
