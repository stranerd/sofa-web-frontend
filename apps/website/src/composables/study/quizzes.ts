import { QuestionEntity, QuestionFactory, QuestionsUseCases, QuizEntity, QuizFactory, QuizzesUseCases } from '@modules/study'
import { CreateQuizInput, Logic, Question } from 'sofa-logic'
import { Ref, computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../auth/auth'
import { useListener } from '../core/listener'
import { useErrorHandler, useLoadingHandler, useSuccessHandler } from '../core/states'
import { useUsersInList } from '../users/users'
import { useQuestionsInList } from './questions'
import { useHasAccess } from './study'

const store = {} as Record<
	string,
	{
		quiz: Ref<QuizEntity | null>
		fetched: Ref<boolean>
		listener: ReturnType<typeof useListener>
	} & ReturnType<typeof useErrorHandler> &
		ReturnType<typeof useLoadingHandler> &
		ReturnType<typeof useSuccessHandler>
>

export const useQuiz = (id: string, skip: { questions: boolean; members: boolean }) => {
	store[id] ??= {
		quiz: ref(null),
		fetched: ref(false),
		listener: useListener(
			async () =>
				await QuizzesUseCases.listenToOne(id, {
					created: async (entity) => {
						store[id].quiz.value = entity
					},
					updated: async (entity) => {
						store[id].quiz.value = entity
					},
					deleted: async (entity) => {
						store[id].quiz.value = entity
					},
				}),
		),
		...useErrorHandler(),
		...useLoadingHandler(),
		...useSuccessHandler(),
	}

	const router = useRouter()
	const { id: authId } = useAuth()
	const quizFactory = new QuizFactory()
	const questionFactory = new QuestionFactory()

	const { hasAccess } = useHasAccess()

	const canFetchUsers = computed(() => !skip.members && hasAccess.value(store[id].quiz.value))
	const canFetchQuestions = computed(() => !skip.questions && hasAccess.value(store[id].quiz.value))

	const { users: members } = useUsersInList(
		computed(() =>
			canFetchUsers.value
				? store[id].quiz.value?.access.members.concat(store[id].quiz.value.user.id, ...store[id].quiz.value.access.requests) ?? []
				: [],
		),
		!skip.members,
	)
	const { questions } = useQuestionsInList(
		id,
		computed(() => (canFetchQuestions.value ? store[id].quiz.value?.questions ?? [] : [])),
		!skip.questions,
	)

	const fetchQuiz = async () => {
		await store[id].setError('')
		try {
			await store[id].setLoading(true)
			store[id].quiz.value = await QuizzesUseCases.find(id)
			if (store[id].quiz.value) Logic.Interactions.CreateView({ entity: { id: id, type: 'quizzes' } }).catch() // dont await, run in bg
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
		if (store[id].quiz.value?.questions.length !== questions.length) return
		await store[id].setError('')
		try {
			await store[id].setLoading(true)
			store[id].quiz.value = await QuizzesUseCases.reorder(id, questions)
		} catch (e) {
			await store[id].setError(e)
		}
		await store[id].setLoading(false)
	}

	const deleteQuestion = async (questionId: string) => {
		if (store[id].quiz.value?.isPublished)
			return Logic.Common.showAlert({
				message: 'You cannot delete questions from published quiz',
				type: 'warning',
			})

		const confirmed = await Logic.Common.confirm({
			title: 'Are you sure?',
			sub: "This action is permanent. You won't be able to undo this.",
			right: { label: 'Yes, delete' },
		})
		if (!confirmed) return

		await store[id].setError('')
		try {
			await store[id].setLoading(true)
			await QuestionsUseCases.delete(id, questionId)
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

	const saveQuestion = async (questionId: string, factory: QuestionFactory) => {
		await store[id].setError('')
		try {
			await store[id].setLoading(true)
			await QuestionsUseCases.update(id, questionId, factory)
			await store[id].setMessage('Question saved')
		} catch (e) {
			await store[id].setError(e)
		}
		await store[id].setLoading(false)
	}

	const duplicateQuestion = async (question: QuestionEntity) => {
		await store[id].setError('')
		try {
			await store[id].setLoading(true)
			const factory = new QuestionFactory()
			factory.loadEntity(question)
			await QuestionsUseCases.add(id, factory)
			await store[id].setMessage('Question duplicated')
		} catch (e) {
			await store[id].setError(e)
		}
		await store[id].setLoading(false)
	}

	const deleteQuiz = async () => {
		const confirmed = await Logic.Common.confirm({
			title: 'Are you sure?',
			sub: 'This action is permanent. You will lose all saved questions in this quiz.',
			right: { label: 'Yes, delete' },
		})
		if (!confirmed) return
		await store[id].setError('')
		try {
			await store[id].setLoading(true)
			await QuizzesUseCases.delete(id)
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

	onMounted(async () => {
		if (/* !store[id].fetched.value &&  */ !store[id].loading.value) await fetchQuiz()
		await store[id].listener.start()
	})
	onUnmounted(async () => {
		await store[id].listener.close()
	})

	return {
		...store[id],
		members,
		questions,
		quizFactory,
		questionFactory,
		reorderQuestions,
		deleteQuestion,
		duplicateQuestion,
		addQuestion,
		saveQuestion,
		updateQuiz,
		publishQuiz,
		deleteQuiz,
		requestAccess,
		grantAccess,
		manageMembers,
	}
}

export const useCreateQuiz = () => {
	const { error, setError } = useErrorHandler()
	const { loading, setLoading } = useLoadingHandler()

	const createQuiz = async () => {
		await setError('')
		try {
			await setLoading(true)
			const factory = new QuizFactory()
			const quiz = await QuizzesUseCases.add(factory)
			await Promise.all(
				[Logic.Study.getQuestionTypeTemplate('multipleChoice'), Logic.Study.getQuestionTypeTemplate('trueOrFalse')].map((q) =>
					Logic.Study.CreateQuestion(quiz.id, q),
				),
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
