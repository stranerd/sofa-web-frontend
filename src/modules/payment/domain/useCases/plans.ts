import { IPlanRepository } from '../irepositories/plans'
import { PlanEntity } from '../entities/plans'
import { QueryParams, Listeners } from '@modules/core'

export class PlansUseCase {
	repository: IPlanRepository

	constructor(repo: IPlanRepository) {
		this.repository = repo
	}

	async getAll() {
		return await this.repository.get({ all: true })
	}

	async listenToAll(listener: Listeners<PlanEntity>) {
		const conditions: QueryParams = {
			all: true,
		}

		return await this.repository.listenToMany(conditions, listener, () => true)
	}
}
