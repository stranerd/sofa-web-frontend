import { HttpClient, Listeners, QueryParams, QueryResults, listenToMany, listenToOne } from '@modules/core'
import { QuestionEntity } from '../../domain/entities/questions'
import { IQuestionRepository } from '../../domain/irepositories/iquestions'
import { QuestionFromModel, QuestionToModel } from '../models/questions'

export class QuestionRepository implements IQuestionRepository {
	private static instances: Record<string, QuestionRepository> = {}
	private client: HttpClient
	private mapper = (model: QuestionFromModel | null) => (model ? new QuestionEntity(model) : null) as QuestionEntity

	private constructor(quizId: string) {
		this.client = new HttpClient(`/study/quizzes/${quizId}/questions`)
	}

	static getInstance(quizId: string) {
		return (QuestionRepository.instances[quizId] ??= new QuestionRepository(quizId))
	}

	async get(query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<QuestionFromModel>>('/', query)

		return {
			...d,
			results: d.results.map((r) => this.mapper(r)!),
		}
	}

	async add(data: QuestionToModel) {
		const d = await this.client.post<QuestionToModel, QuestionFromModel>('/', data)
		return this.mapper(d)!
	}

	async update(id: string, data: QuestionToModel) {
		const d = await this.client.put<QuestionToModel, QuestionFromModel>(`/${id}`, data)
		return this.mapper(d)!
	}

	async find(id: string) {
		const data = await this.client.get<QueryParams, QuestionFromModel | null>(`/${id}`, {})
		return this.mapper(data)
	}

	async delete(id: string) {
		return await this.client.delete<unknown, boolean>(`/${id}`, {})
	}

	async listenToOne(id: string, listeners: Listeners<QuestionEntity>) {
		const model = await this.find(id)
		if (model) await listeners.updated(model)
		return await listenToOne(`${this.client.socketPath}/${id}`, listeners, this.mapper)
	}

	async listenToMany(query: QueryParams, listeners: Listeners<QuestionEntity>, matches: (entity: QuestionEntity) => boolean) {
		const models = await this.get(query)
		await Promise.all(models.results.map(listeners.updated))
		return await listenToMany(this.client.socketPath, listeners, this.mapper, matches)
	}
}
