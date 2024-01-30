import { addToArray } from 'valleyed'
import { Ref, onMounted, reactive, ref } from 'vue'
import { useAsyncFn } from '../core/hooks'
import { CourseEntity, QuizEntity, DraftStatus } from '@modules/study'
import { UserEntity, UsersUseCases } from '@modules/users'
import { Logic, QueryParams } from 'sofa-logic'

const store = {} as Record<
	string,
	{
		user: Ref<UserEntity | null>
		quizzes: QuizEntity[]
		courses: CourseEntity[]
	}
>

export const useUsersMaterials = (id: string, skip: Partial<{ user: boolean }> = {}) => {
	store[id] ??= {
		user: ref(null),
		quizzes: reactive([]),
		courses: reactive([]),
	}

	const {
		asyncFn: fetchUserAndMaterials,
		loading,
		error,
		called,
	} = useAsyncFn(
		async () => {
			if (!skip.user) store[id].user.value = await UsersUseCases.find(id)
			const query: QueryParams = {
				where: [
					{ field: 'user.id', value: id },
					{ field: 'status', value: DraftStatus.published },
				],
				all: true, // TODO: implement pagination
				sort: [{ field: 'createdAt', desc: true }],
			}
			const [courses, quizzes] = await Promise.all([
				Logic.Study.GetCourses(query),
				Logic.Study.GetQuizzes({ ...query, where: [...query.where!, { field: 'courseId', value: null }] }),
			])
			courses.results.forEach((r) =>
				addToArray(
					store[id].courses,
					r,
					(e) => e.id,
					(e) => e.createdAt,
				),
			)
			quizzes.results.forEach((r) =>
				addToArray(
					store[id].quizzes,
					r,
					(e) => e.id,
					(e) => e.createdAt,
				),
			)
		},
		{ key: `study/user-materials/${id}` },
	)

	onMounted(async () => {
		if (!called.value) await fetchUserAndMaterials()
	})

	return { ...store[id], loading, error }
}
