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

export const extractContent = (item: Quiz | Course): ContentDetails => {
	const type = item.__type == 'CourseEntity' ? 'course' : 'quiz'
	return {
		id: item.id,
		subject: Logic.Study.GetTagName(item.topicId),
		title: item.title,
		image: item.photo ? item.photo.link : '/images/default.png',
		labels: {
			main: type === 'course' ? 'Course' : 'Quiz',
			sub: item.__type == 'CourseEntity' ? `${item.coursables.length} materials` : `${item.questions.length} questions`,
			color: type === 'course' ? 'orange' : 'pink',
		},
		price: item.__type == 'CourseEntity' ? item.price?.amount : 0,
		user: item.user,
		authUserId: Logic.Common.AuthUser.id,
		type,
		ratings: item.ratings,
		route: `/marketplace/${item.id}?type=${type}`,
	}
}
