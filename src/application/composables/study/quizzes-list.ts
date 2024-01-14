import { QuizEntity, QuizzesUseCases } from '@modules/study'
import { addToArray } from 'valleyed'
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
				addToArray(
					store.quizzes.value,
					entity,
					(e) => e.id,
					(e) => e.createdAt,
				)
			},
			updated: async (entity) => {
				addToArray(
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
				addToArray(
					tutorStore.quizzes.value,
					entity,
					(e) => e.id,
					(e) => e.createdAt,
				)
			},
			updated: async (entity) => {
				addToArray(
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
	} = useAsyncFn(
		async () => {
			const quizzes = await QuizzesUseCases.getUserQuizzes(id.value)
			quizzes.results.forEach((r) =>
				addToArray(
					store.quizzes.value,
					r,
					(e) => e.id,
					(e) => e.createdAt,
				),
			)
			store.fetched.value = true
		},
		{ key: 'study/quizzes/mine' },
	)

	onMounted(async () => {
		if (!store.fetched.value) await fetchQuizzes()
		await store.listener.start()
	})
	onUnmounted(async () => {
		await store.listener.close()
	})

	const published = computed(() => store.quizzes.value.filter((m) => m.isPublished))
	const draft = computed(() => store.quizzes.value.filter((m) => m.isDraft))

	return { ...store, loading, error, published, draft }
}

export const useTutorQuizzes = () => {
	const { id, isAdmin } = useAuth()

	const {
		asyncFn: fetchQuizzes,
		loading,
		error,
	} = useAsyncFn(
		async () => {
			const quizzes = await QuizzesUseCases.getTutorQuizzes(id.value)
			quizzes.results.forEach((r) =>
				addToArray(
					tutorStore.quizzes.value,
					r,
					(e) => e.id,
					(e) => e.createdAt,
				),
			)
			tutorStore.fetched.value = true
		},
		{ key: 'study/quizzes/tutor/mine' },
	)

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