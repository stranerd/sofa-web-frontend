import { HttpClient, Listeners, QueryParams, QueryResults, listenToMany, listenToOne } from '@modules/core'
import { ReviewEntity } from '../../domain/entities/reviews'
import { IReviewRepository } from '../../domain/irepositories/reviews'
import { ReviewFromModel, ReviewToModel } from '../models/reviews'

export class ReviewRepository implements IReviewRepository {
	private static instance: ReviewRepository
	private client: HttpClient
	private mapper = (model: ReviewFromModel | null) => (model ? new ReviewEntity(model) : null) as ReviewEntity

	constructor() {
		this.client = new HttpClient('/interactions/reviews')
	}

	static getInstance() {
		if (!ReviewRepository.instance) ReviewRepository.instance = new ReviewRepository()
		return ReviewRepository.instance
	}

	async add(data: ReviewToModel) {
		const d = await this.client.post<ReviewToModel, ReviewFromModel>('/', data)
		return this.mapper(d)
	}

	async find(id: string) {
		const d = await this.client.get<any, ReviewFromModel>(`/${id}`, {})
		return this.mapper(d)
	}

	async get(query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<ReviewFromModel>>('/', query)
		return {
			...d,
			results: d.results.map(this.mapper),
		}
	}

	async listenToOne(id: string, listeners: Listeners<ReviewEntity>) {
		const model = await this.find(id)
		if (model) await listeners.updated(model)
		return await listenToOne(`${this.client.socketPath}/${id}`, listeners, this.mapper)
	}

	async listenToMany(query: QueryParams, listeners: Listeners<ReviewEntity>, matches: (entity: ReviewEntity) => boolean) {
		const models = await this.get(query)
		await Promise.all(models.results.map(listeners.updated))
		return await listenToMany(this.client.socketPath, listeners, this.mapper, matches)
	}
}
