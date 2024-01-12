import { CourseEntity, QuizEntity } from '@modules/study'
import { Course, Logic, QueryParams, Quiz, SingleUser } from 'sofa-logic'

export interface ContentDetails {
	id: string
	subject?: string
	title?: string
	image?: string
	labels?: {
		main: string
		sub: string
		color: string
	}
	user: SingleUser
	authUserId: string | undefined
	price?: number
	ratings: {
		avg: number
		count: number
		total: number
	}
	type: 'quiz' | 'course'
	route: string
}

export const search = async (query: QueryParams, returnCoursables = false) => {
	Logic.Common.showLoading()

	const allRequests = [
		Logic.Study.GetCourses(query).catch(),
		Logic.Study.GetQuizzes({
			...query,
			where: query.where.concat(...(returnCoursables ? [{ field: 'courseId', value: null }] : [])),
		}).catch(),
	]

	await Promise.all(allRequests)
		.catch((error) => {
			console.log(error)
		})
		.finally(() => {
			Logic.Common.hideLoading()
		})
}

export const extractContent = (content: Quiz | QuizEntity | CourseEntity | Course): ContentDetails => {
	const item = content as any
	const isCourse = item.__type === 'CourseEntity'
	const type = isCourse ? 'course' : 'quiz'
	return {
		id: item.id,
		subject: Logic.Study.GetTagName(item.topicId),
		title: item.title,
		image: item.photo?.link ?? '/images/default.png',
		labels: {
			main: isCourse ? 'Course' : 'Quiz',
			sub: isCourse ? `${item.coursables.length} materials` : `${item.questions.length} questions`,
			color: isCourse ? 'orange' : 'pink',
		},
		price: isCourse ? item.price?.amount : 0,
		user: item.user,
		authUserId: Logic.Common.AuthUser.id,
		type,
		ratings: item.ratings,
		route: `/marketplace/${item.id}?type=${type}`,
	}
}
