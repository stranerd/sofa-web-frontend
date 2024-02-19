import { TestToModel } from '../../data/models/tests'
import { ITestRepository } from '../irepositories/tests'
import { QueryParams } from '@modules/core'

export class TestsUseCase {
	private repository: ITestRepository

	constructor(repository: ITestRepository) {
		this.repository = repository
	}

	async create(data: TestToModel) {
		return await this.repository.create(data)
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

	async end(id: string) {
		return await this.repository.end(id)
	}

	async getQuestions(id: string) {
		return await this.repository.getQuestions(id)
	}
}
