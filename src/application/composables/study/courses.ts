import { Ref, computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'
import { useModals } from '../core/modals'
import { useSuccessHandler } from '../core/states'
import { useFilesInList } from './files-list'
import { useQuizzesInList } from './quizzes-list'
import { Logic } from 'sofa-logic'
import { Coursable, CourseEntity, CourseFactory, CoursesUseCases } from '@modules/study'

const store = {} as Record<
	string,
	{
		course: Ref<CourseEntity | null>
		listener: ReturnType<typeof useListener>
	}
>

export const useCourse = (id: string, skip: { items?: boolean }) => {
	store[id] ??= {
		course: ref(null),
		listener: useListener(
			async () =>
				await CoursesUseCases.listenToOne(id, {
					created: async (entity) => {
						store[id].course.value = entity
					},
					updated: async (entity) => {
						store[id].course.value = entity
					},
					deleted: async (entity) => {
						store[id].course.value = entity
					},
				}),
		),
	}

	const { quizzes } = useQuizzesInList(
		computed(() => (!skip.items ? store[id].course.value?.quizzesIds ?? [] : [])),
		!skip.items,
	)

	const { files } = useFilesInList(
		computed(() => (!skip.items ? store[id].course.value?.filesIds ?? [] : [])),
		!skip.items,
	)

	const sections = computed(
		() =>
			store[id].course.value?.sections.map((section) => {
				const items = section.items
					.map((item) => {
						if (item.type === Coursable.file) {
							const file = files.value.find((f) => f.id === item.id)
							if (file) return { ...item, type: Coursable.file as const, file }
						}
						if (item.type === Coursable.quiz) {
							const quiz = quizzes.value.find((q) => q.id === item.id)
							if (quiz) return { ...item, type: Coursable.quiz as const, quiz }
						}
					})
					.filter(Boolean)
				return { label: section.label, items }
			}) ?? [],
	)

	const { asyncFn: fetchCourse, called } = useAsyncFn(
		async () => {
			store[id].course.value = await CoursesUseCases.find(id)
		},
		{ key: `study/courses/${id}` },
	)

	onMounted(async () => {
		if (!called.value) await fetchCourse()
		await store[id].listener.start()
	})
	onUnmounted(async () => {
		await store[id].listener.close()
	})

	return { ...store[id], fetched: called, sections }
}

export const useCreateCourse = () => {
	const {
		asyncFn: createCourse,
		loading,
		error,
	} = useAsyncFn(async () => {
		const factory = new CourseFactory()
		const course = await CoursesUseCases.add(factory)
		return await CoursesUseCases.updateSections(course.id, [
			{ items: [], label: 'Introduction' },
			{ items: [], label: 'Section 1' },
		])
	})

	return { createCourse, error, loading }
}

export const useEditCourse = (id: string) => {
	const router = useRouter()
	const { course, fetched } = useCourse(id, {})
	const courseFactory = new CourseFactory()
	const { setMessage } = useSuccessHandler()

	watch(
		course,
		() => {
			if (course.value) courseFactory.loadEntity(course.value)
		},
		{ immediate: true },
	)

	const { asyncFn: updateCourse } = useAsyncFn(async () => {
		await CoursesUseCases.update(id, courseFactory)
		await setMessage('Course updated')
		await courseFactory.reset()
		useModals().study.editCourse.close()
	})

	const { asyncFn: publishCourse } = useAsyncFn(
		async () => {
			if (course.value?.isPublished) return true
			await CoursesUseCases.publish(id)
			await setMessage('Course published')
			useModals().study.editCourse.close()
		},
		{
			pre: async () =>
				await Logic.Common.confirm({
					title: 'Are you sure?',
					sub: "This action is permanent. After publishing a course, you won't be able to remove its content again. However, you can add new and edit existing content.",
					right: { label: 'Yes, publish', bg: 'bg-primaryBlue' },
				}),
		},
	)

	const { asyncFn: deleteCourse } = useAsyncFn(
		async () => {
			await CoursesUseCases.delete(id)
			await router.push('/library')
		},
		{
			pre: async () =>
				await Logic.Common.confirm({
					title: 'Are you sure?',
					sub: 'This action is permanent.',
					right: { label: 'Yes, delete' },
				}),
		},
	)

	return {
		course,
		fetched,
		courseFactory,
		updateCourse,
		publishCourse,
		deleteCourse,
	}
}
