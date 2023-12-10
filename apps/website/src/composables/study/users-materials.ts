import { Course, Logic, QueryParams, Quiz, SingleUser } from 'sofa-logic'
import { Ref, onMounted, reactive, ref } from 'vue'
import { useErrorHandler, useLoadingHandler } from '../core/states'

const store = {} as Record<string, {
	user: Ref<SingleUser | null>
	quizzes: Quiz[]
	courses: Course[]
	fetched: Ref<boolean>
} & ReturnType<typeof useErrorHandler> & ReturnType<typeof useLoadingHandler>>

export const useUsersMaterials = (id: string) => {
	store[id] ??= {
		user: ref(null),
		quizzes: reactive([]),
		courses: reactive([]),
		fetched: ref(false),
		...useErrorHandler(),
		...useLoadingHandler(),
	}

	const fetchUserAndMaterials = async () => {
		await store[id].setError('')
		try {
			await store[id].setLoading(true)
			store[id].user.value = await Logic.Users.GetUser(id)
			const query: QueryParams = {
				where: [{ field: "user.id", value: id }, { field: 'status', value: 'published' }],
				all: true, // TODO: implement pagination
				sort: [{ field: 'createdAt', desc: true }]
			}
			const [courses, quizzes] = await Promise.all([
				Logic.Study.GetCourses(query),
				Logic.Study.GetQuizzes({ ...query, where: [...query.where, { field: 'courseId', value: null }] })
			])
			courses.results.forEach((r) => Logic.addToArray(store[id].courses, r, (e) => e.id, (e) => e.createdAt))
			quizzes.results.forEach((r) => Logic.addToArray(store[id].quizzes, r, (e) => e.id, (e) => e.createdAt))
			store[id].fetched.value = true
		} catch (e) {
			await store[id].setError(e)
		}
		await store[id].setLoading(false)
	}

	onMounted(async () => {
		if (!store[id].fetched.value && !store[id].loading.value) await fetchUserAndMaterials()
	})

	return { ...store[id] }
}