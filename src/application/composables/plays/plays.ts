import { addToArray } from 'valleyed'
import { Ref, computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../auth/auth'
import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'
import { useUsersInList } from '../users/users'
import { CoursableAccess, QuestionEntity } from '@modules/study'
import { AnswerEntity, AnswersUseCases, PlayEntity, PlayFactory, PlayTypes, PlaysUseCases } from '@modules/plays'

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
		listener: ReturnType<typeof useListener>
	}
>

export const usePlay = (type: PlayTypes, id: string, skip: { questions: boolean; statusNav: boolean; participants: boolean }) => {
	const { id: authId } = useAuth()
	const route = useRoute()
	const router = useRouter()

	singleStore[id] ??= {
		play: ref(null),
		questions: reactive([]),
		answers: ref([]),
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

	const myAnswer = computed({
		get: () => singleStore[id].answers.value.find((a) => a.userId === authId.value) ?? null,
		set: (v) => {
			if (v)
				addToArray(
					singleStore[id].answers.value,
					v,
					(e) => e.id,
					(e) => e.createdAt,
				)
		},
	})

	const { users: participants } = useUsersInList(
		computed(() => (skip.participants ? [] : singleStore[id].play.value?.participants ?? [])),
	)

	const { asyncFn: fetchQuestions, called: fetchedQuestions } = useAsyncFn(
		async () => {
			const questions = await PlaysUseCases.getQuestions(id)
			singleStore[id].questions.splice(0, singleStore[id].questions.length, ...questions)
		},
		{ pre: () => !skip.questions, key: `plays/plays/${id}/questions` },
	)

	const { asyncFn: fetchAnswers, called: fetchedAnswers } = useAsyncFn(
		async () => {
			// TODO: listener for answers
			const answers = await AnswersUseCases.get(type, id)
			answers.forEach((a) => {
				addToArray(
					singleStore[id].answers.value,
					a,
					(e) => e.id,
					(e) => e.createdAt,
				)
			})
		},
		{ pre: () => !skip.questions, key: `plays/plays/${id}/answers` },
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
		if (!p || !p.isCreated) return
		await PlaysUseCases.start(id)
		await router.replace(p.participants.includes(authId.value) ? p.runPage : p.resultsPage)
	})

	const { asyncFn: end } = useAsyncFn(async (nav = true) => {
		const p = singleStore[id].play.value
		if (!p || !p.isStarted) return false
		await PlaysUseCases.end(id)
		if (nav) await router.replace(p.resultsPage)
		return true
	})

	const { asyncFn: submitAnswer } = useAsyncFn(async (data: Parameters<typeof AnswersUseCases.answer>[2], isLast: boolean) => {
		const p = singleStore[id].play.value
		if (!p || myAnswer.value?.endedAt) return false
		if (!p.participants.includes(authId.value)) return false
		myAnswer.value = await AnswersUseCases.answer(p.data.type, p.id, data)
		const endedAnswer = !!myAnswer.value?.endedAt
		if ((endedAnswer || isLast) && p.isTimed) {
			if (!endedAnswer) myAnswer.value = await AnswersUseCases.end(p.data.type, p.id)
			if (p.participants.length === 1 && p.participants[0] === p.user.id) await end()
			else await router.replace(p.resultsPage)
		}
		return true
	})

	const { asyncFn: resetAnswer } = useAsyncFn(async () => {
		const p = singleStore[id].play.value
		if (!p || p.isTimed) return false
		myAnswer.value = await AnswersUseCases.reset(p.data.type, p.id)
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
		async (cur) => {
			if (!cur) return
			if (myAnswer.value?.endedAt) router.replace(cur.resultsPage)
			playWatcherCb()
		},
		{ immediate: true },
	)

	onMounted(async () => {
		await Promise.all([
			!fetchedQuestions.value && fetchQuestions(),
			!fetchedAnswers.value && fetchAnswers(),
			!called.value && fetchPlay(),
		])
		await singleStore[id].listener.start()
		await playWatcherCb()
	})
	onUnmounted(async () => {
		await singleStore[id].listener.close()
	})

	const questions = computed(() => {
		const play = singleStore[id].play.value
		if (play?.sources.length) return play.sources
		return singleStore[id].questions
	})

	return { ...singleStore[id], questions, myAnswer, participants, fetched: called, join, start, end, submitAnswer, resetAnswer }
}

export const useCreatePlay = (access: CoursableAccess['access'], options: { start: boolean; nav: boolean }) => {
	const router = useRouter()
	const factory = new PlayFactory()
	const {
		asyncFn: createPlay,
		loading,
		error,
	} = useAsyncFn(async (optionsOvr?: Partial<typeof options>) => {
		const allOpts = { ...options, ...(optionsOvr ?? {}) }
		let play = await PlaysUseCases.create(factory, access)
		if (allOpts.start && play.isCreated) play = await PlaysUseCases.start(play.id)
		if (allOpts.nav) await router.push(allOpts.start ? play.runPage : play.lobbyPage)
		factory.reset()
		return play
	})

	return { createPlay, factory, loading, error }
}
