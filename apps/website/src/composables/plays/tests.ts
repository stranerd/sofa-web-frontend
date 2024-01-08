import { QuestionEntity } from '@modules/study'
import { AddQuestionAnswer, GameParticipantAnswer, Logic, Test } from 'sofa-logic'
import { Ref, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../auth/auth'
import { useListener } from '../core/listener'
import { useErrorHandler, useLoadingHandler } from '../core/states'

const store = {} as Record<
	string,
	{
		test: Ref<Test | null>
		questions: QuestionEntity[]
		answer: Ref<GameParticipantAnswer | null>
		fetched: Ref<boolean>
		listener: ReturnType<typeof useListener>
	} & ReturnType<typeof useErrorHandler> &
		ReturnType<typeof useLoadingHandler>
>

export const useTest = (id: string, skip: { questions: boolean; statusNav: boolean }) => {
	const { id: authId } = useAuth()
	const route = useRoute()
	const router = useRouter()

	const lobby = `/tests/${id}/lobby`
	const run = `/tests/${id}/run`
	const results = `/tests/${id}/results`

	store[id] ??= {
		test: ref(null),
		questions: reactive([]),
		answer: ref(null),
		fetched: ref(false),
		listener: useListener(
			async () =>
				await Logic.Common.listenToOne<Test>(`plays/tests/${id}`, {
					created: async (entity) => {
						store[id].test.value = entity
					},
					updated: async (entity) => {
						store[id].test.value = entity
					},
					deleted: async (entity) => {
						store[id].test.value = entity
					},
				}),
		),
		...useErrorHandler(),
		...useLoadingHandler(),
	}

	const fetchTest = async () => {
		await store[id].setError('')
		try {
			await store[id].setLoading(true)
			store[id].test.value = await Logic.Plays.GetTest(id)
			store[id].fetched.value = true
		} catch (e) {
			await store[id].setError(e)
		}
		await store[id].setLoading(false)
	}

	const start = async () => {
		await store[id].setError('')
		if (store[id].test.value?.status !== 'created') return
		try {
			await store[id].setLoading(true)
			await Logic.Plays.StartTest(id)
			await router.push(run)
		} catch (e) {
			await store[id].setError(e)
		}
		await store[id].setLoading(false)
	}

	const end = async () => {
		await store[id].setError('')
		if (store[id].test.value?.status !== 'started') return false
		let succeeded = false
		try {
			await store[id].setLoading(true)
			await Logic.Plays.EndTest(id)
			await router.push(results)
			succeeded = true
		} catch (e) {
			await store[id].setError(e)
		}
		await store[id].setLoading(false)
		return succeeded
	}

	const submitAnswer = async (data: AddQuestionAnswer) => {
		let succeeded = false
		await store[id].setError('')
		try {
			await store[id].setLoading(true)
			await Logic.Plays.AnswerTestQuestion(id, data)
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

	const testWatcherCb = async () => {
		const g = store[id].test.value
		if (!g || skip.statusNav) return

		if (g.userId !== authId.value) return await alertAndNav('/library')
		if (g.status === 'created' && route.path !== lobby) return await alertAndNav(lobby, 'Test has not started yet')
		if (g.status === 'started' && route.path !== run) return await alertAndNav(run, 'Test has started')
		if (['ended', 'scored'].includes(g.status) && route.path !== results) return await alertAndNav(results, 'Test has ended')
	}

	watch(store[id].test, async (cur, old) => {
		if (!cur) return
		if (!skip.questions && !Logic.Differ.equal(cur.questions, old?.questions))
			Logic.Plays.GetTestQuestions(id)
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
		if (!skip.statusNav) testWatcherCb()
	})

	onMounted(async () => {
		if (/* !store[id].fetched.value &&  */ !store[id].loading.value) await fetchTest()
		await store[id].listener.start()
		await testWatcherCb()
	})
	onUnmounted(async () => {
		await store[id].listener.close()
	})

	return { ...store[id], start, end, submitAnswer }
}
