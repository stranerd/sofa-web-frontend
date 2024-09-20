import { addToArray } from 'valleyed'
import { Ref, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'
import { createStore } from '../core/store'
import { UserEntity, UsersUseCases } from '@modules/users'
import { CourseEntity, CoursesUseCases, QuizEntity, QuizzesUseCases } from '@modules/study'

const store = createStore(
	<
		Record<
			string,
			{
				user: Ref<UserEntity | null>
				quizzes: QuizEntity[]
				courses: CourseEntity[]
			}
		>
	>{},
	'study/users-materials',
)

export const useUsersMaterials = (id: string) => {
	store[id] ??= {
		user: ref(null),
		quizzes: reactive([]),
		courses: reactive([]),
	}

	const listener = useListener(async () => {
		const listeners = await Promise.all([
			CoursesUseCases.listenToUserPublicCourses(id, {
				created: async (entity) => {
					addToArray(
						store[id].courses,
						entity,
						(e) => e.id,
						(e) => e.createdAt,
					)
				},
				updated: async (entity) => {
					addToArray(
						store[id].courses,
						entity,
						(e) => e.id,
						(e) => e.createdAt,
					)
				},
				deleted: async (entity) => {
					store[id].courses = store[id].courses.filter((m) => m.id !== entity.id)
				},
			}),
			QuizzesUseCases.listenToUserPublicQuizzes(id, {
				created: async (entity) => {
					addToArray(
						store[id].quizzes,
						entity,
						(e) => e.id,
						(e) => e.createdAt,
					)
				},
				updated: async (entity) => {
					addToArray(
						store[id].quizzes,
						entity,
						(e) => e.id,
						(e) => e.createdAt,
					)
				},
				deleted: async (entity) => {
					store[id].quizzes = store[id].quizzes.filter((m) => m.id !== entity.id)
				},
			}),
		])
		return () => listeners.map((l) => l())
	})

	const {
		asyncFn: fetchUserAndMaterials,
		loading,
		error,
		called,
	} = useAsyncFn(
		async () => {
			store[id].user.value = await UsersUseCases.find(id)
			const [courses, quizzes] = await Promise.all([
				await CoursesUseCases.getUserPublicCourses(id),
				await QuizzesUseCases.getUserPublicQuizzes(id),
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
		await listener.start()
	})
	onUnmounted(async () => {
		await listener.close()
	})

	return { ...store[id], loading, error }
}
