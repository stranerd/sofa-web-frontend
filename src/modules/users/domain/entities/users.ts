import { UserFromModel } from '../../data/models/users'
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
	UserTypeData,
} from '../types'
import { BaseEntity } from '@modules/core'

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

	constructor({ id, bio, roles, account, status, dates, type, tutor, ai, socials, location }: UserFromModel) {
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

	get isOnline() {
		return this.status.connections.length > 0
	}

	get lastSeen() {
		return this.isOnline ? Date.now() : this.status.lastUpdatedAt
	}

	get score() {
		return this.account.rankings.overall.value
	}

	get publicName() {
		if (this.type?.type === UserType.organization) return this.type.name
		return this.bio.name.full
	}

	get userType() {
		const type = this.type?.type ?? UserType.student
		return {
			isStudent: type === UserType.student,
			isTeacher: type === UserType.teacher,
			isOrg: type === UserType.organization,
			type,
		}
	}

	get shareLink() {
		return `${window.location.origin}/profile/${this.id}`
	}

	checkTaskState(
		task: 'profile_setup' | 'education_setup' | 'create_quiz' | 'create_course' | 'learn_quiz' | 'quiz_flashcard' | 'quiz_game',
	) {
		if (task === 'profile_setup') return !!this.bio.name?.first && !!this.bio.name?.last
		if (task === 'education_setup') return !!this.type
		if (task === 'create_quiz') return !!this.account.meta.quizzes
		if (task === 'create_course') return !!this.account.meta.courses
		if (task === 'learn_quiz') return !!localStorage.getItem('quiz_action_practice')
		if (task === 'quiz_flashcard') return !!localStorage.getItem('quiz_action_flashcard')
		if (task === 'quiz_game') return localStorage.getItem('quiz_action_game')
		return false
	}

	static defaultAi = 'Dr. Sofa'
	static defaultAiPhotoLink = '/images/icons/robot.svg'

	static getDefaultUserType() {
		return {
			isStudent: true,
			isTeacher: false,
			isOrg: false,
			type: UserType.student,
		}
	}
}
