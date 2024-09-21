import { Ref, computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../auth/auth'
import { Refable, useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'
import { useModals } from '../core/modals'
import { useSuccessHandler } from '../core/states'
import { createStore } from '../core/store'
import { useFilesInList } from './files-list'
import { useQuizzesInList } from './quizzes-list'
import {
	Coursable,
	CourseEntity,
	CourseFactory,
	CourseSectionsFactory,
	CoursesUseCases,
	ExtendedCourseSections,
	FileType,
	QuizModes,
} from '@modules/study'

const store = createStore(
	<
		Record<
			string,
			{
				course: Ref<CourseEntity | null>
				listener: ReturnType<typeof useListener>
			}
		>
	>{},
	'study/courses',
)

export const useCourse = (id: string) => {
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
	const router = useRouter()
	const { auth } = useAuth()
	const factory = new CourseFactory(auth.value?.roles.isVerified ?? false)
	const {
		asyncFn: createCourse,
		loading,
		error,
	} = useAsyncFn(async () => {
		const course = await CoursesUseCases.add(factory)
		const sectionsFactory = new CourseSectionsFactory()
		sectionsFactory.loadEntity([
			{ items: [], label: 'Introduction' },
			{ items: [], label: 'Section 1' },
		])
		const updated = await CoursesUseCases.updateSections(course.id, sectionsFactory)
		await router.push(`/study/courses/${updated.id}/edit`)
		factory.reset()
		return updated
	})

	return { factory, createCourse, error, loading }
}

export const useEditCourse = (id: string) => {
	const { auth } = useAuth()
	const router = useRouter()
	const { course, fetched } = useCourse(id)
	const factory = new CourseFactory(auth.value?.roles.isVerified ?? false)
	const { setMessage } = useSuccessHandler()

	watch(
		course,
		() => {
			if (course.value) factory.loadEntity(course.value)
		},
		{ immediate: true },
	)

	const { asyncFn: updateCourse } = useAsyncFn(async () => {
		await CoursesUseCases.update(id, factory)
		await setMessage('Course updated')
		factory.reset()
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
				await $utils.confirm({
					title: 'Are you sure?',
					sub: "This action is permanent. After publishing a course, you won't be able to remove its contents again. However, you can add new and edit existing content.",
					right: { label: 'Yes, publish', color: 'blue' },
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
				await $utils.confirm({
					title: 'Are you sure?',
					sub: 'This action is permanent.',
					right: { label: 'Yes, delete' },
				}),
		},
	)

	return {
		course,
		fetched,
		factory,
		updateCourse,
		publishCourse,
		deleteCourse,
	}
}

export const useCourseSections = (sects: Refable<CourseEntity['sections']>) => {
	const quizIds = computed(() =>
		sects.value.flatMap((c) => c.items.filter((item) => item.type === Coursable.quiz).map((item) => item.id)),
	)
	const fileIds = computed(() =>
		sects.value.flatMap((c) => c.items.filter((item) => item.type === Coursable.file).map((item) => item.id)),
	)

	const { quizzes } = useQuizzesInList(quizIds)
	const { files } = useFilesInList(fileIds)

	const sections = computed<ExtendedCourseSections>(() =>
		sects.value.map((c, sectionIndex) => {
			const items = c.items
				.map((item, itemIndex) => {
					if (item.type === Coursable.file) {
						const file = files.value.find((f) => f.id === item.id)
						if (file)
							return {
								...item,
								file,
								title: file.title,
								image: file.picture,
								icon:
									file.type === FileType.document
										? ('file-document' as IconName)
										: file.type === FileType.image
											? ('file-image' as IconName)
											: ('file-video' as IconName),
								info: file.type,
								color: file.type === FileType.document ? '#3296C8' : file.type === FileType.image ? '#AF19C8' : '#4BAF7D',
								sectionIndex,
								itemIndex,
							}
					}
					if (item.type === Coursable.quiz) {
						const quiz = quizzes.value.find((q) => q.id === item.id)
						if (quiz)
							return {
								...item,
								quiz,
								title: quiz.title,
								image: quiz.picture,
								icon: item.quizMode === QuizModes.practice ? ('quiz-practice' as IconName) : ('quiz-tests' as IconName),
								info: `${item.quizMode} - ${$utils.formatNumber(quiz.questions.length)} ${$utils.pluralize(quiz.questions.length, 'question', 'questions')}`,
								color: item.quizMode === QuizModes.practice ? '#FF4BC8' : '#6419C8',
								sectionIndex,
								itemIndex,
							}
					}
				})
				.filter(Boolean)
			return { label: c.label, items }
		}),
	)
	return { quizzes, files, sections }
}

export const useUpdateSections = (course: Refable<CourseEntity | null>) => {
	const factory = new CourseSectionsFactory()
	if (course.value) factory.loadEntity(course.value.sections)

	watch(course, (course) => {
		factory.loadEntity(course?.sections ?? [])
	})

	const {
		asyncFn: updateSections,
		loading,
		error,
	} = useAsyncFn(async () => {
		if (!course.value) return false
		const updatedCourse = await CoursesUseCases.updateSections(course.value.id, factory)
		factory.loadEntity(updatedCourse.sections)
		return true
	})

	const factories = computed(() => factory.factories)
	const { sections } = useCourseSections(factories)

	return {
		factory,
		loading,
		error,
		sections,
		updateSections,
	}
}
