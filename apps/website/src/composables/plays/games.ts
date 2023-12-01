import { AddQuestionAnswer, Conditions, Game, GameParticipantAnswer, Logic, Question, SingleUser } from 'sofa-logic'
import { Ref, onMounted, onUnmounted, ref, watch } from 'vue'
import { useListener } from '../core/listener'
import { useErrorHandler, useLoadingHandler } from '../core/states'
import { useAuth } from '../auth/auth'

const store = {} as Record<string, {
	game: Ref<Game | null>
	participants: Ref<SingleUser[]>
	questions: Ref<Question[]>
	answer: Ref<GameParticipantAnswer | null>
	fetched: Ref<boolean>
	listener: ReturnType<typeof useListener>
} & ReturnType<typeof useErrorHandler> & ReturnType<typeof useLoadingHandler>>

export const useGame = (id: string, skip: { questions: boolean, participants: boolean }) => {
	const { id: authId } = useAuth()

	store[id] ??= {
		game: ref(null),
		participants: ref([]),
		questions: ref([]),
		answer: ref(null),
		fetched: ref(false),
		listener: useListener(async () => await Logic.Common.listenToOne<Game>(`plays/games/${id}`, {
			created: async (entity) => {
				store[id].game.value = entity
			},
			updated: async (entity) => {
				store[id].game.value = entity
			},
			deleted: async (entity) => {
				store[id].game.value = entity
			}
		})),
		...useErrorHandler(),
		...useLoadingHandler()
	}

	const fetchGame = async () => {
		await store[id].setError('')
		try {
			await store[id].setLoading(true)
			store[id].game.value = await Logic.Plays.GetGame(id, true)
			store[id].fetched.value = true
		} catch (e) {
			await store[id].setError(e)
		}
		await store[id].setLoading(false)
	}

	const start = async () => {
		await store[id].setError('')
		if (store[id].game.value?.status !== 'created') return
		try {
			await store[id].setLoading(true)
			await Logic.Plays.StartGame(id)
		} catch (e) {
			await store[id].setError(e)
		}
		await store[id].setLoading(false)
	}

	const join = async (join: boolean) => {
		await store[id].setError('')
		if (join && store[id].game.value?.participants.includes(authId.value)) return
		if (!join && !store[id].game.value?.participants.includes(authId.value)) return
		try {
			await store[id].setLoading(true)
			await Logic.Plays.JoinGame(id, join)
		} catch (e) {
			await store[id].setError(e)
		}
		await store[id].setLoading(false)
	}

	const submitAnswer = async (data: AddQuestionAnswer) => {
		let succeeded = false
		await store[id].setError('')
		try {
			await store[id].setLoading(true)
			await Logic.Plays.AnswerGameQuestion(id, data)
			succeeded = true
		} catch (e) {
			await store[id].setError(e)
		}
		await store[id].setLoading(false)
		return succeeded
	}

	watch(store[id].game, async () => {
		if (!store[id].game.value) return
		const hasUnfetchedParticipants = store[id].game.value.participants.some((pId) => !store[id].participants.value.find((p) => p.id === pId))
		if (!skip.participants && hasUnfetchedParticipants)
			store[id].participants.value = await Logic.Users.GetUsers({
				where: [{ field: 'id', value: store[id].game.value.participants, condition: Conditions.in }],
				all: true
			}, false).catch(() => [])
		const hasUnfetchedQuestions = store[id].game.value.questions.some((qId) => !store[id].questions.value.find((q) => q.id === qId))
		if (!skip.questions && hasUnfetchedQuestions)
			store[id].questions.value = await Logic.Plays.GetQuizQuestions(id).catch(() => [])
		if (!skip.questions) {
			const answers = await Logic.Plays.GetGameAnswers(id, { where: [{ field: 'userId', value: authId.value }] })
			store[id].answer.value = answers.results.at(0) ?? null
		}
	})

	onMounted(async () => {
		if (/* !store[id].fetched.value &&  */!store[id].loading.value) await fetchGame()
		await store[id].listener.start()
	})
	onUnmounted(async () => {
		await store[id].listener.close()
	})

	return { ...store[id], start, join, submitAnswer }
}