import { MethodFromModel } from '../models/methods'
import { HttpClient, QueryParams, QueryResults } from '@modules/core'
import { IMethodRepository } from '@modules/payment/domain/irepositories/methods'
import { MethodEntity } from '@modules/payment/domain/entities/methods'

export class MethodRepository implements IMethodRepository {
	private static instance: MethodRepository
	private client: HttpClient
	private mapper = (model: MethodFromModel | null) => (model ? new MethodEntity(model) : null) as MethodEntity

	private constructor() {
		this.client = new HttpClient('payments/methods')
	}

	static getInstance() {
		if (!MethodRepository.instance) MethodRepository.instance = new MethodRepository()
		return MethodRepository.instance
	}

	async get(query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<MethodFromModel>>('/', query)

		return {
			...d,
			results: d.results.map((r) => this.mapper(r)),
		}
	}

	async find(id: string) {
		const data = await this.client.get<QueryParams, MethodFromModel | null>(`/${id}`, {})
		return this.mapper(data)
	}

	async makePrimary(id: string) {
		return await this.client.post<QueryParams, MethodEntity | null>(`/${id}/primary`, {})
	}
	async delete(id: string) {
		return await this.client.delete<unknown, boolean>(`/${id}`, {})
	}
}
