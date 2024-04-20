import { ref } from 'vue'
import { useAsyncFn } from './core/hooks'
import { Conditions, QueryParams } from '@modules/core'
import { CourseEntity, CoursesUseCases, DraftStatus, QuizEntity, QuizzesUseCases } from '@modules/study'

export const useSearch = (initialQuery = '') => {
	const query = ref(initialQuery)

	const courses = ref<CourseEntity[]>([])
	const quizzes = ref<QuizEntity[]>([])

	const {
		asyncFn: search,
		loading,
		error,
	} = useAsyncFn(async (queries: Exclude<QueryParams['where'], undefined>) => {
		const allQueries: QueryParams = {
			where: [
				{
					field: 'status',
					value: DraftStatus.published,
					condition: Conditions.eq,
				},
				...queries,
			],
			sort: [{ field: 'createdAt', desc: true }],
			limit: 20,
			...(query.value
				? {
						search: {
							value: query.value,
							fields: ['title', 'user.bio.name.first', 'user.bio.name.last', 'user.bio.name.full', 'user.bio.publicName'],
						},
					}
				: {}),
		}
		const [coursesData, quizzesData] = await Promise.all([
			CoursesUseCases.getWithQuery(allQueries),
			QuizzesUseCases.getWithQuery(allQueries),
		])
		courses.value = coursesData
		quizzes.value = quizzesData
	})

	return { search, query, loading, error, courses, quizzes }
}
