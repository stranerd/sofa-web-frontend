import { AnswerFromModel, AnswerToModel } from '../models/answers'
import { HttpClient, QueryParams, QueryResults } from '@modules/core'
import { AnswerEntity } from '@modules/plays/domain/entities/answers'
import { IAnswerRepository } from '@modules/plays/domain/irepositories/answers'

export class AnswerRepository implements IAnswerRepository {
	private static instance: AnswerRepository
	private client: HttpClient
	private mapper = (model: AnswerFromModel | null) => (model ? new AnswerEntity(model) : null) as AnswerEntity

	private constructor() {
		this.client = new HttpClient('/play/games')
	}

	static getInstance() {
		if (!AnswerRepository.instance) AnswerRepository.instance = new AnswerRepository()
		return AnswerRepository.instance
	}

	async get(query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<AnswerFromModel>>('/', query)

		return {
			...d,
			results: d.results.map((r) => this.mapper(r)),
		}
	}

	async getParticipantsAnswer(id: string, userId: string) {
		const data = await this.client.get<QueryParams, AnswerFromModel | null>(`/${id}/answers/${userId}`, {})
		return this.mapper(data)
	}

	async answer(data: AnswerToModel & { questionId: string; answer: any }) {
		const d = await this.client.post<AnswerToModel, AnswerFromModel>(`/`, data)
		return this.mapper(d)
	}
}
