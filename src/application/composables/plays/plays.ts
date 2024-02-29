import { Differ, addToArray } from 'valleyed'
import { Ref, computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../auth/auth'
import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'
import { useUsersInList } from '../users/users'
import { CoursableAccess, QuestionEntity } from '@modules/study'
import { AnswerEntity, AnswersUseCases, PlayEntity, PlayFactory, PlaysUseCases } from '@modules/plays'

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
	const closed = computed(() => myStore.plays.value.filter((p) => p.isClosed))

	return { ...myStore, loading, error, ongoing, closed }
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

	const { asyncFn: fetchQuestions } = useAsyncFn(async () => {
		if (skip.questions) return
		const questions = await PlaysUseCases.getQuestions(id)
		const sources = singleStore[id].play.value?.sources ?? []
		singleStore[id].questions.splice(0, singleStore[id].questions.length, ...(sources.length ? sources : questions))
	})

	const { asyncFn: fetchAnswers } = useAsyncFn(async (play: PlayEntity) => {
		// TODO: listener for answers
		if (skip.questions) return
		const answers = await AnswersUseCases.get(play.data.type, play.id)
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

	const { asyncFn: fetchPlay, called } = useAsyncFn(
		async () => {
			const play = await PlaysUseCases.find(id)
			if (play) await Promise.all([fetchQuestions(), fetchAnswers(play)])
			singleStore[id].play.value = play
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
		if (!p || !p.isCreated) return
		await PlaysUseCases.start(id)
		await router.push(p.participants.includes(authId.value) ? p.runPage : p.resultsPage)
	})

	const { asyncFn: end } = useAsyncFn(async (nav = true) => {
		const p = singleStore[id].play.value
		if (!p || !p.isStarted) return false
		await PlaysUseCases.end(id)
		if (nav) await router.push(p.resultsPage)
		return true
	})

	const { asyncFn: submitAnswer } = useAsyncFn(async (data: Parameters<typeof AnswersUseCases.answer>[2], isLast: boolean) => {
		const p = singleStore[id].play.value
		if (!p || singleStore[id].myAnswer.value?.endedAt) return false
		if (!p.participants.includes(authId.value)) return false
		singleStore[id].myAnswer.value = await AnswersUseCases.answer(p.data.type, p.id, data)
		if (isLast && p.isTimed) {
			singleStore[id].myAnswer.value = await AnswersUseCases.end(p.data.type, p.id)
			if (p.participants.length === 1) await end()
			else await router.push(p.resultsPage)
		}
		return true
	})

	const { asyncFn: resetAnswer } = useAsyncFn(async () => {
		const p = singleStore[id].play.value
		if (!p || p.isTimed) return false
		singleStore[id].myAnswer.value = await AnswersUseCases.reset(p.data.type, p.id)
	})

	const alertAndNav = async (route: string) => {
		await router.replace(route)
	}

	const playWatcherCb = async () => {
		const p = singleStore[id].play.value
		if (!p || skip.statusNav) return

		if (p.isCreated && route.path !== p.lobbyPage) return await alertAndNav(p.lobbyPage)
		if (p.isStarted && route.path !== p.runPage) return await alertAndNav(p.runPage)
		if (p.isClosed && route.path !== p.resultsPage) return await alertAndNav(p.resultsPage)
	}

	watch(
		singleStore[id].play,
		async (cur, old) => {
			if (!cur) return
			if (!Differ.equal(cur.questions, old?.questions)) fetchQuestions()
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

	return { ...singleStore[id], participants, fetched: called, join, start, end, submitAnswer, resetAnswer }
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
		factory.reset()
		return play
	})

	return { createPlay, factory, loading, error, called }
}
