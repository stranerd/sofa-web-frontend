import { reactive } from 'vue'
import { Logic } from '..'
import { $api } from '../../services'
import { Conditions, QueryParams } from '../types/common'
import { ContentDetails, Paginated } from '../types/domains/common'
import { Review, Tags } from '../types/domains/interactions'
import Common from './Common'
import { CourseEntity, FileEntity, QuizEntity } from '@modules/study'

export default class Study extends Common {
	constructor() {
		super()
	}

	public Tags: Paginated<Tags> | undefined
	public AllTopics: Paginated<Tags> | undefined
	public AllOtherTags: Paginated<Tags> | undefined
	public AllQuzzies: Paginated<QuizEntity> | undefined
	public SingleQuiz: QuizEntity | undefined
	public AllCourses: Paginated<CourseEntity> | undefined
	public SingleCourse: CourseEntity | undefined
	public SingleCourseFiles: FileEntity[] | undefined
	public SingleCourseQuizzes: QuizEntity[] | undefined
	public SingleReview: Review | undefined
	public AllReviews: Paginated<Review> | undefined

	public contentDetails = reactive<ContentDetails>({
		original: null,
		type: 'course',
		route: '/marketplace/',
		price: 0,
		currency: 'NGN',
		image: '/images/default.svg',
		title: '',
		status: '',
		id: '',
		hasCourse: true,
		info: '',
		courseId: '',
		labels: {
			color: 'pink',
			main: 'Course',
			sub: '',
		},
		ratings: {
			avg: 4,
			label: '24 ratings',
			count: 24,
			stats: {
				'5': 3,
				'4': 21,
				'3': 0,
				'2': 0,
				'1': 0,
			},
			reviews: [],
		},
		user: {
			name: '',
			photoUrl: '',
			role: 'Teacher',
			id: '',
			stats: {
				quizzes: 34,
				courses: 18,
				followers: '1.1k',
			},
		},
		lastUpdated: '',
		tags: [],
		content: {
			materialsCount: 11,
			sections: [],
		},
		questions: [],
	})

	public GetTagName = (id: string) => {
		const Tag = [...(this.Tags?.results || []), ...(this.AllTopics?.results || []), ...(this.AllOtherTags?.results || [])].filter(
			(tag) => tag.id == id,
		)

		if (Tag.length) {
			return Tag[0].title
		} else {
			return 'Not set'
		}
	}

	public GetTags = (filters: QueryParams) =>
		$api.interactions.tag.fetch(filters).then((response) => {
			this.Tags = response.data
			return this.Tags
		})

	public GetTopics = () =>
		$api.interactions.tag
			.fetch({
				where: [
					{
						field: 'type',
						value: 'topics',
						condition: Conditions.eq,
					},
				],
			})
			.then((response) => {
				this.AllTopics = response.data
				return response.data
			})

	public GetOtherTags = () =>
		$api.interactions.tag
			.fetch({
				where: [
					{
						field: 'type',
						value: 'generic',
						condition: Conditions.eq,
					},
				],
			})
			.then((response) => {
				this.AllOtherTags = response.data
				return response.data
			})

	public GetQuizzes = (filters: QueryParams, updateItems = true) =>
		$api.study.quiz.fetch(filters).then((response) => {
			if (updateItems) this.AllQuzzies = response.data
			return response.data
		})

	public GetQuiz = async (id: string) => {
		if (!id || id == 'nill') return null
		return $api.study.quiz.get(id).then((response) => {
			this.SingleQuiz = response.data
			return this.SingleQuiz
		})
	}

	public GetCourses = (filters: QueryParams, updateItems = true) =>
		$api.study.course.fetch(filters).then((response) => {
			if (updateItems) this.AllCourses = response.data
			return response.data
		})

	public GetSimilarCourses = (courseId: string) => $api.study.course.similarCourses(courseId).then((response) => response.data)

	public GetSimilarQuizzes = (quizId: string) => $api.study.quiz.similarQuizzes(quizId).then((response) => response.data)

	public GetCoursesWithQuery = async (query = 'nill', tagId = '', userId = '') => {
		const whereQuery: QueryParams['where'] = []

		if (tagId && tagId != 'nill') {
			whereQuery.push({
				field: 'tagIds',
				value: tagId,
				condition: Conditions.in,
			})
		}

		if (userId && userId != 'nill') {
			whereQuery.push({
				field: 'user.id',
				value: userId,
				condition: Conditions.eq,
			})
		}

		whereQuery.push({
			field: 'status',
			value: 'published',
			condition: Conditions.eq,
		})
		return $api.study.course
			.fetch({
				search: {
					fields: ['title'],
					value: query == 'nill' ? '' : query,
				},
				limit: 20,
				where: whereQuery,
			})
			.then((response) => {
				this.AllCourses = response.data
			})
	}

	public GetQuizzesWithQuery = async (query = 'nill', tagId = '', userId = '') => {
		const whereQuery: QueryParams['where'] = []

		if (tagId && tagId != 'nill') {
			whereQuery.push({
				field: 'tagIds',
				value: tagId,
				condition: Conditions.in,
			})
		}

		if (userId && userId != 'nill') {
			whereQuery.push({
				field: 'user.id',
				value: userId,
				condition: Conditions.eq,
			})
		}

		whereQuery.push({
			field: 'status',
			value: 'published',
			condition: Conditions.eq,
		})

		return $api.study.quiz
			.fetch({
				search: {
					fields: ['title'],
					value: query == 'nill' ? '' : query,
				},
				limit: 20,
				where: whereQuery,
			})
			.then((response) => {
				this.AllQuzzies = response.data
			})
	}

	public GetCourse = async (id: string) => {
		const response = await $api.study.course.get(id)
		const allCourseableFiles = response.data?.coursables?.filter((item) => item.type == 'file').map((item) => item.id)
		const allCourseableQuizzes = response.data?.coursables?.filter((item) => item.type == 'quiz').map((item) => item.id)

		const allCoursableDataRequests: Promise<any>[] = []

		// files
		allCoursableDataRequests.push(
			$api.study.file
				.fetch({
					where: [
						{
							field: 'id',
							value: allCourseableFiles,
							condition: Conditions.in,
						},
					],
				})
				.then((response) => {
					this.SingleCourseFiles = response.data.results
				}),
		)

		// quizzes
		allCoursableDataRequests.push(
			$api.study.quiz
				.fetch({
					where: [
						{
							field: 'id',
							value: allCourseableQuizzes,
							condition: Conditions.in,
						},
					],
				})
				.then((response) => {
					this.SingleCourseQuizzes = response.data.results
				}),
		)

		await Promise.all(allCoursableDataRequests).catch((error) => {
			console.log(error)
		})
		this.SingleCourse = response.data
	}

	public GetReviews = (uniqueId: string, type: 'quizzes' | 'courses') =>
		$api.interactions.reviews
			.fetch({
				where: [
					{
						field: 'entity.id',
						value: uniqueId,
						condition: Conditions.eq,
					},
					{
						field: 'entity.type',
						value: type,
						condition: Conditions.eq,
					},
				],
			})
			.then((response) => {
				this.AllReviews = response.data
				return response.data
			})

	public GetSingleReview = (uniqueId: string, type: 'quizzes' | 'courses') =>
		$api.interactions.reviews
			.fetch({
				where: [
					{
						field: 'entity.id',
						value: uniqueId,
						condition: Conditions.eq,
					},
					{
						field: 'entity.type',
						value: type,
						condition: Conditions.eq,
					},
					{
						field: 'user.id',
						value: Logic.Common.AuthUser?.id,
						condition: Conditions.eq,
					},
				],
			})
			.then((response) => {
				if (response.data.results.length) {
					this.SingleReview = response.data.results[0]
				} else {
					this.SingleReview = undefined
				}

				return response.data
			})
}
