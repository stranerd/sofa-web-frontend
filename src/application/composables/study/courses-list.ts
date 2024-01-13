import { CourseEntity, CoursesUseCases } from '@modules/study'
import { addToArray } from 'valleyed'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useAuth } from '../auth/auth'
import { Refable, useAsyncFn, useItemsInList } from '../core/hooks'
import { useListener } from '../core/listener'
import { useMyPurchases } from '../payment/purchases'

const store = {
	courses: ref<CourseEntity[]>([]),
	fetched: ref(false),
	listener: useListener(async () => {
		const { id } = useAuth()
		return CoursesUseCases.listenToUserCourses(id.value, {
			created: async (entity) => {
				addToArray(
					store.courses.value,
					entity,
					(e) => e.id,
					(e) => e.createdAt,
				)
			},
			updated: async (entity) => {
				addToArray(
					store.courses.value,
					entity,
					(e) => e.id,
					(e) => e.createdAt,
				)
			},
			deleted: async (entity) => {
				store.courses.value = store.courses.value.filter((m) => m.id !== entity.id)
			},
		})
	}),
}

export const useMyCourses = () => {
	const { id } = useAuth()

	const {
		asyncFn: fetchCourses,
		loading,
		error,
	} = useAsyncFn(
		async () => {
			const courses = await CoursesUseCases.getUserCourses(id.value)
			courses.results.forEach((r) =>
				addToArray(
					store.courses.value,
					r,
					(e) => e.id,
					(e) => e.createdAt,
				),
			)
			store.fetched.value = true
		},
		{ key: 'study/courses/mine' },
	)

	onMounted(async () => {
		if (!store.fetched.value) await fetchCourses()
		await store.listener.start()
	})
	onUnmounted(async () => {
		await store.listener.close()
	})

	const published = computed(() => store.courses.value.filter((m) => m.isPublished))
	const draft = computed(() => store.courses.value.filter((m) => m.isDraft))

	return { ...store, loading, error, published, draft }
}

export const useMyPurchasedCourses = () => {
	const { purchasesCoursesIds } = useMyPurchases()
	const { courses: fetchedCourses } = useCoursesInList(purchasesCoursesIds)
	const courses = computed(() => purchasesCoursesIds.value.map((id) => fetchedCourses.value.find((c) => c.id === id)).filter(Boolean))
	return { courses }
}

export const useCoursesInList = (ids: Refable<string[]>, listen = false) => {
	const allCourses = computed(() => [...store.courses.value])

	const { items: courses, addToList } = useItemsInList('courses', ids, allCourses, (ids) => CoursesUseCases.getInList(ids))

	const listener = useListener(async () => {
		return await CoursesUseCases.listenToInList(() => ids.value, {
			created: addToList,
			updated: addToList,
			deleted: () => {
				/* */
			},
		})
	})

	onMounted(() => {
		if (listen) listener.start()
	})

	onUnmounted(() => {
		if (listen) listener.close()
	})

	return { courses }
}
