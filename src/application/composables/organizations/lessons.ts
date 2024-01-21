import { LessonFactory, LessonsUseCases } from '@modules/organizations'
import { onMounted, onUnmounted } from 'vue'
import { useAsyncFn } from '../core/hooks'
import { useModals } from '../core/modals'

export const useMyLessons = (organizationId: string, classId: string) => {
	const key = `${organizationId}-${classId}`
	const {
		asyncFn: fetchLessons,
		loading,
		error,
		called,
	} = useAsyncFn(
		async () => {
			// const lessons = await LessonsUseCases.getAll(organizationId, classId)
			// console.log(lessons)
		},
		{ key: `organizations/classes/${key}/lessons` },
	)

	onMounted(async () => {
		if (!called.value) await fetchLessons()
		// await store[key].listener.restart()
	})

	onUnmounted(async () => {
		// await store[key].listener.close()
	})

	return { fetchLessons, loading, error, called }
}

export const useCreateLesson = (organizationId: string, classId: string) => {
	const factory = new LessonFactory()
	const {
		asyncFn: createLesson,
		loading,
		error,
	} = useAsyncFn(async () => {
		await LessonsUseCases.add(organizationId, classId, factory)
		factory.reset()
		useModals().organizations.createLesson.close()
	})
	return {
		factory,
		loading,
		error,
		createLesson,
	}
}
