import { QuizEntity } from '../../domain/entities/quizzes'
import { IQuizRepository } from '../../domain/irepositories/iquizzes'
import { QuizFromModel, QuizToModel } from '../models/quizzes'
import { HttpClient, Listeners, QueryParams, QueryResults, listenToMany, listenToOne } from '@modules/core'

export class QuizRepository implements IQuizRepository {
	private static instance: QuizRepository
	private client: HttpClient
	private mapper = (model: QuizFromModel | null) => (model ? new QuizEntity(model) : null) as QuizEntity

	constructor() {
		this.client = new HttpClient('/study/quizzes')
	}

	static getInstance() {
		if (!QuizRepository.instance) QuizRepository.instance = new QuizRepository()
		return QuizRepository.instance
	}

	async add(data: QuizToModel) {
		const d = await this.client.post<QuizToModel, QuizFromModel>('/', data)
		return this.mapper(d)
	}

	async find(id: string) {
		const d = await this.client.get<any, QuizFromModel>(`/${id}`, {})
		return this.mapper(d)
	}

	async similar(id: string) {
		const d = await this.client.get<any, QuizFromModel[]>(`/${id}/similar`, {})
		return d.map(this.mapper)
	}

	async get(query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<QuizFromModel>>('/', query)
		return {
			...d,
			results: d.results.map(this.mapper),
		}
	}

	async getTutors(query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<QuizFromModel>>('/tutors', query)
		return {
			...d,
			results: d.results.map(this.mapper),
		}
	}

	async listenToOne(id: string, listeners: Listeners<QuizEntity>) {
		const model = await this.find(id)
		if (model) await listeners.updated(model)
		return await listenToOne(`${this.client.socketPath}/${id}`, listeners, this.mapper)
	}

	async listenToMany(query: QueryParams, listeners: Listeners<QuizEntity>, matches: (entity: QuizEntity) => boolean) {
		const models = await this.get(query)
		await Promise.all(models.results.map(listeners.updated))
		return await listenToMany(this.client.socketPath, listeners, this.mapper, matches)
	}

	async listenToManyTutors(query: QueryParams, listeners: Listeners<QuizEntity>, matches: (entity: QuizEntity) => boolean) {
		const models = await this.get(query)
		await Promise.all(models.results.map(listeners.updated))
		return await listenToMany(`${this.client.socketPath}/tutors`, listeners, this.mapper, matches)
	}

	async delete(id: string) {
		await this.client.delete<any, boolean>(`/${id}`, {})
	}

	async update(id: string, data: QuizToModel) {
		const d = await this.client.put<QuizToModel, QuizFromModel>(`/${id}`, data)
		return this.mapper(d)
	}

	async requestAccess(id: string, data: { add: boolean }) {
		return await this.client.post<typeof data, boolean>(`/${id}/access/request`, data)
	}

	async grantAccess(id: string, data: { userId: string; grant: boolean }) {
		return await this.client.post<typeof data, boolean>(`/${id}/access/grant`, data)
	}

	async addMembers(id: string, data: { userIds: string[]; grant: boolean }) {
		return await this.client.post<typeof data, boolean>(`/${id}/access/members/manage`, data)
	}

	async publish(id: string) {
		const d = await this.client.post<any, QuizFromModel>(`/${id}/publish`, {})
		return this.mapper(d)
	}

	async reorder(id: string, questionIds: string[]) {
		const d = await this.client.post<any, QuizFromModel>(`/${id}/reorder`, { questionIds })
		return this.mapper(d)
	}
}
