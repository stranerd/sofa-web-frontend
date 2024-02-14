import { PurchaseEntity } from '../entities/purchases'
import { IPurchaseRepository } from '../irepositories/purchases'
import { Listeners, QueryParams } from '@modules/core'

export class PurchasesUseCase {
	repository: IPurchaseRepository

	constructor(repo: IPurchaseRepository) {
		this.repository = repo
	}

	async getMine(userId: string) {
		return await this.repository.get({
			where: [{ field: 'userId', value: userId }],
			all: true,
		})
	}

	async listenToMine(userId: string, listeners: Listeners<PurchaseEntity>) {
		const conditions: QueryParams = {
			where: [{ field: 'userId', value: userId }],
			all: true,
		}
		return await this.repository.listenToMany(conditions, listeners, (e) => e.userId === userId)
	}
}
