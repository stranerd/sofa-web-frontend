import { HttpClient, Listeners, QueryParams, QueryResults, listenToMany, listenToOne } from '@modules/core'
import { apiBase } from '@utils/environment'
import { FacultyEntity } from '../../domain/entities/faculties'
import { IFacultyRepository } from '../../domain/irepositories/ifaculties'
import { FacultyFromModel, FacultyToModel } from '../models/faculties'

export class FacultyRepository implements IFacultyRepository {
	private static instance: FacultyRepository
	private client: HttpClient
	private mapper = (model: FacultyFromModel | null) => model ? new FacultyEntity(model) : null

	constructor () {
		this.client = new HttpClient(`${apiBase}/school/faculties`)
	}

	static getInstance () {
		if (!FacultyRepository.instance) FacultyRepository.instance = new FacultyRepository()
		return FacultyRepository.instance
	}

	async add (data: FacultyToModel) {
		const d = await this.client.post<FacultyToModel, FacultyFromModel>('/', data)
		return this.mapper(d)
	}

	async find (id: string) {
		const d = await this.client.get<any, FacultyFromModel>(`/${id}`, {})
		return this.mapper(d)
	}

	async get (query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<FacultyFromModel>>('/', query)
		return {
			...d,
			results: d.results.map(this.mapper)
		}
	}

	async listenToOne (id: string, listeners: Listeners<FacultyEntity>) {
		const model = await this.find(id)
		if (model) await listeners.updated(model)
		return await listenToOne(`${this.client.socketPath}/${id}`, listeners, this.mapper)
	}

	async listenToMany (query: QueryParams, listeners: Listeners<FacultyEntity>, matches: (entity: FacultyEntity) => boolean) {
		const models = await this.get(query)
		await Promise.all(models.results.map(listeners.updated))
		return await listenToMany(this.client.socketPath, listeners, this.mapper, matches)
	}

	async delete (id: string) {
		await this.client.delete<any, boolean>(`/${id}`, {})
	}

	async update (id: string, data: FacultyToModel) {
		const d = await this.client.put<FacultyToModel, FacultyFromModel>(`/${id}`, data)
		return this.mapper(d)
	}
}
