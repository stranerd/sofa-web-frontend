import { Conditions, Logic, Quiz } from 'sofa-logic'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useAuth } from '../auth/auth'
import { Refable, useItemsInList } from '../core/hooks'
import { useListener } from '../core/listener'
import { useErrorHandler, useLoadingHandler } from '../core/states'

const store = {
	quizzes: ref<Quiz[]>([]),
	fetched: ref(false),
	...useLoadingHandler(),
	...useErrorHandler(),
	listener: useListener(async () => {
		const { id } = useAuth()
		return Logic.Common.listenToMany<Quiz>(
			'study/quizzes',
			{
				created: async (entity) => {
					Logic.addToArray(
						store.quizzes.value,
						entity,
						(e) => e.id,
						(e) => e.createdAt,
					)
				},
				updated: async (entity) => {
					Logic.addToArray(
						store.quizzes.value,
						entity,
						(e) => e.id,
						(e) => e.createdAt,
					)
				},
				deleted: async (entity) => {
					store.quizzes.value = store.quizzes.value.filter((m) => m.id !== entity.id)
				},
			},
			(e) => e.user.id === id.value,
		)
	}),
}

const tutorStore = {
	quizzes: ref<Quiz[]>([]),
	fetched: ref(false),
	...useLoadingHandler(),
	...useErrorHandler(),
	listener: useListener(async () => {
		const { id, isAdmin } = useAuth()
		if (!isAdmin.value)
			return () => {
				/**/
			}
		return Logic.Common.listenToMany<Quiz>(
			'study/quizzes/tutors',
			{
				created: async (entity) => {
					Logic.addToArray(
						tutorStore.quizzes.value,
						entity,
						(e) => e.id,
						(e) => e.createdAt,
					)
				},
				updated: async (entity) => {
					Logic.addToArray(
						tutorStore.quizzes.value,
						entity,
						(e) => e.id,
						(e) => e.createdAt,
					)
				},
				deleted: async (entity) => {
					tutorStore.quizzes.value = tutorStore.quizzes.value.filter((m) => m.id !== entity.id)
				},
			},
			(e) => e.user.id === id.value && e.isForTutors,
		)
	}),
}

export const useMyQuizzes = () => {
	const { id } = useAuth()

	const fetchQuizzes = async () => {
		try {
			await store.setError('')
			await store.setLoading(true)
			const quizzes = await Logic.Study.GetQuizzes({
				where: [{ field: 'user.id', value: id.value }],
				all: true,
			})
			quizzes.results.forEach((r) =>
				Logic.addToArray(
					store.quizzes.value,
					r,
					(e) => e.id,
					(e) => e.createdAt,
				),
			)
			store.fetched.value = true
		} catch (e) {
			await store.setError(e)
		}
		await store.setLoading(false)
	}

	onMounted(async () => {
		if (/* !store.fetched.value &&  */ !store.loading.value) await fetchQuizzes()
		await store.listener.start()
	})
	onUnmounted(async () => {
		await store.listener.close()
	})

	const published = computed(() => store.quizzes.value.filter((m) => m.status === 'published'))
	const draft = computed(() => store.quizzes.value.filter((m) => m.status === 'draft'))

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
				all: true,
			})
			quizzes.results.forEach((r) =>
				Logic.addToArray(
					tutorStore.quizzes.value,
					r,
					(e) => e.id,
					(e) => e.createdAt,
				),
			)
			tutorStore.fetched.value = true
		} catch (e) {
			await tutorStore.setError(e)
		}
		await tutorStore.setLoading(false)
	}

	onMounted(async () => {
		if (/* !tutorStore.fetched.value &&  */ !tutorStore.loading.value && isAdmin.value) await fetchQuizzes()
		await tutorStore.listener.start()
	})
	onUnmounted(async () => {
		await tutorStore.listener.close()
	})

	return { ...tutorStore }
}

export const useQuizzesInList = (ids: Refable<string[]>, listen = false) => {
	const allQuizzes = computed(() => [...store.quizzes.value, ...tutorStore.quizzes.value])

	const { items: quizzes, addToList } = useItemsInList('quizzes', ids, allQuizzes, async (notFetched: string[]) => {
		const quizzes = await Logic.Study.GetQuizzes({
			where: [{ field: 'id', value: notFetched, condition: Conditions.in }],
			all: true,
		})
		return quizzes.results
	})

	const listener = useListener(async () => {
		return await Logic.Common.listenToMany<Quiz>(
			'study/quizzes',
			{
				created: addToList,
				updated: addToList,
				deleted: () => {
					/* */
				},
			},
			(e) => ids.value.includes(e.id),
		)
	})

	onMounted(() => {
		if (listen) listener.start()
	})

	onUnmounted(() => {
		if (listen) listener.close()
	})

	return { quizzes }
}
