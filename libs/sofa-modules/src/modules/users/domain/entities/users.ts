import { BaseEntity } from '@modules/core'
import { UserFromModel } from '../../data/models/user'
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
	UserType,
	UserTypeData
} from '../types'

export class UserEntity extends BaseEntity {
	public readonly id: string
	public readonly bio: UserBio
	public readonly roles: AuthRoleType
	public readonly account: UserAccount
	public readonly status: UserStatus
	public readonly dates: UserDates
	public readonly type: UserTypeData | null
	public readonly tutor: UserTutor
	public readonly ai: UserAi
	public readonly socials: UserSocialsType
	public readonly location: UserLocation | null

	constructor ({ id, bio, roles, account, status, dates, type, tutor, ai, socials, location }: UserFromModel) {
		super()
		this.id = id
		this.bio = bio
		this.roles = roles
		this.account = account
		this.status = status
		this.dates = dates
		this.type = type
		this.tutor = tutor
		this.ai = ai
		this.socials = socials
		this.location = location
	}

	get isOnline () {
		return this.rawThis.status.connections.length > 0
	}

	get lastSeen () {
		return this.rawThis.isOnline ? Date.now() : this.rawThis.status.lastUpdatedAt
	}

	get score () {
		return this.rawThis.account.rankings.overall.value
	}

	get orgName () {
		if (this.rawThis.type.type === UserType.organization) return this.rawThis.type.name
		return this.rawThis.bio.name.full
	}

	get userType () {
		const type = this.rawThis.type?.type ?? UserType.student
		return {
			isStudent: type === UserType.student,
			isTeacher: type === UserType.teacher,
			isOrg: type === UserType.organization,
			type
		}
	}

	static defaultAi = 'Dr. Sofa'
	static defaultAiPhotoLink  = '/images/icons/robot.svg'

	static getDefaultUserType () {
		return {
			isStudent: true,
			isTeacher: false,
			isOrg: false,
			type: UserType.student
		}
	}
}
