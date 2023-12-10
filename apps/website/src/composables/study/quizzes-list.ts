import { Conditions, Logic, Quiz } from 'sofa-logic'
import { ComputedRef, Ref, computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useListener } from '../core/listener'
import { useErrorHandler, useLoadingHandler } from '../core/states'
import { useAuth } from '../auth/auth'

const store = {
	quizzes: ref<Quiz[]>([]),
	fetched: ref(false),
	...useLoadingHandler(),
	...useErrorHandler(),
	listener: useListener(async () => {
		const { id } = useAuth()
		return Logic.Common.listenToMany<Quiz>('study/quizzes', {
			created: async (entity) => {
				Logic.addToArray(store.quizzes.value, entity, (e) => e.id, (e) => e.createdAt)
			},
			updated: async (entity) => {
				Logic.addToArray(store.quizzes.value, entity, (e) => e.id, (e) => e.createdAt)
			},
			deleted: async (entity) => {
				store.quizzes.value = store.quizzes.value.filter((m) => m.id !== entity.id)
			}
		}, (e) => e.user.id === id.value)
	})
}

const tutorStore = {
	quizzes: ref<Quiz[]>([]),
	fetched: ref(false),
	...useLoadingHandler(),
	...useErrorHandler(),
	listener: useListener(async () => {
		const { id, isAdmin } = useAuth()
		if (!isAdmin.value) return () => {/**/}
		return Logic.Common.listenToMany<Quiz>('study/quizzes/tutors', {
			created: async (entity) => {
				Logic.addToArray(tutorStore.quizzes.value, entity, (e) => e.id, (e) => e.createdAt)
			},
			updated: async (entity) => {
				Logic.addToArray(tutorStore.quizzes.value, entity, (e) => e.id, (e) => e.createdAt)
			},
			deleted: async (entity) => {
				tutorStore.quizzes.value = tutorStore.quizzes.value.filter((m) => m.id !== entity.id)
			}
		}, (e) => e.user.id === id.value && e.isForTutors)
	})
}

const extraQuizzesStore = {
	quizzes: ref<Quiz[]>([]),
	...useLoadingHandler(),
	...useErrorHandler(),
}

export const useMyQuizzes = () => {
	const { id } = useAuth()

	const fetchQuizzes = async () => {
		try {
			await store.setError('')
			await store.setLoading(true)
			const quizzes = await Logic.Study.GetQuizzes({
				where: [{ field: 'user.id', value: id.value }],
				all: true
			})
			quizzes.results.forEach((r) => Logic.addToArray(store.quizzes.value, r, (e) => e.id, (e) => e.createdAt))
			store.fetched.value = true
		} catch (e) {
			await store.setError(e)
		}
		await store.setLoading(false)
	}

	onMounted(async () => {
		if (/* !store.fetched.value &&  */!store.loading.value) await fetchQuizzes()
		await store.listener.start()
	})
	onUnmounted(async () => {
		await store.listener.close()
	})

	const published = computed(() => store.quizzes.value
		.filter((m) => m.status === 'published'))
	const draft = computed(() => store.quizzes.value
		.filter((m) => m.status === 'draft'))

	return { ...store, published, draft }
}

export const useTutorQuizzes = () => {
	const { id, isAdmin } = useAuth()

	const fetchQuizzes = async () => {
		try {
			await tutorStore.setError('')
			await tutorStore.setLoading(true)
			const quizzes = await Logic.Study.GetTutorQuizzes({
				where: [{ field: 'user.id', value: id.value }],
				all: true
			})
			quizzes.results.forEach((r) => Logic.addToArray(tutorStore.quizzes.value, r, (e) => e.id, (e) => e.createdAt))
			tutorStore.fetched.value = true
		} catch (e) {
			await tutorStore.setError(e)
		}
		await tutorStore.setLoading(false)
	}

	onMounted(async () => {
		if (/* !tutorStore.fetched.value &&  */!tutorStore.loading.value && isAdmin.value) await fetchQuizzes()
		await tutorStore.listener.start()
	})
	onUnmounted(async () => {
		await tutorStore.listener.close()
	})

	return { ...tutorStore }
}

export const useQuizzesInList = (ids: Ref<string[]> | ComputedRef<string[]>) => {
	const allQuizzes = computed(() => [
		...store.quizzes.value,
		...tutorStore.quizzes.value,
		...extraQuizzesStore.quizzes.value
	])

	const unfetched = computed(() => ids.value.filter((id) => !filteredQuizzes.value.find((q) => q.id === id)))

	const filteredQuizzes = computed(() => allQuizzes.value.filter((q) => ids.value.includes(q.id)))

	watch(ids, async () => {
		const notFetched = [...new Set(unfetched.value)]
		try {
			await extraQuizzesStore.setError('')
			await extraQuizzesStore.setLoading(true)
			const quizzes = await Logic.Study.GetQuizzes({
				where: [{ field: 'id', value: notFetched, condition: Conditions.in }],
				all: true
			})
			quizzes.results.forEach((quiz) => extraQuizzesStore.quizzes.value.push(quiz))
		} catch (e) {
			await extraQuizzesStore.setError(e)
		}
		await extraQuizzesStore.setLoading(false)
	})

	return { quizzes: filteredQuizzes }
}