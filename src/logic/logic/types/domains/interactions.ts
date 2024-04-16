import { EmbeddedUser } from '@modules/users'

export interface Tags {
	hash: string
	id: string
	type: string
	title: string
	parent?: string
	meta: {
		courses: number
		quizzes: number
		images: number
		documents: number
		videos: number
		total: number
	}
	createdAt: number
	updatedAt: number
}

export interface Review {
	hash: string
	id: string
	entity: {
		id: string
		type: string
		userId: string
	}
	user: EmbeddedUser
	rating: number
	message: string
	createdAt: number
	updatedAt: number
}
