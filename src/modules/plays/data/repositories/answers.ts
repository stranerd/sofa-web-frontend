import { AnswerEntity } from '../../domain/entities/answers'
import { IAnswerRepository } from '../../domain/irepositories/answers'
import { PlayTypes } from '../../domain/types'
import { AnswerFromModel, AnswerToModel } from '../models/answers'
import { HttpClient, Listeners, QueryParams, QueryResults, listenToMany, listenToOne } from '@modules/core'

export class AnswerRepository implements IAnswerRepository {
	private static instances: Record<string, AnswerRepository> = {}
	private client: HttpClient
	private mapper = (model: AnswerFromModel | null) => (model ? new AnswerEntity(model) : null) as AnswerEntity

	private constructor(type: PlayTypes, typeId: string) {
		this.client = new HttpClient(`/plays/${type}/${typeId}/answers`)
	}

	static getInstance(type: PlayTypes, typeId: string) {
		return (AnswerRepository.instances[`${type}-${typeId}`] ??= new AnswerRepository(type, typeId))
	}

	async get(query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<AnswerFromModel>>('/', query)

		return {
			...d,
			results: d.results.map((r) => this.mapper(r)),
		}
	}

	async find(id: string) {
		const data = await this.client.get<QueryParams, AnswerFromModel | null>(`/${id}`, {})
		return this.mapper(data)
	}

	async answer(data: AnswerToModel & { questionId: string; answer: any }) {
		const d = await this.client.post<AnswerToModel, AnswerFromModel>(`/`, data)
		return this.mapper(d)
	}

	async end() {
		const d = await this.client.post<any, AnswerFromModel | null>('/end', {})
		return this.mapper(d)
	}

	async reset() {
		const d = await this.client.post<any, AnswerFromModel | null>('/reset', {})
		return this.mapper(d)
	}

	async listenToOne(id: string, listeners: Listeners<AnswerEntity>) {
		const model = await this.find(id)
		if (model) await listeners.updated(model)
		return await listenToOne(`${this.client.socketPath}/${id}`, listeners, this.mapper)
	}

	async listenToMany(query: QueryParams, listeners: Listeners<AnswerEntity>, matches: (entity: AnswerEntity) => boolean) {
		const models = await this.get(query)
		await Promise.all(models.results.map(listeners.updated))
		return await listenToMany(this.client.socketPath, listeners, this.mapper, matches)
	}
}
