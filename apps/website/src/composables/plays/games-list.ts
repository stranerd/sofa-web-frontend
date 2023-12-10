import { Game, Logic, PlayStatus, QueryKeys } from 'sofa-logic'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useAuth } from '../auth/auth'
import { useListener } from '../core/listener'
import { useErrorHandler, useLoadingHandler } from '../core/states'

const store = {
	games: ref<Game[]>([]),
	fetched: ref(false),
	...useLoadingHandler(),
	...useErrorHandler(),
	listener: useListener(async () => {
		const { id } = useAuth()
		return Logic.Common.listenToMany<Game>('plays/games', {
			created: async (entity) => {
				Logic.addToArray(store.games.value, entity, (e) => e.id, (e) => e.createdAt)
			},
			updated: async (entity) => {
				Logic.addToArray(store.games.value, entity, (e) => e.id, (e) => e.createdAt)
			},
			deleted: async (entity) => {
				store.games.value = store.games.value.filter((m) => m.id !== entity.id)
			}
		}, (e) => e.user.id === id.value || e.participants.includes(id.value))
	})
}

export const useMyGames = () => {
	const { id } = useAuth()

	const fetchGames = async () => {
		try {
			await store.setError('')
			await store.setLoading(true)
			const games = await Logic.Plays.GetGames({
				whereType: QueryKeys.or,
				where: [{ field: 'user.id', value: id.value }, { field: 'participants', value: id.value }],
				all: true
			})
			games.results.forEach((r) => Logic.addToArray(store.games.value, r, (e) => e.id, (e) => e.createdAt))
			store.fetched.value = true
		} catch (e) {
			await store.setError(e)
		}
		await store.setLoading(false)
	}

	onMounted(async () => {
		if (/* !store.fetched.value &&  */!store.loading.value) await fetchGames()
		await store.listener.start()
	})
	onUnmounted(async () => {
		await store.listener.close()
	})

	const ongoing = computed(() => store.games.value
		.filter((p) => [PlayStatus.created, PlayStatus.started].includes(p.status)))
	const ended = computed(() => store.games.value
		.filter((p) => [PlayStatus.ended, PlayStatus.scored].includes(p.status)))

	return { ...store, ongoing, ended }
}
