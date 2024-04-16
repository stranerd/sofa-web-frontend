import { CourseEntity, QuizEntity } from '@modules/study'
import { EmbeddedUser } from '@modules/users'
export interface ResourceType {
	original: CourseEntity | QuizEntity
	title: string
	image: string
	user: EmbeddedUser
	authUserId: string | undefined
	subject: string
	route: string
	labels: {
		main: string
		sub: string
		color: string
	}
	price?: CourseEntity['price']
	progress: number
	id: string
	status: string
	showMore: boolean
	userId: string
	createdAt: number
	type: 'course' | 'quiz'
	ratings: {
		avg: number
		count: number
		total: number
	}
}
