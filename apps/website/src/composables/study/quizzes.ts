import { Quiz, Logic, Question, SingleUser, Conditions, CreateQuestionInput } from 'sofa-logic'
import { Ref, computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useListener } from '../core/listener'
import { useErrorHandler, useLoadingHandler, useSuccessHandler } from '../core/states'
import { useRouter } from 'vue-router'

const store = {} as Record<string, {
	quiz: Ref<Quiz | null>
	members: Ref<SingleUser[]>
	questions: Ref<Question[]>
	fetched: Ref<boolean>
	listener: ReturnType<typeof useListener>
	membersListener: ReturnType<typeof useListener>
} & ReturnType<typeof useErrorHandler> & ReturnType<typeof useLoadingHandler> & ReturnType<typeof useSuccessHandler>>

export const useQuiz = (id: string, skip: { questions: boolean, members: boolean }) => {
	store[id] ??= {
		quiz: ref(null),
		members: ref([]),
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
		membersListener: useListener(async () => {
			const members = [...store[id].quiz.value?.access.members ?? [], ...store[id].quiz.value?.access.requests ?? []]
			return await Logic.Common.listenToMany<SingleUser>('users/users', {
				created: async (entity) => {
					Logic.addToArray(store[id].members.value, entity, (e) => e.id, (e) => e.id)
				},
				updated: async (entity) => {
					Logic.addToArray(store[id].members.value, entity, (e) => e.id, (e) => e.id)
				},
				deleted: async (entity) => {
					store[id].members.value = store[id].members.value.filter((u) => u.id !== entity.id)
				}
			},  (e) => members.includes(e.id))
		}),
		...useErrorHandler(),
		...useLoadingHandler(),
		...useSuccessHandler(),
	}

	const router = useRouter()

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

	const reorderQuestions = async (questions: string[]) => {
		await store[id].setError('')
		try {
			await store[id].setLoading(true)
			store[id].quiz.value = await Logic.Study.ReorderQuizQuestions(id, { questions })
		} catch (e) {
			await store[id].setError(e)
		}
		await store[id].setLoading(false)
	}

	const deleteQuestion = async (questionId: string) => {
		if (store[id].quiz.value?.status === "published") return Logic.Common.showAlert({
			message: "You cannot delete questions from published quiz",
			type: "warning",
		})

		await store[id].setError('')
		try {
			await store[id].setLoading(true)
			await Logic.Study.DeleteQuestion(questionId, id)
			await store[id].setMessage('Question has been deleted.')
		} catch (e) {
			await store[id].setError(e)
		}
		await store[id].setLoading(false)
	}

	const addQuestion = async (type: Question['strippedData']['type']) => {
		await store[id].setError('')
		try {
			await store[id].setLoading(true)
			const data = Logic.Study.getQuestionTypeTemplate(type)
			await Logic.Study.CreateQuestion(id, data)
		} catch (e) {
			await store[id].setError(e)
		}
		await store[id].setLoading(false)
	}

	const saveQuestion = async (questionId: string, data: CreateQuestionInput) => {
		await store[id].setError('')
		try {
			await store[id].setLoading(true)
			await Logic.Study.UpdateQuestion(id, questionId, data)
			await store[id].setMessage('Question saved')
		} catch (e) {
			await store[id].setError(e)
		}
		await store[id].setLoading(false)
	}

	const duplicateQuestion = async (question: Question) => {
		await store[id].setError('')
		try {
			await store[id].setLoading(true)
			await Logic.Study.CreateQuestion(id, question)
			await store[id].setMessage('Question duplicated')
		} catch (e) {
			await store[id].setError(e)
		}
		await store[id].setLoading(false)
	}

	const deleteQuiz = async () => {
		await store[id].setError('')
		try {
			await store[id].setLoading(true)
			await Logic.Study.DeleteQuiz(id)
			await router.push('/library')
		} catch (e) {
			await store[id].setError(e)
		}
		await store[id].setLoading(false)
	}

	const members = computed(() => store[id].members.value.filter((m) => store[id].quiz.value?.access.members.includes(m.id)))
	const requests = computed(() => store[id].members.value.filter((m) => store[id].quiz.value?.access.requests.includes(m.id)))

	watch(store[id].quiz, async () => {
		if (!store[id].quiz.value) return
		const hasUnfetchedQuestions = store[id].quiz.value.questions.some((qId) => !store[id].questions.value.find((q) => q.id === qId))
		if (!skip.questions && hasUnfetchedQuestions) Logic.Study.GetQuestions(id, { all: true })
			.then((res) => {
				store[id].questions.value = res?.results ?? []
			}).catch()
		const members = [...store[id].quiz.value.access.members, ...store[id].quiz.value.access.requests]
		const hasUnfetchedMembers = members.some((id) => !store[id].members.value.find((u) => u.id === id))
		if (!skip.members && hasUnfetchedMembers)  Logic.Users.GetUsers({
				where: [{ field: 'id', value: members, condition: Conditions.in }],
				all: true
			}, false).then(async (users) => {
				users.forEach((u) => {
					Logic.addToArray(store[id].members.value, u, (e) => e.id, (e) => e.id)
				})
				await store[id].membersListener.restart()
			}).catch()
	})

	onMounted(async () => {
		if (/* !store[id].fetched.value &&  */!store[id].loading.value) await fetchGame()
		await store[id].listener.start()
	})
	onUnmounted(async () => {
		await store[id].listener.close()
		if (!skip.members) await store[id].membersListener.close()
	})

	return {
		...store[id],
		members,
		requests,
		reorderQuestions,
		deleteQuestion,
		duplicateQuestion,
		addQuestion,
		saveQuestion,
		deleteQuiz,
	}
}

export const useCreateQuiz = () => {
	const { error, setError } = useErrorHandler()
	const { loading, setLoading } = useLoadingHandler()

	const createQuiz = async () => {
		await setError('')
		try {
			await setLoading(true)
			const quiz = await Logic.Study.CreateQuiz({
				title: 'Untitled Quiz',
				description: 'Here is the quiz description',
				photo: null,
				courseId: null,
				tags: [],
				isForTutors: false,
				topic: 'Physics',
			})
			await Promise.all(
				[Logic.Study.getQuestionTypeTemplate('multipleChoice'), Logic.Study.getQuestionTypeTemplate('trueOrFalse')]
					.map((q) => Logic.Study.CreateQuestion(quiz.id, q))
			).catch()
			await setLoading(false)
			return quiz.id
		} catch (e) {
			await setLoading(false)
			await setError(e)
			return null
		}
	}

	return { createQuiz, error, loading }
}
