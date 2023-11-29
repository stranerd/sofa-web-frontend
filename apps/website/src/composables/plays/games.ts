import { Conditions, Game, Logic, Question, SingleUser } from 'sofa-logic'
import { Ref, onMounted, onUnmounted, ref, watch } from 'vue'
import { useListener } from '../core/listener'
import { useErrorHandler, useLoadingHandler } from '../core/states'

const store = {} as Record<string, {
	game: Ref<Game | null>
	participants: Ref<SingleUser[]>
	questions: Ref<Question[]>
	fetched: Ref<boolean>
	listener: ReturnType<typeof useListener>
} & ReturnType<typeof useErrorHandler> & ReturnType<typeof useLoadingHandler>>

export const useGame = (id: string, skipQuestions = false) => {
	store[id] ??= {
		game: ref(null),
		participants: ref([]),
		questions: ref([]),
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
			store[id].game.value = await Logic.Plays.GetGame(id)
			store[id].fetched.value = true
		} catch (e) {
			await store[id].setError(e)
		}
		await store[id].setLoading(false)
	}

	watch(store[id].game, async () => {
		if (!store[id].game.value) return
		if (store[id].game.value.participants.some((pId) => !store[id].participants.value.find((p) => p.id === pId)))
			store[id].participants.value = await Logic.Users.GetUsers({
				where: [{ field: 'id', value: store[id].game.value.participants, condition: Conditions.in }],
				all: true
			}, false).catch(() => [])
		if (skipQuestions) return
		if (store[id].game.value.questions.some((qId) => !store[id].questions.value.find((q) => q.id === qId)))
			store[id].questions.value = await Logic.Plays.GetQuizQuestions(id).catch(() => [])
	})

	onMounted(async () => {
		if (/* !store[id].fetched.value &&  */!store[id].loading.value) await fetchGame()
		await store[id].listener.start()
	})
	onUnmounted(async () => {
		await store[id].listener.close()
	})

	return { ...store[id] }
}