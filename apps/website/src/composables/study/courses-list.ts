import { Conditions, Course, Logic } from 'sofa-logic'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useAuth } from '../auth/auth'
import { Refable, useItemsInList } from '../core/hooks'
import { useListener } from '../core/listener'
import { useErrorHandler, useLoadingHandler } from '../core/states'
import { useMyPurchases } from '../payment/purchases'

const store = {
	courses: ref<Course[]>([]),
	fetched: ref(false),
	...useLoadingHandler(),
	...useErrorHandler(),
	listener: useListener(async () => {
		const { id } = useAuth()
		return Logic.Common.listenToMany<Course>('study/courses', {
			created: async (entity) => {
				Logic.addToArray(store.courses.value, entity, (e) => e.id, (e) => e.createdAt)
			},
			updated: async (entity) => {
				Logic.addToArray(store.courses.value, entity, (e) => e.id, (e) => e.createdAt)
			},
			deleted: async (entity) => {
				store.courses.value = store.courses.value.filter((m) => m.id !== entity.id)
			}
		}, (e) => e.user.id === id.value)
	})
}


export const useMyCourses = () => {
	const { id } = useAuth()

	const fetchCourses = async () => {
		try {
			await store.setError('')
			await store.setLoading(true)
			const courses = await Logic.Study.GetCourses({
				where: [{ field: 'user.id', value: id.value }],
				all: true
			})
			courses.results.forEach((r) => Logic.addToArray(store.courses.value, r, (e) => e.id, (e) => e.createdAt))
			store.fetched.value = true
		} catch (e) {
			await store.setError(e)
		}
		await store.setLoading(false)
	}

	onMounted(async () => {
		if (/* !store.fetched.value &&  */!store.loading.value) await fetchCourses()
		await store.listener.start()
	})
	onUnmounted(async () => {
		await store.listener.close()
	})

	const published = computed(() => store.courses.value
		.filter((m) => m.status === 'published'))
	const draft = computed(() => store.courses.value
		.filter((m) => m.status === 'draft'))

	return { ...store, published, draft }
}

export const useMyPurchasedCourses = () => {
	const { purchasesCoursesIds } = useMyPurchases()
	const { courses: fetchedCourses } = useCoursesInList(purchasesCoursesIds)
	const courses = computed(() => purchasesCoursesIds.value
		.map((id) => fetchedCourses.value.find((c) => c.id === id))
		.filter(Boolean))
	return { courses }
}


export const useCoursesInList = (ids: Refable<string[]>, listen = false) => {
	const allCourses = computed(() => [...store.courses.value])

	const { items: courses, addToList } = useItemsInList('courses', ids, allCourses, async (notFetched: string[]) => {
		const courses = await Logic.Study.GetCourses({
			where: [{ field: 'id', value: notFetched, condition: Conditions.in }],
			all: true
		})
		return courses.results
	})

	const listener = useListener(async () => {
		return await Logic.Common.listenToMany<Course>('study/courses', {
			created: addToList, updated: addToList, deleted: () => {/* */}
		},  (e) => ids.value.includes(e.id))
	})

	onMounted(() => {
		if (listen) listener.start()
	})

	onUnmounted(() => {
		if (listen) listener.close()
	})

	return { courses }
}