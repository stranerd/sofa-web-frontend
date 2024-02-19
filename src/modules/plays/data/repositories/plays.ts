import { PlayFromModel, PlayToModel } from '../models/plays'
import { PlayTypes } from '../../domain/types'
import { IPlayRepository } from '../../domain/irepositories/plays'
import { PlayEntity } from '../../domain/entities/plays'
import { HttpClient, QueryParams, QueryResults } from '@modules/core'
import { QuestionEntity, QuestionFromModel } from '@modules/study'

export class PlayRepository<E extends PlayEntity, F extends PlayFromModel, T extends PlayToModel> implements IPlayRepository<E, T> {
	protected client: HttpClient
	protected mapper: (model: F | null) => E

	constructor(type: PlayTypes, mapper: (model: F | null) => E) {
		this.client = new HttpClient(`/plays/${type}`)
		this.mapper = mapper
	}

	async get(query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<F>>('/', query)

		return {
			...d,
			results: d.results.map((r) => this.mapper(r)),
		}
	}

	async find(id: string) {
		const data = await this.client.get<QueryParams, F | null>(`/${id}`, {})
		return this.mapper(data)
	}

	async delete(id: string) {
		return await this.client.delete<unknown, boolean>(`/${id}`, {})
	}

	async create(data: T) {
		const d = await this.client.post<T, F>('/', data)
		return this.mapper(d)
	}

	async end(id: string) {
		const d = await this.client.post<QueryParams, F>(`/${id}/end`, {})
		return this.mapper(d)
	}

	async start(id: string) {
		const d = await this.client.post<QueryParams, F>(`/${id}/start`, {})
		return this.mapper(d)
	}

	async getQuestions(id: string) {
		const d = await this.client.post<QueryParams, QuestionFromModel[]>(`/${id}/questions`, {})
		return d.map((q) => new QuestionEntity(q))
	}
}
