import { Conditions, Course, Differ, Logic } from 'sofa-logic'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useAuth } from '../auth/auth'
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

const purchasedStore = {
	courses: ref<Course[]>([]),
	...useLoadingHandler(),
	...useErrorHandler(),
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
	const { purchases } = useMyPurchases()

	const purchasesCoursesIds = computed(() => purchases
		.filter((p) => p.data.type === 'courses')
		.map((p) => p.data.id))

	watch(purchases, async () => {
		const sortedPurchasesIds = purchasesCoursesIds.value.sort()
		const fetchedCoursesIds = purchasedStore.courses.value.map((c) => c.id).sort()
		if (Differ.equal(sortedPurchasesIds, fetchedCoursesIds)) return
		await purchasedStore.setError('')
		await purchasedStore.setLoading(true)
		try {
			const courses = await Logic.Study.GetCourses({
				where: [{ field: 'id', value: purchasesCoursesIds.value, condition: Conditions.in }],
				all: true
			})
			purchasedStore.courses.value = courses.results
		} catch (e) {
			await purchasedStore.setError(e)
		}
		await purchasedStore.setLoading(false)
	})

	const courses = computed(() => purchasesCoursesIds.value
		.map((id) => purchasedStore.courses.value.find((c) => c.id === id))
		.filter(Boolean))

	return { ...purchasedStore, courses }
}