import { IPlanRepository } from '../irepositories/plans'
import { QueryParams } from '@modules/core'

export class PlansUseCase {
	repository: IPlanRepository

	constructor(repo: IPlanRepository) {
		this.repository = repo
	}

	async get(input: QueryParams) {
		return await this.repository.get(input)
	}

	async find(id: string) {
		return await this.repository.find(id)
	}
}
