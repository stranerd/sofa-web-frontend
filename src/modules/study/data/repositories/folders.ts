import { FolderEntity } from '../../domain/entities/folders'
import { IFolderRepository } from '../../domain/irepositories/ifolders'
import { FolderFromModel, FolderToModel } from '../models/folders'
import { FolderSaved } from '../../domain/types'
import { HttpClient, Listeners, QueryParams, QueryResults, listenToMany, listenToOne } from '@modules/core'

export class FolderRepository implements IFolderRepository {
	private static instance: FolderRepository
	private client: HttpClient
	private mapper = (model: FolderFromModel | null) => (model ? new FolderEntity(model) : null) as FolderEntity

	constructor() {
		this.client = new HttpClient('/study/folders')
	}

	static getInstance() {
		if (!FolderRepository.instance) FolderRepository.instance = new FolderRepository()
		return FolderRepository.instance
	}

	async add(data: FolderToModel) {
		const d = await this.client.post<FolderToModel, FolderFromModel>('/', data)
		return this.mapper(d)
	}

	async find(id: string) {
		const d = await this.client.get<any, FolderFromModel>(`/${id}`, {})
		return this.mapper(d)
	}

	async get(query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<FolderFromModel>>('/', query)
		return {
			...d,
			results: d.results.map(this.mapper),
		}
	}

	async listenToOne(id: string, listeners: Listeners<FolderEntity>) {
		const model = await this.find(id)
		if (model) await listeners.updated(model)
		return await listenToOne(`${this.client.socketPath}/${id}`, listeners, this.mapper)
	}

	async listenToMany(query: QueryParams, listeners: Listeners<FolderEntity>, matches: (entity: FolderEntity) => boolean) {
		const models = await this.get(query)
		await Promise.all(models.results.map(listeners.updated))
		return await listenToMany(this.client.socketPath, listeners, this.mapper, matches)
	}

	async delete(id: string) {
		await this.client.delete<any, boolean>(`/${id}`, {})
	}

	async update(id: string, data: FolderToModel) {
		const d = await this.client.put<FolderToModel, FolderFromModel>(`/${id}`, data)
		return this.mapper(d)
	}

	async updateProp(id: string, data: { type: FolderSaved; add: boolean; values: string[] }) {
		const d = await this.client.put<typeof data, FolderFromModel>(`/${id}/save`, data)
		return this.mapper(d)
	}
}
