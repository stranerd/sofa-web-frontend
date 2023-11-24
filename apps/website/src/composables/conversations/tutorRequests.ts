import { ConversationTutorRequest, Logic } from 'sofa-logic'
import { addToArray } from 'valleyed'
import { onMounted, onUnmounted, ref } from 'vue'
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

	return { ...store }
}