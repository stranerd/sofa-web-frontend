import { $api } from '../../services'
import Common from './Common'
import { TagEntity } from '@modules/interactions'
import { Conditions, QueryParams, QueryResults } from '@modules/core'
import { CourseEntity, QuizEntity } from '@modules/study'

export default class Study extends Common {
	public AllTopics: QueryResults<TagEntity> | undefined
	public AllOtherTags: QueryResults<TagEntity> | undefined
	public AllQuzzies: QueryResults<QuizEntity> | undefined
	public AllCourses: QueryResults<CourseEntity> | undefined

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

	public GetCourses = (filters: QueryParams, updateItems = true) =>
		$api.study.course.fetch(filters).then((response) => {
			if (updateItems) this.AllCourses = response.data
			return response.data
		})

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
}
