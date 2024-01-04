import { HttpClient, Listeners, QueryParams, QueryResults, listenToMany, listenToOne } from '@modules/core'
import { apiBase } from '@utils/environment'
import { CommentEntity } from '../../domain/entities/comments'
import { ICommentRepository } from '../../domain/irepositories/comments'
import { CommentFromModel, CommentToModel } from '../models/comments'

export class CommentRepository implements ICommentRepository {
	private static instance: CommentRepository
	private client: HttpClient
	private mapper = (model: CommentFromModel | null) => model ? new CommentEntity(model) : null

	constructor () {
		this.client = new HttpClient(`${apiBase}/interactions/comments`)
	}

	static getInstance () {
		if (!CommentRepository.instance) CommentRepository.instance = new CommentRepository()
		return CommentRepository.instance
	}

	async add (data: CommentToModel) {
		const d = await this.client.post<CommentToModel, CommentFromModel>('/', data)
		return this.mapper(d)
	}

	async find (id: string) {
		const d = await this.client.get<any, CommentFromModel>(`/${id}`, {})
		return this.mapper(d)
	}

	async get (query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<CommentFromModel>>('/', query)
		return {
			...d,
			results: d.results.map(this.mapper)
		}
	}

	async listenToOne (id: string, listeners: Listeners<CommentEntity>) {
		const model = await this.find(id)
		if (model) await listeners.updated(model)
		return await listenToOne(`${this.client.socketPath}/${id}`, listeners, this.mapper)
	}

	async listenToMany (query: QueryParams, listeners: Listeners<CommentEntity>, matches: (entity: CommentEntity) => boolean) {
		const models = await this.get(query)
		await Promise.all(models.results.map(listeners.updated))
		return await listenToMany(this.client.socketPath, listeners, this.mapper, matches)
	}

	async delete (id: string) {
		await this.client.delete<any, boolean>(`/${id}`, {})
	}

	async update (id: string, data: CommentToModel) {
		const d = await this.client.put<CommentToModel, CommentFromModel>(`/${id}`, data)
		return this.mapper(d)
	}
}
