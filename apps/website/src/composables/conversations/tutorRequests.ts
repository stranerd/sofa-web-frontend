import { ConversationTutorRequest, Logic } from 'sofa-logic'
import { addToArray } from 'valleyed'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useListener } from '../core/listener'
import { useErrorHandler, useLoadingHandler } from '../core/states'

const store = {
	requests: ref<ConversationTutorRequest[]>([]),
	fetched: ref(false),
	...useLoadingHandler(),
	...useErrorHandler(),
	listener: useListener(async () => {
		return Logic.Common.listenToMany<ConversationTutorRequest>('conversations/tutorRequests', {
			created: async (entity) => {
				addToArray(store.requests.value, entity, (e) => e.id, (e) => e.createdAt ?? 0)
			},
			updated: async (entity) => {
				addToArray(store.requests.value, entity, (e) => e.id, (e) => e.createdAt)
			},
			deleted: async (entity) => {
				store.requests.value = store.requests.value.filter((m) => m.id !== entity.id)
			}
		})
	})
}

export const useRequestsList = () => {
	const fetchRequests = async () => {
		try {
			await store.setError('')
			await store.setLoading(true)
			const conversations = await Logic.Conversations.GetTutorRequests({ all: true })
			conversations.results.forEach((r) => addToArray(store.requests.value, r, (e) => e.id, (e) => e.createdAt))
			store.fetched.value = true
		} catch (e) {
			await store.setError(e)
		}
		await store.setLoading(false)
	}

	onMounted(async () => {
		if (/* !store.fetched.value &&  */!store.loading.value) await fetchRequests()
		await store.listener.start()
	})
	onUnmounted(async () => {
		await store.listener.close()
	})

	const requests = computed(() => store.requests.value.filter((r) => r.pending && r.tutor.id === Logic.Auth.AuthUser?.id))

	return { ...store, requests }
}

export const useRequest = (id: string) => {
	const router = useRouter()
	const requestList = useRequestsList()

	const request = computed(() => store.requests.value.find((q) => q.id === id) ?? null)

	const acceptError = useErrorHandler()
	const acceptLoading = useLoadingHandler()

	const accept = async (accepted: boolean) => {
		if (acceptLoading.loading.value) return
		await acceptLoading.setLoading(true)
		await acceptError.setError('')
		try {
			const req = request.value
			if (!req) return
			if (!req.pending || req.tutor.id !== Logic.Auth.AuthUser?.id) return

			await Logic.Conversations.AcceptTutorRequest(id, accepted)
			await router.push(`/chats/${req.conversationId}`)
		} catch (e) {
			await acceptError.setError(e)
		}
		await acceptLoading.setLoading(false)
	}

	return { ...requestList, request, accept, ...acceptError, ...acceptLoading }
}