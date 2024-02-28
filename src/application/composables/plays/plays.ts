import { Differ, addToArray } from 'valleyed'
import { Ref, computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../auth/auth'
import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'
import { CoursableAccess, QuestionEntity } from '@modules/study'
import {
	AnswerEntity,
	AnswersUseCases,
	IPlayRepository,
	PlayEntity,
	PlayStatus,
	PlayToModel,
	PlayTypes,
	PlaysUseCase,
} from '@modules/plays'

export const generateHooks = <E extends PlayEntity, T extends PlayToModel>(
	type: PlayTypes,
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
			{ key: `plays/${type}/mine` },
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

	const singleStore = {} as Record<
		string,
		{
			play: Ref<E | null>
			questions: QuestionEntity[]
			answer: Ref<AnswerEntity | null>
			listener: ReturnType<typeof useListener>
		}
	>

	const usePlay = (id: string, skip: { questions: boolean; statusNav: boolean }) => {
		const { id: authId } = useAuth()
		const route = useRoute()
		const router = useRouter()

		singleStore[id] ??= {
			play: ref(null),
			questions: reactive([]),
			answer: ref(null),
			listener: useListener(
				async () =>
					await useCase.listenToOne(id, {
						created: async (entity) => {
							singleStore[id].play.value = entity
						},
						updated: async (entity) => {
							singleStore[id].play.value = entity
						},
						deleted: async (entity) => {
							singleStore[id].play.value = entity
						},
					}),
			),
		}

		const { asyncFn: fetchPlay, called } = useAsyncFn(
			async () => {
				singleStore[id].play.value = await useCase.find(id)
			},
			{ key: `plays/${type}/${id}` },
		)

		const { asyncFn: start } = useAsyncFn(async () => {
			const p = singleStore[id].play.value
			if (!p || !p.canStart) return
			await useCase.start(id)
			const isParticipant = p.isGame() ? p.participants.includes(authId.value) : true
			await router.push(isParticipant ? p.runPage : p.resultsPage)
		})

		const { asyncFn: end } = useAsyncFn(async () => {
			const p = singleStore[id].play.value
			if (!p || !p.canEnd) return false
			await useCase.end(id)
			await router.push(p.resultsPage)
			return true
		})

		const { asyncFn: submitAnswer } = useAsyncFn(async (data: Parameters<typeof AnswersUseCases.answer>[2]) => {
			await AnswersUseCases.answer(type, id, data)
			return true
		})

		const alertAndNav = async (route: string) => {
			await router.replace(route)
		}

		const playWatcherCb = async () => {
			const p = singleStore[id].play.value
			if (!p || skip.statusNav) return

			if (p.status === PlayStatus.created && route.path !== p.lobbyPage) return await alertAndNav(p.lobbyPage)
			if (p.status === PlayStatus.started && route.path !== p.runPage) return await alertAndNav(p.runPage)
			if (p.isEnded && route.path !== p.resultsPage) return await alertAndNav(p.resultsPage)
		}

		watch(
			singleStore[id].play,
			async (cur, old) => {
				if (!cur) return
				if (!skip.questions && !Differ.equal(cur.questions, old?.questions))
					useCase
						.getQuestions(id)
						.then((questions) => {
							singleStore[id].questions.splice(0, singleStore[id].questions.length, ...questions)
						})
						.catch(() => {})
				if (!skip.questions)
					AnswersUseCases.getForUser(type, id, authId.value)
						.then((answer) => {
							singleStore[id].answer.value = answer
						})
						.catch(() => {})
				if (!skip.statusNav) playWatcherCb()
			},
			{ immediate: true },
		)

		onMounted(async () => {
			if (!called.value) await fetchPlay()
			await singleStore[id].listener.start()
			await playWatcherCb()
		})
		onUnmounted(async () => {
			await singleStore[id].listener.close()
		})

		return { ...singleStore[id], fetched: called, start, end, submitAnswer }
	}

	const useCreatePlay = (access: CoursableAccess['access'], options: { start: boolean; nav: boolean }) => {
		const router = useRouter()
		const {
			asyncFn: createPlay,
			loading,
			error,
			called,
		} = useAsyncFn(async (data: T) => {
			let play = await useCase.create(data, access)
			if (options.start) play = await useCase.start(play.id)
			if (options.nav) await router.push(options.start ? play.runPage : play.lobbyPage)
			return play
		})

		return { createPlay, loading, error, called }
	}

	return { myStore, useMyPlays, singleStore, usePlay, useCreatePlay }
}
