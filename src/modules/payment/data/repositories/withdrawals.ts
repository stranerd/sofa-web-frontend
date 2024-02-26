import { WithdrawalEntity } from '../../domain/entities/withdrawals'
import { IWithdrawalRepository } from '../../domain/irepositories/withdrawals'
import { WithdrawalFromModel } from '../models/withdrawals'
import { HttpClient, Listeners, QueryParams, QueryResults, listenToMany, listenToOne } from '@modules/core'

export class WithdrawalRepository implements IWithdrawalRepository {
	private static instance: WithdrawalRepository
	private client: HttpClient
	private mapper = (model: WithdrawalFromModel | null) => (model ? new WithdrawalEntity(model) : null) as WithdrawalEntity

	private constructor() {
		this.client = new HttpClient('/payment/withdrawals')
	}

	static getInstance() {
		if (!WithdrawalRepository.instance) WithdrawalRepository.instance = new WithdrawalRepository()
		return WithdrawalRepository.instance
	}

	async get(query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<WithdrawalFromModel>>('/', query)

		return {
			...d,
			results: d.results.map((r) => this.mapper(r)),
		}
	}

	async find(id: string) {
		const data = await this.client.get<QueryParams, WithdrawalFromModel | null>(`/${id}`, {})
		return this.mapper(data)
	}

	async listenToOne(id: string, listeners: Listeners<WithdrawalEntity>) {
		const model = await this.find(id)
		if (model) await listeners.updated(model)
		return await listenToOne(`${this.client.socketPath}/${id}`, listeners, this.mapper)
	}

	async listenToMany(query: QueryParams, listeners: Listeners<WithdrawalEntity>, matches: (entity: WithdrawalEntity) => boolean) {
		const models = await this.get(query)
		await Promise.all(models.results.map(listeners.updated))
		return await listenToMany(this.client.socketPath, listeners, this.mapper, matches)
	}
}
