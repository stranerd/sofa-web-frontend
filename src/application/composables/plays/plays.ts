import { Differ, addToArray } from 'valleyed'
import { Ref, computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../auth/auth'
import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'
import { useUsersInList } from '../users/users'
import { CoursableAccess, QuestionEntity } from '@modules/study'
import { AnswerEntity, AnswersUseCases, PlayEntity, PlayFactory, PlayStatus, PlaysUseCases } from '@modules/plays'

const myStore = {
	plays: ref<PlayEntity[]>([]) as Ref<PlayEntity[]>,
	listener: useListener(async () => {
		const { id } = useAuth()
		return PlaysUseCases.listenToMine(id.value, {
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

export const useMyPlays = () => {
	const { id } = useAuth()

	const {
		asyncFn: fetchPlays,
		loading,
		error,
		called,
	} = useAsyncFn(
		async () => {
			const plays = await PlaysUseCases.getMine(id.value)
			plays.results.forEach((r) =>
				addToArray(
					myStore.plays.value,
					r,
					(e) => e.id,
					(e) => e.createdAt,
				),
			)
		},
		{ key: `plays/plays/mine` },
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
		play: Ref<PlayEntity | null>
		questions: QuestionEntity[]
		answers: Ref<AnswerEntity[]>
		myAnswer: Ref<AnswerEntity | null>
		listener: ReturnType<typeof useListener>
	}
>

export const usePlay = (id: string, skip: { questions: boolean; statusNav: boolean; participants: boolean }) => {
	const { id: authId } = useAuth()
	const route = useRoute()
	const router = useRouter()

	singleStore[id] ??= {
		play: ref(null),
		questions: reactive([]),
		answers: ref([]),
		myAnswer: ref(null),
		listener: useListener(
			async () =>
				await PlaysUseCases.listenToOne(id, {
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

	const { users: participants } = useUsersInList(
		computed(() => (skip.participants ? [] : singleStore[id].play.value?.participants ?? [])),
	)

	const { asyncFn: fetchPlay, called } = useAsyncFn(
		async () => {
			singleStore[id].play.value = await PlaysUseCases.find(id)
		},
		{ key: `plays/plays/${id}` },
	)

	const { asyncFn: join } = useAsyncFn(async (join: boolean) => {
		const p = singleStore[id].play.value
		if (!p) return
		if (join === p.participants.includes(authId.value)) return
		await PlaysUseCases.join(id, { join })
	})

	const { asyncFn: start } = useAsyncFn(async () => {
		const p = singleStore[id].play.value
		if (!p || !p.canStart) return
		await PlaysUseCases.start(id)
		await router.push(p.participants.includes(authId.value) ? p.runPage : p.resultsPage)
	})

	const { asyncFn: end } = useAsyncFn(async () => {
		const p = singleStore[id].play.value
		if (!p || !p.canEnd) return false
		await PlaysUseCases.end(id)
		await router.push(p.resultsPage)
		return true
	})

	const { asyncFn: submitAnswer } = useAsyncFn(async (data: Parameters<typeof AnswersUseCases.answer>[2], isLast: boolean) => {
		const p = singleStore[id].play.value
		if (!p || singleStore[id].myAnswer.value?.endedAt) return false
		if (!p.participants.includes(authId.value)) return false
		singleStore[id].myAnswer.value = await AnswersUseCases.answer(p.data.type, p.id, data)
		if (isLast) {
			singleStore[id].myAnswer.value = await AnswersUseCases.end(p.data.type, p.id)
			if (p.participants.length === 1) await end()
			else await router.push(p.resultsPage)
		}
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
				PlaysUseCases.getQuestions(id)
					.then((questions) => {
						singleStore[id].questions.splice(0, singleStore[id].questions.length, ...questions)
					})
					.catch(() => {})
			if (!skip.questions)
				// TODO: add listeners for answers conditionally
				AnswersUseCases.get(cur.data.type, cur.id)
					.then((answers) => {
						answers.forEach((a) => {
							if (a.userId === authId.value) singleStore[id].myAnswer.value = a
							addToArray(
								singleStore[id].answers.value,
								a,
								(e) => e.id,
								(e) => e.createdAt,
							)
						})
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

	return { ...singleStore[id], participants, fetched: called, join, start, end, submitAnswer }
}

export const useCreatePlay = (access: CoursableAccess['access'], options: { start: boolean; nav: boolean }) => {
	const router = useRouter()
	const factory = new PlayFactory()
	const {
		asyncFn: createPlay,
		loading,
		error,
		called,
	} = useAsyncFn(async (optionsOvr?: Partial<typeof options>) => {
		const allOpts = { ...options, ...(optionsOvr ?? {}) }
		let play = await PlaysUseCases.create(factory, access)
		if (allOpts.start) play = await PlaysUseCases.start(play.id)
		if (allOpts.nav) await router.push(allOpts.start ? play.runPage : play.lobbyPage)
		return play
	})

	return { createPlay, factory, loading, error, called }
}
