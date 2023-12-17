import { Listeners, QueryParams, QueryResults } from '@modules/core'
import { UserEntity } from '../entities/users'

export interface IUserRepository {
	find: (id: string) => Promise<UserEntity | null>,
	get: (query: QueryParams) => Promise<QueryResults<UserEntity>>
	listenToOne: (id: string, listener: Listeners<UserEntity>) => Promise<() => void>
	listenToMany: (query: QueryParams, listener: Listeners<UserEntity>, matches: (entity: UserEntity) => boolean) => Promise<() => void>
}
