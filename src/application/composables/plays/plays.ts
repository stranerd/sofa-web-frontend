import { addToArray } from 'valleyed'
import { Ref, computed, onMounted, onUnmounted, ref } from 'vue'
import { useAuth } from '../auth/auth'
import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'
import { IPlayRepository, PlayEntity, PlayToModel, PlaysUseCase } from '@modules/plays'

export const generateHooks = async <E extends PlayEntity, T extends PlayToModel>(
	key: string,
	useCase: PlaysUseCase<E, T, IPlayRepository<E, T>>,
) => {
	const myStore = {
		plays: ref<E[]>([]) as Ref<E[]>,
		listener: useListener(async () => {
			const { id } = useAuth()
			return useCase.listenToMine(id.value, {
				created: async (entity) => {
					addToArray(
						myStore.plays.value,
						entity,
						(e) => e.id,
						(e) => e.createdAt,
					)
				},
				updated: async (entity) => {
					addToArray(
						myStore.plays.value,
						entity,
						(e) => e.id,
						(e) => e.createdAt,
					)
				},
				deleted: async (entity) => {
					myStore.plays.value = myStore.plays.value.filter((m) => m.id !== entity.id)
				},
			})
		}),
	}

	const useMyPlays = () => {
		const { id } = useAuth()

		const {
			asyncFn: fetchPlays,
			loading,
			error,
			called,
		} = useAsyncFn(
			async () => {
				const plays = await useCase.getMine(id.value)
				plays.results.forEach((r) =>
					addToArray(
						myStore.plays.value,
						r,
						(e) => e.id,
						(e) => e.createdAt,
					),
				)
			},
			{ key: `plays/${key}/mine` },
		)

		onMounted(async () => {
			if (!called.value) await fetchPlays()
			await myStore.listener.start()
		})
		onUnmounted(async () => {
			await myStore.listener.close()
		})

		const ongoing = computed(() => myStore.plays.value.filter((p) => p.isOngoing))
		const ended = computed(() => myStore.plays.value.filter((p) => p.isEnded))

		return { ...myStore, loading, error, ongoing, ended }
	}

	return { myStore, useMyPlays }
}
