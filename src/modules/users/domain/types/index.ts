import type { AuthRoleType, Phone, UserBio } from '@modules/auth'
import { Media, Ratings } from '@modules/core'
import { MemberTypes } from '@modules/organizations'

export * from './verifications'
export { AuthRoleType, UserBio }

export enum UserType {
	student = 'student',
	teacher = 'teacher',
	organization = 'organization',
}

export enum UserSchoolType {
	'aspirant' = 'aspirant',
	'college' = 'college',
	'university' = 'university',
}

export type UserTypeData =
	| {
			type: UserType.student
			school:
				| {
						type: UserSchoolType.aspirant
						exams: {
							institutionId: string
							courseIds: string[]
							startDate: number
							endDate: number
						}[]
				  }
				| {
						type: UserSchoolType.college
						institutionId: string
						facultyId: string
						departmentId: string
				  }
				| {
						type: UserSchoolType.university
				  }
	  }
	| {
			type: UserType.teacher
			school: string
	  }
	| {
			type: UserType.organization
			name: string
			code: string
	  }

export enum RankingTimes {
	daily = 'daily',
	weekly = 'weekly',
	monthly = 'monthly',
	overall = 'overall',
}

export type EmbeddedUser = {
	id: string
	bio: Pick<UserBio, 'name' | 'photo'> & {
		publicName: string
	}
	roles: AuthRoleType
	type: UserTypeData | null
}

enum UserMeta {
	connects = 'connects',

	courses = 'courses',
	publishedCourses = 'publishedCourses',
	quizzes = 'quizzes',
	publishedQuizzes = 'publishedQuizzes',
	documents = 'documents',
	publishedDocuments = 'publishedDocuments',
	images = 'images',
	publishedImages = 'publishedImages',
	videos = 'videos',
	publishedVideos = 'publishedVideos',
	folders = 'folders',

	hostedGames = 'hostedGames',
	playedGames = 'playedGames',
	playedTests = 'playedTests',
	playedPractice = 'playedPractice',
	playedFlashcards = 'playedFlashcards',
	hostedAssessments = 'hostedAssessments',
	playedAssessments = 'playedAssessments',

	students = 'students',
	teachers = 'teachers',
	classes = 'classes',
	lessons = 'lessons',

	total = 'total',
}

export interface UserAccount {
	meta: Record<UserMeta, number>
	streak: {
		count: number
		longestStreak: number
		lastEvaluatedAt: number
	}
	rankings: Record<RankingTimes, { value: number; lastUpdatedAt: number }>
	ratings: Ratings
	organizationsIn: { id: string; type: MemberTypes }[]
	settings: {
		notifications: boolean
	}
	editing: {
		quizzes: { id: string; questionId: string } | null
	}
	saved: {
		classes: string[]
	}
}

export interface UserStatus {
	connections: string[]
	lastUpdatedAt: number
}

export interface UserDates {
	createdAt: number
	deletedAt: number | null
}

export type UserTutor = {
	conversations: string[]
	topics: string[]
}

export type UserAi = {
	photo: Media | null
	name: string
	tagline: string
}

export enum UserSocials {
	website = 'website',
	facebook = 'facebook',
	twitter = 'twitter',
	instagram = 'instagram',
	youtube = 'youtube',
	tiktok = 'tiktok',
	// linkedin = 'linkedin'
}

export type UserSocialsType = { ref: UserSocials; link: string }[]

export type UserLocation = {
	country: string
	state: string
}

export type MetaMessageData = {
	name: string
	email: string
	phone: Phone | null
	message: string
}
