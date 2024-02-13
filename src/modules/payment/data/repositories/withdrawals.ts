import { WithdrawalFromModel } from '../models/withdrawals'
import { HttpClient, QueryParams, QueryResults } from '@modules/core'
import { IWithdrawalRepository } from '@modules/payment/domain/irepositories/withdrawals'
import { WithdrawalEntity } from '@modules/payment/domain/entities/withdrawals'

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
}
