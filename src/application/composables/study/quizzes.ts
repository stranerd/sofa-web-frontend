import { Ref, computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../auth/auth'
import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'
import { useSuccessHandler } from '../core/states'
import { useCreateView } from '../interactions/views'
import { useUsersInList } from '../users/users'
import { useQuestionsInList } from './questions'
import { useHasAccess } from '.'
import { Logic } from 'sofa-logic'
import { CoursableAccess } from '@modules/study/domain/types'
import { QuestionEntity, QuestionFactory, QuestionTypes, QuestionsUseCases, QuizEntity, QuizFactory, QuizzesUseCases } from '@modules/study'
import { InteractionEntities } from '@modules/interactions'

const store = {} as Record<
	string,
	{
		quiz: Ref<QuizEntity | null>
		listener: ReturnType<typeof useListener>
	} & ReturnType<typeof useSuccessHandler>
>

export const useQuiz = (
	id: string,
	skip: { questions: boolean; members: boolean; createView: boolean },
	access: CoursableAccess['access'],
) => {
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
		...useSuccessHandler(),
	}

	const router = useRouter()
	const { id: authId } = useAuth()
	const quizFactory = new QuizFactory()
	const questionFactory = new QuestionFactory()

	const { hasAccess } = useHasAccess()
	const { createView } = useCreateView()

	const canFetchUsers = computed(() => !skip.members && hasAccess.value(store[id].quiz.value))
	const canFetchQuestions = computed(() => !skip.questions && hasAccess.value(store[id].quiz.value))

	const { users: members } = useUsersInList(
		computed(() =>
			canFetchUsers.value && store[id].quiz.value
				? store[id].quiz.value?.access.members.concat(store[id].quiz.value!.user.id, ...store[id].quiz.value!.access.requests) ?? []
				: [],
		),
		!skip.members,
	)
	const { questions } = useQuestionsInList(
		id,
		computed(() => (canFetchQuestions.value ? store[id].quiz.value?.questions ?? [] : [])),
		access,
		!skip.questions,
	)

	const { asyncFn: fetchQuiz, called } = useAsyncFn(
		async () => {
			store[id].quiz.value = await QuizzesUseCases.find(id)
			if (store[id].quiz.value && !skip.createView) createView({ id: id, type: InteractionEntities.quizzes })
		},
		{ key: `study/quizzes/${id}` },
	)

	const { asyncFn: updateQuiz } = useAsyncFn(async (factory: QuizFactory) => {
		await QuizzesUseCases.update(id, factory)
		await store[id].setMessage('Quiz saved')
		return true
	})

	const { asyncFn: publishQuiz } = useAsyncFn(async () => {
		if (store[id].quiz.value?.isPublished) return true
		await QuizzesUseCases.publish(id)
		await store[id].setMessage('Quiz published')
		return true
	})

	const { asyncFn: reorderQuestions } = useAsyncFn(async (questions: string[]) => {
		if (store[id].quiz.value?.questions.length !== questions.length) return
		store[id].quiz.value = await QuizzesUseCases.reorder(id, questions)
	})

	const { asyncFn: deleteQuestion } = useAsyncFn(
		async (questionId: string) => {
			await QuestionsUseCases.delete(id, questionId)
			await store[id].setMessage('Question has been deleted.')
		},
		{
			pre: async () => {
				if (store[id].quiz.value?.isPublished) {
					Logic.Common.showAlert({
						message: 'You cannot delete questions from published quiz',
						type: 'warning',
					})
					return false
				}

				return await Logic.Common.confirm({
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
		await store[id].setMessage('Question saved')
	})

	const { asyncFn: duplicateQuestion } = useAsyncFn(async (question: QuestionEntity) => {
		await QuestionsUseCases.add(id, question)
		await store[id].setMessage('Question duplicated')
	})

	const { asyncFn: deleteQuiz } = useAsyncFn(
		async () => {
			await QuizzesUseCases.delete(id)
			await router.push('/library')
		},
		{
			pre: async () =>
				await Logic.Common.confirm({
					title: 'Are you sure?',
					sub: 'This action is permanent. You will lose all saved questions in this quiz.',
					right: { label: 'Yes, delete' },
				}),
		},
	)

	const { asyncFn: requestAccess } = useAsyncFn(
		async (add: boolean) => {
			await QuizzesUseCases.requestAccess(id, add)
			await store[id].setMessage('Request sent')
		},
		{
			pre: async (add) => {
				if (store[id].quiz.value?.user.id === authId.value) return false
				if (store[id].quiz.value?.access.members.includes(authId.value)) return false
				if (add && store[id].quiz.value?.access.requests.includes(authId.value)) return false
				if (!add && !store[id].quiz.value?.access.requests.includes(authId.value)) return false
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
