import { Listeners, QueryParams } from '@modules/core'
import { QuestionEntity } from '../entities/questions'
import { QuestionFactory } from '../factories/questions'
import { IQuestionRepository } from '../irepositories/iquestions'

export class QuestionsUseCase {
	private repository: (quizId: string) => IQuestionRepository

	constructor(repository: (quizId: string) => IQuestionRepository) {
		this.repository = repository
	}

	async add(quizId: string, factory: QuestionFactory) {
		return await this.repository(quizId).add(await factory.toModel())
	}

	async delete(quizId: string, id: string) {
		return await this.repository(quizId).delete(id)
	}

	async update(quizId: string, id: string, factory: QuestionFactory) {
		return await this.repository(quizId).update(id, await factory.toModel())
	}

	async find(quizId: string, id: string) {
		return await this.repository(quizId).find(id)
	}

	async getAllQuestions(quizId: string) {
		const conditions: QueryParams = {
			all: true,
		}

		return await this.repository(quizId).get(conditions)
	}

	async listenToOne(quizId: string, id: string, listener: Listeners<QuestionEntity>) {
		return await this.repository(quizId).listenToOne(id, listener)
	}

	async listenToAllQuestions(quizId: string, listener: Listeners<QuestionEntity>) {
		const conditions: QueryParams = {
			all: true,
		}

		return await this.repository(quizId).listenToMany(conditions, listener, (entity) => {
			return entity.quizId === quizId
		})
	}
}
