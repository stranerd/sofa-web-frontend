import { HttpClient, Listeners, QueryParams, QueryResults, listenToMany, listenToOne } from '@modules/core'
import { apiBase } from '@utils/environment'
import { DepartmentEntity } from '../../domain/entities/departments'
import { IDepartmentRepository } from '../../domain/irepositories/idepartments'
import { DepartmentFromModel, DepartmentToModel } from '../models/departments'

export class DepartmentRepository implements IDepartmentRepository {
	private static instance: DepartmentRepository
	private client: HttpClient
	private mapper = (model: DepartmentFromModel | null) => model ? new DepartmentEntity(model) : null

	constructor () {
		this.client = new HttpClient(`${apiBase}/school/departments`)
	}

	static getInstance () {
		if (!DepartmentRepository.instance) DepartmentRepository.instance = new DepartmentRepository()
		return DepartmentRepository.instance
	}

	async add (data: DepartmentToModel) {
		const d = await this.client.post<DepartmentToModel, DepartmentFromModel>('/', data)
		return this.mapper(d)
	}

	async find (id: string) {
		const d = await this.client.get<any, DepartmentFromModel>(`/${id}`, {})
		return this.mapper(d)
	}

	async get (query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<DepartmentFromModel>>('/', query)
		return {
			...d,
			results: d.results.map(this.mapper)
		}
	}

	async listenToOne (id: string, listeners: Listeners<DepartmentEntity>) {
		const model = await this.find(id)
		if (model) await listeners.updated(model)
		return await listenToOne(`${this.client.socketPath}/${id}`, listeners, this.mapper)
	}

	async listenToMany (query: QueryParams, listeners: Listeners<DepartmentEntity>, matches: (entity: DepartmentEntity) => boolean) {
		const models = await this.get(query)
		await Promise.all(models.results.map(listeners.updated))
		return await listenToMany(this.client.socketPath, listeners, this.mapper, matches)
	}

	async delete (id: string) {
		await this.client.delete<any, boolean>(`/${id}`, {})
	}

	async update (id: string, data: DepartmentToModel) {
		const d = await this.client.put<DepartmentToModel, DepartmentFromModel>(`/${id}`, data)
		return this.mapper(d)
	}
}
