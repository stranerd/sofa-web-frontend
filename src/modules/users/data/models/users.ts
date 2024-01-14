import {
	AuthRoleType,
	UserAccount,
	UserAi,
	UserBio,
	UserDates,
	UserLocation,
	UserSocialsType,
	UserStatus,
	UserTutor,
	UserTypeData,
} from '../../domain/types'

export interface UserFromModel extends UserToModel {
	id: string
	bio: UserBio
	roles: AuthRoleType
	account: UserAccount
	status: UserStatus
	dates: UserDates
	type: UserTypeData | null
	tutor: UserTutor
	ai: UserAi
	socials: UserSocialsType
	location: UserLocation | null
}

export type UserToModel = Record<string, unknown>
