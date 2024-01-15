import type { AuthRoleType, UserBio } from '@modules/auth'
import { Media, Ratings } from '@modules/core'
import { MemberTypes } from '@modules/organizations'

export { AuthRoleType, UserBio }

export enum UserType {
	student = 'student',
	teacher = 'teacher',
	organization = 'organization',
}

export enum UserSchoolType {
	'aspirant' = 'aspirant',
	'college' = 'college',
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
	bio: Pick<UserBio, 'name' | 'description' | 'photo'>
	roles: AuthRoleType
	type: UserTypeData | null
}

export interface UserAccount {
	meta: {
		courses: number
		publishedCourses: number
		quizzes: number
		publishedQuizzes: number
		documents: number
		publishedDocuments: number
		images: number
		publishedImages: number
		videos: number
		publishedVideos: number
		folders: number

		hostedGames: number
		playedGames: number
		playedTests: number

		students: number
		teachers: number
		classes: number
		lessons: number

		total: number
	}
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
}

export type UserSocialsType = { ref: UserSocials; link: string }[]

export type UserLocation = {
	country: string
	state: string
}
