import { Quiz, Logic, Question } from 'sofa-logic'
import { Ref, onMounted, onUnmounted, ref, watch } from 'vue'
import { useListener } from '../core/listener'
import { useErrorHandler, useLoadingHandler } from '../core/states'

const store = {} as Record<string, {
	quiz: Ref<Quiz | null>
	questions: Ref<Question[]>
	fetched: Ref<boolean>
	listener: ReturnType<typeof useListener>
} & ReturnType<typeof useErrorHandler> & ReturnType<typeof useLoadingHandler>>

export const useQuiz = (id: string, skipQuestions = false) => {
	store[id] ??= {
		quiz: ref(null),
		questions: ref([]),
		fetched: ref(false),
		listener: useListener(async () => await Logic.Common.listenToOne<Quiz>(`study/quizzes/${id}`, {
			created: async (entity) => {
				store[id].quiz.value = entity
			},
			updated: async (entity) => {
				store[id].quiz.value = entity
			},
			deleted: async (entity) => {
				store[id].quiz.value = entity
			}
		})),
		...useErrorHandler(),
		...useLoadingHandler()
	}

	const fetchGame = async () => {
		await store[id].setError('')
		try {
			await store[id].setLoading(true)
			store[id].quiz.value = await Logic.Study.GetQuiz(id)
			store[id].fetched.value = true
		} catch (e) {
			await store[id].setError(e)
		}
		await store[id].setLoading(false)
	}

	watch(store[id].quiz, async () => {
		if (!store[id].quiz.value) return
		const hasUnfetchedQuestions = store[id].quiz.value.questions.some((qId) => !store[id].questions.value.find((q) => q.id === qId))
		if (!skipQuestions && hasUnfetchedQuestions) {
			const questions = await Logic.Study.GetQuestions(id, { all: true }).catch()
			store[id].questions.value = questions?.results ?? []
		}
	})

	onMounted(async () => {
		if (/* !store[id].fetched.value &&  */!store[id].loading.value) await fetchGame()
		await store[id].listener.start()
	})
	onUnmounted(async () => {
		await store[id].listener.close()
	})

	return {
		...store[id]
	}
}