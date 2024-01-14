import { HttpClient, Listeners, QueryParams, QueryResults, listenToMany, listenToOne } from '@modules/core'
import { ReportEntity } from '../../domain/entities/reports'
import { IReportRepository } from '../../domain/irepositories/reports'
import { ReportFromModel, ReportToModel } from '../models/reports'

export class ReportRepository implements IReportRepository {
	private static instance: ReportRepository
	private client: HttpClient
	private mapper = (model: ReportFromModel | null) => (model ? new ReportEntity(model) : null) as ReportEntity

	constructor() {
		this.client = new HttpClient('/interactions/reports')
	}

	static getInstance() {
		if (!ReportRepository.instance) ReportRepository.instance = new ReportRepository()
		return ReportRepository.instance
	}

	async add(data: ReportToModel) {
		const d = await this.client.post<ReportToModel, ReportFromModel>('/', data)
		return this.mapper(d)
	}

	async find(id: string) {
		const d = await this.client.get<any, ReportFromModel>(`/${id}`, {})
		return this.mapper(d)
	}

	async get(query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<ReportFromModel>>('/', query)
		return {
			...d,
			results: d.results.map(this.mapper),
		}
	}

	async listenToOne(id: string, listeners: Listeners<ReportEntity>) {
		const model = await this.find(id)
		if (model) await listeners.updated(model)
		return await listenToOne(`${this.client.socketPath}/${id}`, listeners, this.mapper)
	}

	async listenToMany(query: QueryParams, listeners: Listeners<ReportEntity>, matches: (entity: ReportEntity) => boolean) {
		const models = await this.get(query)
		await Promise.all(models.results.map(listeners.updated))
		return await listenToMany(this.client.socketPath, listeners, this.mapper, matches)
	}

	async delete(id: string) {
		await this.client.delete<any, boolean>(`/${id}`, {})
	}
}
