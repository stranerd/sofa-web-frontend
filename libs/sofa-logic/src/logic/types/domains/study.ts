import { FileData } from './common'
import { SingleUser } from './users'

export interface Quiz {
	hash: string
	id: string
	title: string
	description: string
	photo?: FileData
	isForTutors: boolean
	questions: string[]
	courseId?: string
	user: SingleUser
	topicId: string
	tagIds: string[]
	status: string
	meta: {
		games: number
		total: number
	}
	createdAt: number
	updatedAt: number
	ratings: {
		avg: number
		count: number
		total: number
	}
	access: {
		requests: string[]
		members: string[]
	}
	__type: 'QuizEntity'
}

export interface Course {
	hash: string
	id: string
	coursables: {
		id: string
		type: string
	}[]
	sections: {
		label: string
		items: {
			id: string
			type: string
		}[]
	}[]
	title: string
	description: string
	photo?: FileData
	user: SingleUser
	topicId: string
	tagIds: string[]
	status: string
	frozen: boolean
	price: {
		amount: number
		currency: string
	}
	createdAt: number
	updatedAt: number
	ratings: {
		avg: number
		count: number
		total: number
	}
	__type: 'CourseEntity'
}

export interface SofaFile {
	hash: string
	id: string
	title: string
	description: string
	photo?: FileData
	type: string
	courseId?: string
	user: SingleUser
	topicId: string
	tagIds: string[]
	status: string
	createdAt: number
	updatedAt: number
}

export interface ResourceType {
	original: Course | Quiz
	title: string
	image: string
	user: SingleUser
	authUserId: string | undefined
	subject: string
	route: string
	labels: {
		main: string
		sub: string
		color: string
	}
	price?: Course['price']
	progress: number
	id: string
	status: string
	showMore: boolean
	userId: string
	createdAt: number
	type: 'course' | 'quiz' | string
	ratings: {
		avg: number
		count: number
		total: number
	}
}
