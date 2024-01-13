import { HttpClient, Listeners, QueryParams, QueryResults, listenToMany, listenToOne } from '@modules/core'
import { FileEntity } from '../../domain/entities/files'
import { IFileRepository } from '../../domain/irepositories/ifiles'
import { FileFromModel, FileToModel } from '../models/files'

export class FileRepository implements IFileRepository {
	private static instance: FileRepository
	private client: HttpClient
	private mapper = (model: FileFromModel | null) => (model ? new FileEntity(model) : null)

	constructor() {
		this.client = new HttpClient('/study/files')
	}

	static getInstance() {
		if (!FileRepository.instance) FileRepository.instance = new FileRepository()
		return FileRepository.instance
	}

	async add(data: FileToModel) {
		const d = await this.client.post<FileToModel, FileFromModel>('/', data)
		return this.mapper(d)
	}

	async find(id: string) {
		const d = await this.client.get<any, FileFromModel>(`/${id}`, {})
		return this.mapper(d)
	}

	async get(query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<FileFromModel>>('/', query)
		return {
			...d,
			results: d.results.map(this.mapper),
		}
	}

	async listenToOne(id: string, listeners: Listeners<FileEntity>) {
		const model = await this.find(id)
		if (model) await listeners.updated(model)
		return await listenToOne(`${this.client.socketPath}/${id}`, listeners, this.mapper)
	}

	async listenToMany(query: QueryParams, listeners: Listeners<FileEntity>, matches: (entity: FileEntity) => boolean) {
		const models = await this.get(query)
		await Promise.all(models.results.map(listeners.updated))
		return await listenToMany(this.client.socketPath, listeners, this.mapper, matches)
	}

	async delete(id: string) {
		await this.client.delete<any, boolean>(`/${id}`, {})
	}

	async update(id: string, data: FileToModel) {
		const d = await this.client.put<FileToModel, FileFromModel>(`/${id}`, data)
		return this.mapper(d)
	}

	async publish(id: string) {
		const d = await this.client.post<any, FileFromModel>(`/${id}/publish`, {})
		return this.mapper(d)
	}
}
