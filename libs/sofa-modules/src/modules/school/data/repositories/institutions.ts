import { HttpClient, Listeners, QueryParams, QueryResults, listenOnSocket } from '@modules/core'
import { apiBase } from '@utils/environment'
import { InstitutionEntity } from '../../domain/entities/institutions'
import { IInstitutionRepository } from '../../domain/irepositories/iinstitutions'
import { InstitutionFromModel, InstitutionToModel } from '../models/institutions'

export class InstitutionRepository implements IInstitutionRepository {
	private static instance: InstitutionRepository
	private client: HttpClient
	private mapper = (model: InstitutionFromModel | null) => model ? new InstitutionEntity(model) : null

	constructor () {
		this.client = new HttpClient(`${apiBase}/school/institutions`)
	}

	static getInstance () {
		if (!InstitutionRepository.instance) InstitutionRepository.instance = new InstitutionRepository()
		return InstitutionRepository.instance
	}

	async add (data: InstitutionToModel) {
		const d = await this.client.post<InstitutionToModel, InstitutionFromModel>('/', data)
		return this.mapper(d)
	}

	async find (id: string) {
		const d = await this.client.get<any, InstitutionFromModel>(`/${id}`, {})
		return this.mapper(d)
	}

	async get (query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<InstitutionFromModel>>('/', query)
		return {
			...d,
			results: d.results.map(this.mapper)
		}
	}

	async listenToOne (id: string, listeners: Listeners<InstitutionFromModel>) {
		const listener = listenOnSocket(`${this.client.socketPath}/${id}`, listeners)
		const model = await this.find(id)
		if (model) await listeners.updated(model)
		return listener
	}

	async listenToMany (query: QueryParams, listeners: Listeners<InstitutionFromModel>) {
		const listener = listenOnSocket(this.client.socketPath, listeners)
		const models = await this.get(query)
		await Promise.all(models.results.map(listeners.updated))
		return listener
	}

	async delete (id: string) {
		await this.client.delete<any, boolean>(`/${id}`, {})
	}

	async update (id: string, data: InstitutionToModel) {
		const d = await this.client.put<InstitutionToModel, InstitutionFromModel>(`/${id}`, data)
		return this.mapper(d)
	}
}
