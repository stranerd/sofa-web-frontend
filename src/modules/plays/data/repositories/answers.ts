import { AnswerEntity } from '../../domain/entities/answers'
import { IAnswerRepository } from '../../domain/irepositories/answers'
import { PlayTypes } from '../../domain/types'
import { AnswerFromModel, AnswerToModel } from '../models/answers'
import { HttpClient, QueryParams, QueryResults } from '@modules/core'

export class AnswerRepository implements IAnswerRepository {
	private static instance: AnswerRepository
	private client: HttpClient
	private mapper = (model: AnswerFromModel | null) => (model ? new AnswerEntity(model) : null) as AnswerEntity

	private constructor(type: PlayTypes, typeId: string) {
		this.client = new HttpClient(`/plays/${type}/${typeId}/answers`)
	}

	static getInstance(type: PlayTypes, typeId: string) {
		if (!AnswerRepository.instance) AnswerRepository.instance = new AnswerRepository(type, typeId)
		return AnswerRepository.instance
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
}
