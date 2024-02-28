import { PlayEntity } from '../../domain/entities/plays'
import { IPlayRepository } from '../../domain/irepositories/plays'
import { PlayFromModel, PlayToModel } from '../models/plays'
import { CoursableAccess, QuestionEntity, QuestionFromModel } from '@modules/study'
import { HttpClient, Listeners, QueryParams, QueryResults, listenToMany, listenToOne } from '@modules/core'

export class PlayRepository implements IPlayRepository {
	private static instance: PlayRepository
	protected client: HttpClient
	protected mapper = (model: PlayFromModel | null) => (model ? new PlayEntity(model) : null) as PlayEntity

	constructor() {
		this.client = new HttpClient('/plays/plays')
	}

	static getInstance() {
		if (!PlayRepository.instance) PlayRepository.instance = new PlayRepository()
		return PlayRepository.instance
	}

	async get(query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<PlayFromModel>>('/', query)

		return {
			...d,
			results: d.results.map((r) => this.mapper(r)),
		}
	}

	async find(id: string) {
		const data = await this.client.get<QueryParams, PlayFromModel | null>(`/${id}`, {})
		return this.mapper(data)
	}

	async delete(id: string) {
		return await this.client.delete<unknown, boolean>(`/${id}`, {})
	}

	async create(data: PlayToModel, access: CoursableAccess['access']) {
		const d = await this.client.post<PlayToModel, PlayFromModel>('/', data, { access })
		return this.mapper(d)
	}

	async end(id: string) {
		const d = await this.client.post<QueryParams, PlayFromModel>(`/${id}/end`, {})
		return this.mapper(d)
	}

	async start(id: string) {
		const d = await this.client.post<QueryParams, PlayFromModel>(`/${id}/start`, {})
		return this.mapper(d)
	}

	async getQuestions(id: string) {
		const d = await this.client.get<QueryParams, QuestionFromModel[]>(`/${id}/questions`, {})
		return d.map((q) => new QuestionEntity(q))
	}

	async listenToOne(id: string, listeners: Listeners<PlayEntity>) {
		const model = await this.find(id)
		if (model) await listeners.updated(model)
		return await listenToOne(`${this.client.socketPath}/${id}`, listeners, this.mapper)
	}

	async listenToMany(query: QueryParams, listeners: Listeners<PlayEntity>, matches: (entity: PlayEntity) => boolean) {
		const models = await this.get(query)
		await Promise.all(models.results.map(listeners.updated))
		return await listenToMany(this.client.socketPath, listeners, this.mapper, matches)
	}

	async join(id: string, data: { join: boolean }) {
		const d = await this.client.post<typeof data, PlayFromModel>(`/${id}/join`, data)
		return this.mapper(d)
	}
}
