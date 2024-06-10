import { TutorRequestEntity } from '../entities/tutorRequests'
import { TutorRequestFactory } from '../factories/tutorRequests'
import { ITutorRequestRepository } from '../irepositories/itutorRequests'
import { AcceptTutorRequestInput } from '../types'
import { Conditions, Listeners, QueryParams } from '@modules/core'

export class TutorRequestsUseCase {
	private repository: ITutorRequestRepository

	constructor(repository: () => ITutorRequestRepository) {
		this.repository = repository()
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async listenToOne(id: string, listeners: Listeners<TutorRequestEntity>) {
		return await this.repository.listenToOne(id, listeners)
	}

	async getMine(userId: string) {
		return await this.repository.get({
			where: [{ field: 'userId', value: userId }],
			sort: [{ field: 'createdAt', desc: true }],
			all: true,
		})
	}

	async listenToMine(userId: string, listeners: Listeners<TutorRequestEntity>) {
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

	async create(factory: TutorRequestFactory) {
		return await this.repository.create(await factory.toModel())
	}

	async get(date?: number) {
		const query: QueryParams = {
			where: [{ field: 'pending', value: true }],
			sort: [{ field: 'createdAt', desc: true }],
			limit: $utils.constants.DEFAULT_PAGINATION_LIMIT,
		}
		if (date) query.where!.push({ field: 'createdAt', value: date, condition: Conditions.lt })
		return await this.repository.get(query)
	}

	async listen(listeners: Listeners<TutorRequestEntity>, date?: number) {
		const query: QueryParams = {
			where: [{ field: 'pending', value: true }],
			sort: [{ field: 'createdAt', desc: true }],
			limit: $utils.constants.DEFAULT_PAGINATION_LIMIT,
		}
		if (date) query.where!.push({ field: 'createdAt', value: date, condition: Conditions.gte })
		return await this.repository.listenToMany(query, listeners, (entity) =>
			[entity.pending, date ? entity.createdAt >= date : true].every(Boolean),
		)
	}

	async accept(id: string, data: AcceptTutorRequestInput) {
		return await this.repository.accept(id, data)
	}
}
