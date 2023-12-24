import { HttpClient, Listeners, QueryParams, QueryResults, listenOnSocket } from '@modules/core'
import { apiBase } from '@utils/environment'
import { TagEntity } from '../../domain/entities/tags'
import { ITagRepository } from '../../domain/irepositories/tags'
import { TagFromModel, TagToModel } from '../models/tags'

export class TagRepository implements ITagRepository {
	private static instance: TagRepository
	private client: HttpClient
	private mapper = (model: TagFromModel | null) => model ? new TagEntity(model) : null

	constructor () {
		this.client = new HttpClient(`${apiBase}/interactions/tags`)
	}

	static getInstance () {
		if (!TagRepository.instance) TagRepository.instance = new TagRepository()
		return TagRepository.instance
	}

	async add (data: TagToModel) {
		const d = await this.client.post<TagToModel, TagFromModel>('/', data)
		return this.mapper(d)
	}

	async find (id: string) {
		const d = await this.client.get<any, TagFromModel>(`/${id}`, {})
		return this.mapper(d)
	}

	async get (query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<TagFromModel>>('/', query)
		return {
			...d,
			results: d.results.map(this.mapper)
		}
	}

	async listenToOne (id: string, listeners: Listeners<TagFromModel>) {
		const listener = listenOnSocket(`${this.client.socketPath}/${id}`, listeners)
		const model = await this.find(id)
		if (model) await listeners.updated(model)
		return listener
	}

	async listenToMany (query: QueryParams, listeners: Listeners<TagFromModel>) {
		const listener = listenOnSocket(this.client.socketPath, listeners)
		const models = await this.get(query)
		await Promise.all(models.results.map(listeners.updated))
		return listener
	}

	async delete (id: string) {
		await this.client.delete<any, boolean>(`/${id}`, {})
	}

	async update (id: string, data: TagToModel) {
		const d = await this.client.put<TagToModel, TagFromModel>(`/${id}`, data)
		return this.mapper(d)
	}
}
