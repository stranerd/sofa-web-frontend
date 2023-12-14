import { HttpClient, Listeners, listenToMany, listenToOne, QueryParams, QueryResults } from '@modules/core'
import { apiBase } from '@utils/environment'
import { UserEntity } from '../../domain/entities/user'
import { IUserRepository } from '../../domain/irepositories/iuser'
import { UserMapper } from '../mappers/users'
import { UserFromModel } from '../models/user'

export class UserRepository implements IUserRepository {
	private static instance: UserRepository
	private client: HttpClient
	private mapper: UserMapper = new UserMapper()

	constructor () {
		this.client = new HttpClient(apiBase + '/users/users')
	}

	static getInstance () {
		if (!UserRepository.instance) UserRepository.instance = new UserRepository()
		return UserRepository.instance
	}

	async find (id: string) {
		const d = await this.client.get<any, UserFromModel | null>(`/${id}`, {})
		return this.mapper.mapFrom(d)
	}

	async get (query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<UserFromModel>>('/', query)
		return {
			...d,
			results: d.results.map(this.mapper.mapFrom)
		}
	}

	async listenToOne (id: string, listeners: Listeners<UserEntity>) {
		const listener = listenToOne(`users/users/${id}`, listeners, this.mapper.mapFrom)
		const model = await this.find(id)
		if (model) await listeners.updated(model)
		return listener
	}

	async listenToMany (query: QueryParams, listeners: Listeners<UserEntity>, matches: (entity: UserEntity) => boolean) {
		const listener = listenToMany('users/users', listeners, this.mapper.mapFrom, matches)
		const models = await this.get(query)
		await Promise.all(models.results.map(listeners.updated))
		return listener
	}
}
