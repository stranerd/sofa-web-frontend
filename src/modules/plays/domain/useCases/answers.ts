import { AnswerToModel } from '../../data/models/answers'
import { IAnswerRepository } from '../irepositories/answers'
import { QueryParams } from '@modules/core'

export class AnswersUseCase {
	private repository: IAnswerRepository

	constructor(repository: IAnswerRepository) {
		this.repository = repository
	}

	async answer(data: AnswerToModel & { questionId: string; answer: any }) {
		return await this.repository.answer(data)
	}

	async getParticipantsAnswer(id: string, userId: string) {
		return await this.repository.getParticipantsAnswer(id, userId)
	}

	async get(query: QueryParams) {
		return await this.repository.get(query)
	}
}
