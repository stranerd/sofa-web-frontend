import { Quiz, Logic, Question, SingleUser, Conditions } from 'sofa-logic'
import { Ref, computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useListener } from '../core/listener'
import { useErrorHandler, useLoadingHandler } from '../core/states'

const store = {} as Record<string, {
	quiz: Ref<Quiz | null>
	members: Ref<SingleUser[]>
	questions: Ref<Question[]>
	fetched: Ref<boolean>
	listener: ReturnType<typeof useListener>
	membersListener: ReturnType<typeof useListener>
} & ReturnType<typeof useErrorHandler> & ReturnType<typeof useLoadingHandler>>

export const useQuiz = (id: string, skip: { questions: boolean, members: boolean }) => {
	store[id] ??= {
		quiz: ref(null),
		members: ref([]),
		questions: ref([]),
		fetched: ref(false),
		listener: useListener(async () => await Logic.Common.listenToOne<Quiz>(`study/quizzes/${id}`, {
			created: async (entity) => {
				store[id].quiz.value = entity
			},
			updated: async (entity) => {
				store[id].quiz.value = entity
			},
			deleted: async (entity) => {
				store[id].quiz.value = entity
			}
		})),
		membersListener: useListener(async () => {
			const members = [...store[id].quiz.value?.access.members ?? [], ...store[id].quiz.value?.access.requests ?? []]
			return await Logic.Common.listenToMany<SingleUser>('users/users', {
				created: async (entity) => {
					Logic.addToArray(store[id].members.value, entity, (e) => e.id, (e) => e.id)
				},
				updated: async (entity) => {
					Logic.addToArray(store[id].members.value, entity, (e) => e.id, (e) => e.id)
				},
				deleted: async (entity) => {
					store[id].members.value = store[id].members.value.filter((u) => u.id !== entity.id)
				}
			},  (e) => members.includes(e.id))
		}),
		...useErrorHandler(),
		...useLoadingHandler()
	}

	const fetchGame = async () => {
		await store[id].setError('')
		try {
			await store[id].setLoading(true)
			store[id].quiz.value = await Logic.Study.GetQuiz(id)
			store[id].fetched.value = true
		} catch (e) {
			await store[id].setError(e)
		}
		await store[id].setLoading(false)
	}

	const members = computed(() => store[id].members.value.filter((m) => store[id].quiz.value?.access.members.includes(m.id)))
	const requests = computed(() => store[id].members.value.filter((m) => store[id].quiz.value?.access.requests.includes(m.id)))

	watch(store[id].quiz, async () => {
		if (!store[id].quiz.value) return
		const hasUnfetchedQuestions = store[id].quiz.value.questions.some((qId) => !store[id].questions.value.find((q) => q.id === qId))
		if (!skip.questions && hasUnfetchedQuestions) Logic.Study.GetQuestions(id, { all: true })
			.then((res) => {
				store[id].questions.value = res?.results ?? []
			}).catch()
		const members = [...store[id].quiz.value.access.members, ...store[id].quiz.value.access.requests]
		const hasUnfetchedMembers = members.some((id) => !store[id].members.value.find((u) => u.id === id))
		if (!skip.members && hasUnfetchedMembers)  Logic.Users.GetUsers({
				where: [{ field: 'id', value: members, condition: Conditions.in }],
				all: true
			}, false).then(async (users) => {
				users.forEach((u) => {
					Logic.addToArray(store[id].members.value, u, (e) => e.id, (e) => e.id)
				})
				await store[id].membersListener.restart()
			}).catch()
	})

	onMounted(async () => {
		if (/* !store[id].fetched.value &&  */!store[id].loading.value) await fetchGame()
		await store[id].listener.start()
	})
	onUnmounted(async () => {
		await store[id].listener.close()
		if (!skip.members) await store[id].membersListener.close()
	})

	return {
		...store[id],
		members,
		requests
	}
}