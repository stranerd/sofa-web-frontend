import { Ref, computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useAuth } from '../auth/auth'
import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'
import { useModals } from '../core/modals'
import { useSuccessHandler } from '../core/states'
import { useUsersInList } from '../users/users'
import { useQuestionsInList } from './questions'
import { useHasAccess } from '.'
import {
	CoursableAccess,
	QuestionEntity,
	QuestionFactory,
	QuestionTypes,
	QuestionsUseCases,
	QuizEntity,
	QuizFactory,
	QuizzesUseCases,
} from '@modules/study'
import { useRouter } from '@app/composables/core/routes'

const store = {} as Record<
	string,
	{
		quiz: Ref<QuizEntity | null>
		listener: ReturnType<typeof useListener>
	}
>

export const useQuiz = (id: string, skip?: { questions?: boolean; members?: boolean }, access?: CoursableAccess['access']) => {
	store[id] ??= {
		quiz: ref(null),
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
	}

	const { hasAccess } = useHasAccess()

	const canFetchUsers = computed(() => !skip?.members && hasAccess.value(store[id].quiz.value))
	const canFetchQuestions = computed(() => !skip?.questions && hasAccess.value(store[id].quiz.value))

	const { users: members } = useUsersInList(
		computed(() =>
			canFetchUsers.value && store[id].quiz.value
				? store[id].quiz.value?.access.members.concat(store[id].quiz.value!.user.id, ...store[id].quiz.value!.access.requests) ?? []
				: [],
		),
		!skip?.members,
	)
	const { questions: unorderedQuestions } = useQuestionsInList(
		id,
		computed(() => (canFetchQuestions.value ? store[id].quiz.value?.questions ?? [] : [])),
		access,
		!skip?.questions,
	)
	const questions = computed(
		() => store[id].quiz.value?.questions.map((qId) => unorderedQuestions.value.find((q) => q.id === qId)).filter(Boolean) ?? [],
	)

	const { asyncFn: fetchQuiz, called } = useAsyncFn(
		async () => {
			store[id].quiz.value = await QuizzesUseCases.find(id)
		},
		{ key: `study/quizzes/${id}` },
	)

	onMounted(async () => {
		if (!called.value) await fetchQuiz()
		await store[id].listener.start()
	})
	onUnmounted(async () => {
		await store[id].listener.close()
	})

	return {
		...store[id],
		fetched: called,
		members,
		questions,
	}
}

export const useCreateQuiz = () => {
	const {
		asyncFn: createQuiz,
		loading,
		error,
	} = useAsyncFn(async () => {
		const factory = new QuizFactory()
		const quiz = await QuizzesUseCases.add(factory)
		await Promise.all(
			[QuestionEntity.getTemplate(QuestionTypes.multipleChoice), QuestionEntity.getTemplate(QuestionTypes.trueOrFalse)].map((q) =>
				QuestionsUseCases.add(quiz.id, q),
			),
		).catch()
		return quiz
	})

	return { createQuiz, error, loading }
}

export const useEditQuiz = (id: string) => {
	const { id: authId } = useAuth()
	const { quiz, questions, members, fetched } = useQuiz(id)
	const quizFactory = new QuizFactory()
	const questionFactory = new QuestionFactory()
	const { setMessage } = useSuccessHandler()

	watch(
		quiz,
		() => {
			if (quiz.value) quizFactory.loadEntity(quiz.value)
		},
		{ immediate: true },
	)

	const { asyncFn: updateQuiz } = useAsyncFn(async () => {
		await QuizzesUseCases.update(id, quizFactory)
		await setMessage('Quiz updated')
		await quizFactory.reset()
		useModals().study.editQuiz.close()
	})

	const { asyncFn: publishQuiz } = useAsyncFn(
		async () => {
			if (quiz.value?.isPublished) return true
			await QuizzesUseCases.publish(id)
			await setMessage('Quiz published')
			useModals().study.editQuiz.close()
		},
		{
			pre: async () =>
				await $utils.confirm({
					title: 'Are you sure?',
					sub: "This action is permanent. After publishing a quiz, you won't be able to delete its questions again. However, you can add new and edit existing questions",
					right: { label: 'Yes, publish', bg: 'bg-primaryBlue' },
				}),
		},
	)

	const { asyncFn: reorderQuestions } = useAsyncFn(async (questions: string[]) => {
		if (quiz.value?.questions.length !== questions.length) return
		quiz.value = await QuizzesUseCases.reorder(id, questions)
	})

	const { asyncFn: deleteQuestion } = useAsyncFn(
		async (questionId: string) => {
			await QuestionsUseCases.delete(id, questionId)
			await setMessage('Question has been deleted.')
		},
		{
			pre: async () => {
				if (quiz.value?.isPublished) {
					$utils.showAlert({
						message: 'You cannot delete questions from published quiz',
						type: 'warning',
					})
					return false
				}

				return await $utils.confirm({
					title: 'Are you sure?',
					sub: "This action is permanent. You won't be able to undo this.",
					right: { label: 'Yes, delete' },
				})
			},
		},
	)

	const { asyncFn: addQuestion } = useAsyncFn(async (type: QuestionTypes) => {
		const data = QuestionEntity.getTemplate(type)
		await QuestionsUseCases.add(id, data)
	})

	const { asyncFn: saveQuestion } = useAsyncFn(async (questionId: string, factory: QuestionFactory) => {
		await QuestionsUseCases.update(id, questionId, factory)
		await setMessage('Question saved')
	})

	const { asyncFn: duplicateQuestion } = useAsyncFn(async (question: QuestionEntity) => {
		await QuestionsUseCases.add(id, question)
		await setMessage('Question duplicated')
	})

	const { asyncFn: requestAccess } = useAsyncFn(
		async (add: boolean) => {
			await QuizzesUseCases.requestAccess(id, add)
			await setMessage('Request sent')
		},
		{
			pre: async (add) => {
				if (quiz.value?.user.id === authId.value) return false
				if (quiz.value?.access.members.includes(authId.value)) return false
				if (add && quiz.value?.access.requests.includes(authId.value)) return false
				if (!add && !quiz.value?.access.requests.includes(authId.value)) return false
				return true
			},
		},
	)

	const { asyncFn: grantAccess } = useAsyncFn(async (userId: string, grant: boolean) => {
		await QuizzesUseCases.grantAccess(id, userId, grant)
	})

	const { asyncFn: manageMembers } = useAsyncFn(async (userIds: string[], grant: boolean) => {
		await QuizzesUseCases.addMembers(id, userIds, grant)
	})

	return {
		quiz,
		fetched,
		questions,
		members,
		quizFactory,
		questionFactory,
		updateQuiz,
		publishQuiz,
		reorderQuestions,
		deleteQuestion,
		addQuestion,
		saveQuestion,
		duplicateQuestion,
		requestAccess,
		grantAccess,
		manageMembers,
	}
}

export const useDeleteQuiz = () => {
	const router = useRouter()

	const {
		asyncFn: deleteQuiz,
		error,
		loading,
	} = useAsyncFn(
		async (quiz: QuizEntity) => {
			await QuizzesUseCases.delete(quiz.id)
			await router.push('/library')
		},
		{
			pre: async () =>
				await $utils.confirm({
					title: 'Are you sure?',
					sub: 'This action is permanent. You will lose all saved questions in this quiz.',
					right: { label: 'Yes, delete' },
				}),
		},
	)

	return { deleteQuiz, error, loading }
}
