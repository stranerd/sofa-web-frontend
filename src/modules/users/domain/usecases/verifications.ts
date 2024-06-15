import { VerificationEntity } from '../entities/verifications'
import { VerificationFactory } from '../factories/verifications'
import { IVerificationRepository } from '../irepositories/iverifications'
import { AcceptVerificationInput } from '../types'
import { Conditions, Listeners, QueryParams } from '@modules/core'

export class VerificationsUseCase {
	private repository: IVerificationRepository

	constructor(repository: () => IVerificationRepository) {
		this.repository = repository()
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async getMine(userId: string) {
		return await this.repository.get({
			where: [{ field: 'userId', value: userId }],
			sort: [{ field: 'createdAt', desc: true }],
			all: true,
		})
	}

	async listenToMine(userId: string, listeners: Listeners<VerificationEntity>) {
		return await this.repository.listenToMany(
			{
				where: [{ field: 'userId', value: userId }],
				sort: [{ field: 'createdAt', desc: true }],
				all: true,
			},
			listeners,
			(entity) => entity.userId === userId,
		)
	}

	async listenToOne(id: string, listeners: Listeners<VerificationEntity>) {
		return await this.repository.listenToOne(id, listeners)
	}

	async create(factory: VerificationFactory) {
		return await this.repository.create(await factory.toModel())
	}

	async get(date?: number) {
		const query: QueryParams = {
			sort: [{ field: 'createdAt', desc: true }],
			limit: $utils.constants.DEFAULT_PAGINATION_LIMIT,
		}
		if (date) query.where!.push({ field: 'createdAt', value: date, condition: Conditions.lt })
		return await this.repository.get(query)
	}

	async listen(listeners: Listeners<VerificationEntity>, date?: number) {
		const query: QueryParams = {
			sort: [{ field: 'createdAt', desc: true }],
			all: true,
		}
		if (date) query.where!.push({ field: 'createdAt', value: date, condition: Conditions.gte })
		return await this.repository.listenToMany(query, listeners, (entity) => [date ? entity.createdAt >= date : true].every(Boolean))
	}

	async accept(id: string, data: AcceptVerificationInput) {
		return await this.repository.accept(id, data)
	}
}
