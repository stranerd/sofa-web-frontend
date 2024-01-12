import { UserEntity, UsersUseCases } from '@modules/users'
import { Course, Logic, QueryParams, Quiz } from 'sofa-logic'
import { Ref, onMounted, reactive, ref } from 'vue'
import { useAsyncFn } from '../core/hooks'

const store = {} as Record<
	string,
	{
		user: Ref<UserEntity | null>
		quizzes: Quiz[]
		courses: Course[]
		fetched: Ref<boolean>
	}
>

export const useUsersMaterials = (id: string, skip: Partial<{ user: boolean }> = {}) => {
	store[id] ??= {
		user: ref(null),
		quizzes: reactive([]),
		courses: reactive([]),
		fetched: ref(false),
	}

	const {
		asyncFn: fetchUserAndMaterials,
		loading,
		error,
	} = useAsyncFn(
		async () => {
			if (!skip.user) store[id].user.value = await UsersUseCases.find(id)
			const query: QueryParams = {
				where: [
					{ field: 'user.id', value: id },
					{ field: 'status', value: 'published' },
				],
				all: true, // TODO: implement pagination
				sort: [{ field: 'createdAt', desc: true }],
			}
			const [courses, quizzes] = await Promise.all([
				Logic.Study.GetCourses(query),
				Logic.Study.GetQuizzes({ ...query, where: [...query.where, { field: 'courseId', value: null }] }),
			])
			courses.results.forEach((r) =>
				Logic.addToArray(
					store[id].courses,
					r,
					(e) => e.id,
					(e) => e.createdAt,
				),
			)
			quizzes.results.forEach((r) =>
				Logic.addToArray(
					store[id].quizzes,
					r,
					(e) => e.id,
					(e) => e.createdAt,
				),
			)
			store[id].fetched.value = true
		},
		{ key: `study/user-materials/${id}` },
	)

	onMounted(async () => {
		if (!store[id].fetched.value) await fetchUserAndMaterials()
	})

	return { ...store[id], loading, error }
}
