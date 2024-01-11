import { QuizEntity, QuizzesUseCases } from '@modules/study'
import { Logic } from 'sofa-logic'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useAuth } from '../auth/auth'
import { Refable, useAsyncFn, useItemsInList } from '../core/hooks'
import { useListener } from '../core/listener'

const store = {
	quizzes: ref<QuizEntity[]>([]),
	fetched: ref(false),
	listener: useListener(async () => {
		const { id } = useAuth()
		return QuizzesUseCases.listenToUserQuizzes(id.value, {
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
		})
	}),
}

const tutorStore = {
	quizzes: ref<QuizEntity[]>([]),
	fetched: ref(false),
	listener: useListener(async () => {
		const { id, isAdmin } = useAuth()
		if (!isAdmin.value)
			return () => {
				/**/
			}
		return QuizzesUseCases.listenToTutorQuizzes(id.value, {
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
		})
	}),
}

export const useMyQuizzes = () => {
	const { id } = useAuth()

	const {
		asyncFn: fetchQuizzes,
		loading,
		error,
	} = useAsyncFn(async () => {
		const quizzes = await QuizzesUseCases.getUserQuizzes(id.value)
		quizzes.results.forEach((r) =>
			Logic.addToArray(
				store.quizzes.value,
				r,
				(e) => e.id,
				(e) => e.createdAt,
			),
		)
		store.fetched.value = true
	})

	onMounted(async () => {
		if (!store.fetched.value) await fetchQuizzes()
		await store.listener.start()
	})
	onUnmounted(async () => {
		await store.listener.close()
	})

	const published = computed(() => store.quizzes.value.filter((m) => m.status === 'published'))
	const draft = computed(() => store.quizzes.value.filter((m) => m.status === 'draft'))

	return { ...store, loading, error, published, draft }
}

export const useTutorQuizzes = () => {
	const { id, isAdmin } = useAuth()

	const {
		asyncFn: fetchQuizzes,
		loading,
		error,
	} = useAsyncFn(async () => {
		const quizzes = await QuizzesUseCases.getTutorQuizzes(id.value)
		quizzes.results.forEach((r) =>
			Logic.addToArray(
				tutorStore.quizzes.value,
				r,
				(e) => e.id,
				(e) => e.createdAt,
			),
		)
		tutorStore.fetched.value = true
	})

	onMounted(async () => {
		if (!tutorStore.fetched.value && isAdmin.value) await fetchQuizzes()
		await tutorStore.listener.start()
	})
	onUnmounted(async () => {
		await tutorStore.listener.close()
	})

	return { ...tutorStore, loading, error }
}

export const useQuizzesInList = (ids: Refable<string[]>, listen = false) => {
	const allQuizzes = computed(() => [...store.quizzes.value, ...tutorStore.quizzes.value])

	const { items: quizzes, addToList } = useItemsInList('quizzes', ids, allQuizzes, (ids) => QuizzesUseCases.getInList(ids))

	const listener = useListener(async () => {
		return await QuizzesUseCases.listenToInList(() => ids.value, {
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

	return { quizzes }
}
