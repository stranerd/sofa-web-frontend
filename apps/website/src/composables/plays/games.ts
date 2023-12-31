import { AddQuestionAnswer, Game, GameParticipantAnswer, Logic } from 'sofa-logic'
import { Ref, computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../auth/auth'
import { useListener } from '../core/listener'
import { useErrorHandler, useLoadingHandler } from '../core/states'
import { useUsersInList } from '../users/users'
import { QuestionEntity } from '@modules/study'

const store = {} as Record<
	string,
	{
		game: Ref<Game | null>
		questions: QuestionEntity[]
		answer: Ref<GameParticipantAnswer | null>
		fetched: Ref<boolean>
		listener: ReturnType<typeof useListener>
	} & ReturnType<typeof useErrorHandler> &
		ReturnType<typeof useLoadingHandler>
>

export const useGame = (id: string, skip: { questions: boolean; participants: boolean; statusNav: boolean }) => {
	const { id: authId } = useAuth()
	const route = useRoute()
	const router = useRouter()

	const lobby = `/games/${id}/lobby`
	const run = `/games/${id}/run`
	const results = `/games/${id}/results`

	store[id] ??= {
		game: ref(null),
		questions: reactive([]),
		answer: ref(null),
		fetched: ref(false),
		listener: useListener(
			async () =>
				await Logic.Common.listenToOne<Game>(`plays/games/${id}`, {
					created: async (entity) => {
						store[id].game.value = entity
					},
					updated: async (entity) => {
						store[id].game.value = entity
					},
					deleted: async (entity) => {
						store[id].game.value = entity
					},
				}),
		),
		...useErrorHandler(),
		...useLoadingHandler(),
	}

	const { users: participants } = useUsersInList(computed(() => (skip.participants ? [] : store[id].game.value?.participants ?? [])))

	const fetchGame = async () => {
		await store[id].setError('')
		try {
			await store[id].setLoading(true)
			store[id].game.value = await Logic.Plays.GetGame(id)
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
			await router.push(store[id].game.value?.participants.includes(authId.value) ? run : results)
		} catch (e) {
			await store[id].setError(e)
		}
		await store[id].setLoading(false)
	}

	const end = async () => {
		await store[id].setError('')
		if (store[id].game.value?.status !== 'started') return false
		const confirmed = confirm('Ending the game now will automically end it for all participants currently taking the tests!')
		if (!confirmed) return false
		let succeeded = false
		try {
			await store[id].setLoading(true)
			await Logic.Plays.EndGame(id)
			succeeded = true
		} catch (e) {
			await store[id].setError(e)
		}
		await store[id].setLoading(false)
		return succeeded
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

	const alertAndNav = async (route: string, message?: string) => {
		// if (message) Logic.Common.showAlert({ message, type: 'info' })
		await router.replace(route)
	}

	const gameWatcherCb = async () => {
		const g = store[id].game.value
		if (!g || skip.statusNav) return

		if (g.status === 'created' && route.path !== lobby) return await alertAndNav(lobby, 'Game has not started yet')
		if (g.status === 'started' && route.path !== run) return await alertAndNav(run, 'Game has started')
		if (['ended', 'scored'].includes(g.status) && route.path !== results) return await alertAndNav(results, 'Game has ended')
	}

	watch(store[id].game, async (cur, old) => {
		if (!cur) return
		if (!skip.questions && !Logic.Differ.equal(cur.questions, old?.questions))
			Logic.Plays.GetGameQuestions(id)
				.then((questions) => {
					store[id].questions.splice(0, store[id].questions.length, ...questions)
				})
				.catch()
		if (!skip.questions)
			Logic.Plays.GetGameAnswers(id, { where: [{ field: 'userId', value: authId.value }] })
				.then((answers) => {
					store[id].answer.value = answers.results.at(0) ?? null
				})
				.catch()
		if (!skip.statusNav) gameWatcherCb()
	})

	onMounted(async () => {
		if (/* !store[id].fetched.value &&  */ !store[id].loading.value) await fetchGame()
		await store[id].listener.start()
		await gameWatcherCb()
	})
	onUnmounted(async () => {
		await store[id].listener.close()
	})

	return { ...store[id], participants, start, end, join, submitAnswer }
}
