import { UserEntity } from '../../domain/entities/users'
import { IUserRepository } from '../../domain/irepositories/iusers'
import { UserAccount, UserAi, UserLocation, UserSocialsType, UserTypeData } from '../../domain/types'
import { UserFromModel } from '../models/users'
import { HttpClient, Listeners, listenToMany, listenToOne, QueryParams, QueryResults } from '@modules/core'

export class UserRepository implements IUserRepository {
	private static instance: UserRepository
	private client: HttpClient
	private mapper = (model: UserFromModel | null) => (model ? new UserEntity(model) : null) as UserEntity

	constructor() {
		this.client = new HttpClient('/users/users')
	}

	static getInstance() {
		if (!UserRepository.instance) UserRepository.instance = new UserRepository()
		return UserRepository.instance
	}

	async find(id: string) {
		const d = await this.client.get<any, UserFromModel | null>(`/${id}`, {})
		return this.mapper(d)
	}

	async get(query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<UserFromModel>>('/', query)
		return {
			...d,
			results: d.results.map(this.mapper),
		}
	}

	async listenToOne(id: string, listeners: Listeners<UserEntity>) {
		const model = await this.find(id)
		if (model) await listeners.updated(model)
		return await listenToOne(`${this.client.socketPath}/${id}`, listeners, this.mapper)
	}

	async listenToMany(query: QueryParams, listeners: Listeners<UserEntity>, matches: (entity: UserEntity) => boolean) {
		const models = await this.get(query)
		await Promise.all(models.results.map(listeners.updated))
		return await listenToMany(this.client.socketPath, listeners, this.mapper, matches)
	}

	async updateType(type: UserTypeData) {
		return await this.client.post<{ data: UserTypeData }, UserEntity>('/type', { data: type })
	}

	async updateOrgCode(value: { code: string }) {
		return await this.client.post<{ code: string }, UserEntity>('/organization/code', value)
	}

	async updateAi(ai: UserAi) {
		return await this.client.post<UserAi, UserEntity>('/ai', ai)
	}

	async updateSocials(socials: UserSocialsType) {
		return await this.client.post<{ socials: UserSocialsType }, UserEntity>('/socials', { socials })
	}

	async updateLocation(location: UserLocation) {
		return await this.client.post<{ location: UserLocation }, UserEntity>('/location', { location })
	}

	async updateEditingQuizzes(quizzes: UserAccount['editing']['quizzes']) {
		return await this.client.post<{ quizzes: UserAccount['editing']['quizzes'] }, UserEntity>('/editing/quizzes', {
			quizzes,
		})
	}

	async updateSavedClasses(data: { classes: string[]; add: boolean }) {
		return await this.client.post<{ classes: string[]; add: boolean }, UserEntity>('/saved/classes', data)
	}
}
