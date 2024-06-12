import { VerificationEntity } from '../../domain/entities/verifications'
import { IVerificationRepository } from '../../domain/irepositories/iverifications'
import { AcceptVerificationInput } from '../../domain/types'
import { VerificationFromModel, VerificationToModel } from '../models/verifications'
import { HttpClient, Listeners, QueryParams, QueryResults, listenToMany, listenToOne } from '@modules/core'

export class VerificationRepository implements IVerificationRepository {
	private static instance: VerificationRepository
	private client: HttpClient
	private mapper = (model: VerificationFromModel | null) => (model ? new VerificationEntity(model) : null) as VerificationEntity

	constructor() {
		this.client = new HttpClient('/users/verifications')
	}

	static getInstance() {
		if (!VerificationRepository.instance) VerificationRepository.instance = new VerificationRepository()
		return VerificationRepository.instance
	}

	async find(id: string) {
		const d = await this.client.get<any, VerificationFromModel | null>(`/${id}`, {})
		return this.mapper(d)
	}

	async get(query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<VerificationFromModel>>('/', query)
		return {
			...d,
			results: d.results.map(this.mapper),
		}
	}

	async listenToOne(id: string, listeners: Listeners<VerificationEntity>) {
		const model = await this.find(id)
		if (model) await listeners.updated(model)
		return await listenToOne(`${this.client.socketPath}/${id}`, listeners, this.mapper)
	}

	async listenToMany(query: QueryParams, listeners: Listeners<VerificationEntity>, matches: (entity: VerificationEntity) => boolean) {
		const models = await this.get(query)
		await Promise.all(models.results.map(listeners.updated))
		return await listenToMany(this.client.socketPath, listeners, this.mapper, matches)
	}

	async create(data: VerificationToModel) {
		return await this.client.post<VerificationToModel, VerificationEntity>('/', data)
	}

	async accept(id: string, data: AcceptVerificationInput) {
		return await this.client.post<AcceptVerificationInput, VerificationEntity>(`/${id}`, data)
	}
}
