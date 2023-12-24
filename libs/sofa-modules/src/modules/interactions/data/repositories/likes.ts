import { HttpClient, Listeners, QueryParams, QueryResults, listenOnSocket } from '@modules/core'
import { apiBase } from '@utils/environment'
import { LikeEntity } from '../../domain/entities/likes'
import { ILikeRepository } from '../../domain/irepositories/likes'
import { LikeFromModel, LikeToModel } from '../models/likes'

export class LikeRepository implements ILikeRepository {
	private static instance: LikeRepository
	private client: HttpClient
	private mapper = (model: LikeFromModel | null) => model ? new LikeEntity(model) : null

	constructor () {
		this.client = new HttpClient(`${apiBase}/interactions/likes`)
	}

	static getInstance () {
		if (!LikeRepository.instance) LikeRepository.instance = new LikeRepository()
		return LikeRepository.instance
	}

	async add (data: LikeToModel) {
		const d = await this.client.post<LikeToModel, LikeFromModel>('/', data)
		return this.mapper(d)
	}

	async find (id: string) {
		const d = await this.client.get<any, LikeFromModel>(`/${id}`, {})
		return this.mapper(d)
	}

	async get (query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<LikeFromModel>>('/', query)
		return {
			...d,
			results: d.results.map(this.mapper)
		}
	}

	async listenToOne (id: string, listeners: Listeners<LikeFromModel>) {
		const listener = listenOnSocket(`${this.client.socketPath}/${id}`, listeners)
		const model = await this.find(id)
		if (model) await listeners.updated(model)
		return listener
	}

	async listenToMany (query: QueryParams, listeners: Listeners<LikeFromModel>) {
		const listener = listenOnSocket(this.client.socketPath, listeners)
		const models = await this.get(query)
		await Promise.all(models.results.map(listeners.updated))
		return listener
	}
}
