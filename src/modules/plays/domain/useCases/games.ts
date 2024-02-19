import { GameToModel } from '../../data/models/games'
import { IGameRepository } from '../irepositories/games'
import { QueryParams } from '@modules/core'

export class GamesUseCase {
	private repository: IGameRepository

	constructor(repository: IGameRepository) {
		this.repository = repository
	}

	async create(data: GameToModel) {
		return await this.repository.create(data)
	}

	async delete(id: string) {
		return await this.repository.delete(id)
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async get(query: QueryParams) {
		return await this.repository.get(query)
	}

	async start(id: string) {
		return await this.repository.start(id)
	}

	async join(id: string, data: { join: boolean }) {
		return await this.repository.join(id, data)
	}

	async end(id: string) {
		return await this.repository.end(id)
	}

	async getQuestions(id: string) {
		return await this.repository.getQuestions(id)
	}
}
