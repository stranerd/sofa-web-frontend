import { AnswerToModel } from '../../data/models/answers'
import { IAnswerRepository } from '../irepositories/answers'
import { PlayTypes } from '../types'

export class AnswersUseCase {
	private repository: (type: PlayTypes, typeId: string) => IAnswerRepository

	constructor(repository: (type: PlayTypes, typeId: string) => IAnswerRepository) {
		this.repository = repository
	}

	async answer(type: PlayTypes, typeId: string, data: AnswerToModel) {
		return await this.repository(type, typeId).answer(data)
	}

	async getForUser(type: PlayTypes, typeId: string, userId: string) {
		const answers = await this.repository(type, typeId).get({ where: [{ field: 'user.id', value: userId }] })
		return answers.results.at(0) ?? null
	}

	async end(type: PlayTypes, typeId: string) {
		return await this.repository(type, typeId).end()
	}
}
