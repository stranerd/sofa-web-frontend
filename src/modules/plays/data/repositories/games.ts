import { GameFromModel, GameToModel } from '../models/games'
import { HttpClient, QueryParams, QueryResults } from '@modules/core'
import { IGameRepository } from '@modules/plays/domain/irepositories/games'
import { GameEntity } from '@modules/plays/domain/entities/games'
import { QuestionFromModel } from '@modules/study/data/models/questions'

export class GameRepository implements IGameRepository {
	private static instance: GameRepository
	private client: HttpClient
	private mapper = (model: GameFromModel | null) => (model ? new GameEntity(model) : null) as GameEntity

	private constructor() {
		this.client = new HttpClient('/plays/games')
	}

	static getInstance() {
		if (!GameRepository.instance) GameRepository.instance = new GameRepository()
		return GameRepository.instance
	}

	async get(query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<GameFromModel>>('/', query)

		return {
			...d,
			results: d.results.map((r) => this.mapper(r)),
		}
	}

	async find(id: string) {
		const data = await this.client.get<QueryParams, GameFromModel | null>(`/${id}`, {})
		return this.mapper(data)
	}

	async delete(id: string) {
		return await this.client.delete<unknown, boolean>(`/${id}`, {})
	}

	async create(data: GameToModel) {
		const d = await this.client.post<GameToModel, GameFromModel>('/', data)
		return this.mapper(d)
	}

	async join(id: string, data: { join: boolean }) {
		const d = await this.client.post<typeof data, GameFromModel>(`/${id}/join`, data)
		return this.mapper(d)
	}

	async end(id: string) {
		const d = await this.client.post<QueryParams, GameFromModel>(`/${id}/end`, {})
		return this.mapper(d)
	}

	async start(id: string) {
		const d = await this.client.post<QueryParams, GameFromModel>(`/${id}/start`, {})
		return this.mapper(d)
	}

	async getQuestions(id: string) {
		const d = await this.client.post<QueryParams, QuestionFromModel[]>(`/${id}/questions`, {})
		return d
	}
}
