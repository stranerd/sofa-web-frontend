import { UserFromModel } from '../../data/models/users'
import { UserType } from '../types'
import { BaseEntity } from '@modules/core'

export class UserEntity extends BaseEntity<UserFromModel> {
	constructor(data: UserFromModel) {
		super(data)
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

	get myOrgsIn() {
		return this.account.organizationsIn.map((org) => org.id)
	}

	checkTaskState(
		task: 'profile_setup' | 'education_setup' | 'create_quiz' | 'create_course' | 'learn_quiz' | 'quiz_flashcard' | 'quiz_game',
	) {
		if (task === 'profile_setup') return !!this.bio.name?.first && !!this.bio.name?.last
		if (task === 'education_setup') return !!this.type
		if (task === 'create_quiz') return !!this.account.meta.quizzes
		if (task === 'create_course') return !!this.account.meta.courses
		if (task === 'learn_quiz') return !!this.account.meta.playedPractice
		if (task === 'quiz_flashcard') return !!this.account.meta.playedFlashcards
		if (task === 'quiz_game') return !!this.account.meta.hostedGames || !!this.account.meta.playedGames
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
