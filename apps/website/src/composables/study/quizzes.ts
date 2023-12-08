import { Quiz, Logic, Question, SingleUser, Conditions, CreateQuestionInput, CreateQuizInput } from 'sofa-logic'
import { Ref, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useListener } from '../core/listener'
import { useErrorHandler, useLoadingHandler, useSuccessHandler } from '../core/states'
import { useRouter } from 'vue-router'
import { useAuth } from '../auth/auth'

const store = {} as Record<string, {
	quiz: Ref<Quiz | null>
	members: SingleUser[]
	questions: Question[]
	fetched: Ref<boolean>
	listener: ReturnType<typeof useListener>
	membersListener: ReturnType<typeof useListener>
	questionsListener: ReturnType<typeof useListener>
} & ReturnType<typeof useErrorHandler> & ReturnType<typeof useLoadingHandler> & ReturnType<typeof useSuccessHandler>>

export const useQuiz = (id: string, skip: { questions: boolean, members: boolean }) => {
	store[id] ??= {
		quiz: ref(null),
		members: reactive([]),
		questions: reactive([]),
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
			const members = [store[id].quiz.value?.user.id, ...store[id].quiz.value?.access.members ?? [], ...store[id].quiz.value?.access.requests ?? []]
			return await Logic.Common.listenToMany<SingleUser>('users/users', {
				created: async (entity) => {
					Logic.addToArray(store[id].members, entity, (e) => e.id, (e) => e.id)
				},
				updated: async (entity) => {
					Logic.addToArray(store[id].members, entity, (e) => e.id, (e) => e.id)
				},
				deleted: async (entity) => {
					const index = store[id].members.findIndex((u) => u.id === entity.id)
					if (index !== -1 ) store[id].members.splice(index, 1)
				}
			},  (e) => members.includes(e.id))
		}),
		questionsListener: useListener(async () => {
			return await Logic.Common.listenToMany<Question>(`study/quizzes/${id}/questions`, {
				created: async (entity) => {
					Logic.addToArray(store[id].questions, entity, (e) => e.id, (e) => e.id)
				},
				updated: async (entity) => {
					Logic.addToArray(store[id].questions, entity, (e) => e.id, (e) => e.id)
				},
				deleted: async (entity) => {
					const index = store[id].questions.findIndex((u) => u.id === entity.id)
					if (index !== -1 ) store[id].questions.splice(index, 1)
				}
			}, (e) => store[id].quiz.value?.questions.includes(e.id))
		}),
		...useErrorHandler(),
		...useLoadingHandler(),
		...useSuccessHandler(),
	}

	const router = useRouter()
	const { id: authId } = useAuth()

	const fetchQuiz = async () => {
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

	const updateQuiz = async (data: CreateQuizInput) => {
		let succeeded = false
		await store[id].setError('')
		try {
			await store[id].setLoading(true)
			await Logic.Study.UpdateQuiz(id, data)
			await store[id].setMessage('Quiz saved')
			succeeded = true
		} catch (e) {
			await store[id].setError(e)
		}
		await store[id].setLoading(false)
		return succeeded
	}

	const publishQuiz = async () => {
		if (store[id].quiz.value?.status === 'published') return true
		let succeeded = false
		await store[id].setError('')
		try {
			await store[id].setLoading(true)
			await Logic.Study.PublishQuiz(id)
			await store[id].setMessage('Quiz published')
			succeeded = true
		} catch (e) {
			await store[id].setError(e)
		}
		await store[id].setLoading(false)
		return succeeded
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

	const requestAccess = async (add: boolean) => {
		if (store[id].quiz.value?.user.id === authId.value) return
		if (store[id].quiz.value?.access.members.includes(authId.value)) return
		if (add && store[id].quiz.value?.access.requests.includes(authId.value)) return
		if (!add && !store[id].quiz.value?.access.requests.includes(authId.value)) return
		await store[id].setError('')
		try {
			await store[id].setLoading(true)
			await Logic.Study.requestAccess(id, add)
			await store[id].setMessage('Request sent')
		} catch (e) {
			await store[id].setError(e)
		}
		await store[id].setLoading(false)
	}

	const grantAccess = async (userId: string, grant: boolean) => {
		await store[id].setError('')
		try {
			await store[id].setLoading(true)
			await Logic.Study.grantAccess(id, userId, grant)
		} catch (e) {
			await store[id].setError(e)
		}
		await store[id].setLoading(false)
	}

	const manageMembers = async (userIds: string[], grant: boolean) => {
		await store[id].setError('')
		try {
			await store[id].setLoading(true)
			await Logic.Study.manageMembers(id, userIds, grant)
		} catch (e) {
			await store[id].setError(e)
		}
		await store[id].setLoading(false)
	}

	watch(store[id].quiz, async (cur, old) => {
		if (!cur) return
		if (!skip.questions && !Logic.Differ.equal(cur?.questions, old?.questions)) Logic.Study.GetQuestions(id, { all: true })
			.then(async (res) => {
				store[id].questions.splice(0, store[id].questions.length, ...(res?.results ?? []))
				await store[id].questionsListener.restart()
			}).catch()
		const oldMembers = [...(old?.access.members ?? []), old?.user.id, ...(old?.access.requests) ?? []]
		const newMembers = [...(cur.access.members ?? []), cur?.user.id, ...(cur?.access.requests) ?? []]
		if (!skip.members && !Logic.Differ.equal(newMembers, oldMembers))  Logic.Users.GetUsers({
				where: [{ field: 'id', value: newMembers, condition: Conditions.in }],
				all: true
			}, false).then(async (users) => {
				users.forEach((u) => {
					Logic.addToArray(store[id].members, u, (e) => e.id, (e) => e.id)
				})
				await store[id].membersListener.restart()
			}).catch()
	})

	onMounted(async () => {
		if (/* !store[id].fetched.value &&  */!store[id].loading.value) await fetchQuiz()
		await store[id].listener.start()
		if (!skip.members) await store[id].membersListener.start()
		if (!skip.questions) await store[id].questionsListener.start()
	})
	onUnmounted(async () => {
		await store[id].listener.close()
		if (!skip.members) await store[id].membersListener.close()
	})

	return {
		...store[id],
		reorderQuestions, deleteQuestion, duplicateQuestion,
		addQuestion,saveQuestion,
		updateQuiz, publishQuiz, deleteQuiz,
		requestAccess, grantAccess, manageMembers
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
