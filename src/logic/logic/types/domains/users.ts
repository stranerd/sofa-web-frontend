import { EmbeddedUser } from '@modules/users'
import { FileData } from './common'

export type SingleUser = EmbeddedUser

export interface UserVerification {
	hash: string
	id: string
	userId: string
	socials: {
		website: string
		facebook: string
		twitter: string
		instagram: string
		linkedIn: string
		youtube: string
		tiktok: string
	}
	content: {
		quizzes: string[]
		courses: string[]
	}
	pending: boolean
	accepted: boolean
	createdAt: number
	updatedAt: number
}

export interface TutorRequest {
	hash: string
	id: string
	userId: string
	topicId: string
	verification: FileData
	qualification: FileData[]
	pending: boolean
	accepted: boolean
	testId: string
	testFinished: boolean
	createdAt: number
	updatedAt: number
}
