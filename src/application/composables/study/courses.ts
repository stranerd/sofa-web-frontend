import { Ref, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'
import { useModals } from '../core/modals'
import { useSuccessHandler } from '../core/states'
import { Logic } from 'sofa-logic'
import { CoursableAccess, CourseEntity, CourseFactory, CoursesUseCases } from '@modules/study'

const store = {} as Record<
	string,
	{
		course: Ref<CourseEntity | null>
		listener: ReturnType<typeof useListener>
	}
>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useCourse = (id: string, skip: { items?: boolean }, access: CoursableAccess['access']) => {
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

	return { ...store[id], fetched: called }
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
	const { course, fetched } = useCourse(id, {}, {})
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
