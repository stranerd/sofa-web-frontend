import { Listeners, QueryParams, QueryResults } from '@modules/core'
import { UserEntity } from '../entities/users'
import { UserAccount, UserAi, UserLocation, UserSocialsType, UserTypeData } from '../types'

export interface IUserRepository {
	find: (id: string) => Promise<UserEntity | null>,
	get: (query: QueryParams) => Promise<QueryResults<UserEntity>>
	listenToOne: (id: string, listener: Listeners<UserEntity>) => Promise<() => void>
	listenToMany: (query: QueryParams, listener: Listeners<UserEntity>, matches: (entity: UserEntity) => boolean) => Promise<() => void>
	updateType: (value: UserTypeData) => Promise<UserEntity>
	updateOrgCode: (value: { code: string }) => Promise<UserEntity>
	updateAi: (value: UserAi) => Promise<UserEntity>
	updateSocials: (socials: UserSocialsType) => Promise<UserEntity>
	updateLocation: (location: UserLocation) => Promise<UserEntity>
	updateEditingQuizzes: (quizzes: UserAccount['editing']['quizzes']) => Promise<UserEntity>
}
