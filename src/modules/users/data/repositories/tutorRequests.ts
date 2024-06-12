import { TutorRequestEntity } from '../../domain/entities/tutorRequests'
import { ITutorRequestRepository } from '../../domain/irepositories/itutorRequests'
import { AcceptTutorRequestInput } from '../../domain/types'
import { TutorRequestFromModel, TutorRequestToModel } from '../models/tutorRequests'
import { HttpClient, Listeners, QueryParams, QueryResults, listenToMany, listenToOne } from '@modules/core'

export class TutorRequestRepository implements ITutorRequestRepository {
	private static instance: TutorRequestRepository
	private client: HttpClient
	private mapper = (model: TutorRequestFromModel | null) => (model ? new TutorRequestEntity(model) : null) as TutorRequestEntity

	constructor() {
		this.client = new HttpClient('/users/tutorRequests')
	}

	static getInstance() {
		if (!TutorRequestRepository.instance) TutorRequestRepository.instance = new TutorRequestRepository()
		return TutorRequestRepository.instance
	}

	async find(id: string) {
		const d = await this.client.get<any, TutorRequestFromModel | null>(`/${id}`, {})
		return this.mapper(d)
	}

	async get(query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<TutorRequestFromModel>>('/', query)
		return {
			...d,
			results: d.results.map(this.mapper),
		}
	}

	async listenToOne(id: string, listeners: Listeners<TutorRequestEntity>) {
		const model = await this.find(id)
		if (model) await listeners.updated(model)
		return await listenToOne(`${this.client.socketPath}/${id}`, listeners, this.mapper)
	}

	async listenToMany(query: QueryParams, listeners: Listeners<TutorRequestEntity>, matches: (entity: TutorRequestEntity) => boolean) {
		const models = await this.get(query)
		await Promise.all(models.results.map(listeners.updated))
		return await listenToMany(this.client.socketPath, listeners, this.mapper, matches)
	}

	async create(data: TutorRequestToModel) {
		return await this.client.post<TutorRequestToModel, TutorRequestEntity>('/', data)
	}

	async accept(id: string, data: AcceptTutorRequestInput) {
		return await this.client.post<AcceptTutorRequestInput, TutorRequestEntity>(`/${id}`, data)
	}
}
