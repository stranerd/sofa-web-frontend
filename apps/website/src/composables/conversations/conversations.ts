import { Conversation, ConversationFactory, Logic } from 'sofa-logic'
import { addToArray } from 'valleyed'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useListener } from '../core/listener'
import { useErrorHandler, useLoadingHandler } from '../core/states'

const store = {
	conversations: ref<Conversation[]>([]),
	fetched: ref(false),
	...useLoadingHandler(),
	...useErrorHandler(),
	listener: useListener(async () => {
		return Logic.Common.listenToMany<Conversation>('conversations/conversations', {
			created: async (entity) => {
				addToArray(store.conversations.value, entity, (e) => e.id, (e) => (e.last?.createdAt ?? 0))
			},
			updated: async (entity) => {
				addToArray(store.conversations.value, entity, (e) => e.id, (e) => (e.last?.createdAt ?? 0))
			},
			deleted: async (entity) => {
				store.conversations.value = store.conversations.value.filter((m) => m.id !== entity.id)
			}
		})
	})
}

export const useConversationsList = () => {
	const fetchConversations = async () => {
		try {
			await store.setError('')
			await store.setLoading(true)
			const conversations = await Logic.Conversations.GetConversations({ all: true })
			conversations.results.forEach((r) => addToArray(store.conversations.value, r, (e) => e.id, (e) => (e.last?.createdAt ?? 0)))
			store.fetched.value = true
		} catch (e) {
			await store.setError(e)
		}
		await store.setLoading(false)
	}

	onMounted(async () => {
		if (/* !store.fetched.value &&  */!store.loading.value) await fetchConversations()
		await store.listener.start()
	})
	onUnmounted(async () => {
		await store.listener.close()
	})

	return { ...store }
}

export const useConversation = (id: string) => {
	const conversationList = useConversationsList()
	const error = useErrorHandler()
	const loading = useLoadingHandler()

	const conversation = computed(() => store.conversations.value.find((q) => q.id === id) ?? null)

	const endSession = async (reviewData: { ratings: number; review: string }) => {
		if (loading.loading.value) return
		error.setError('')
		loading.setLoading(true)
		try {
			Logic.Conversations.DeleteTutorForm = {
				id,
				message: reviewData.review,
				rating: reviewData.ratings,
			}

			await Logic.Conversations.DeleteTutor()
			Logic.Common.showLoader({
				show: true,
				message: 'Tutor has been removed from this chat',
				type: 'success',
			})
			await Logic.Common.GoToRoute('/chats')
		} catch (e) {
			error.setError(e)
		}
		loading.setLoading(false)
	}

	const deleteConversation = async () => {
		if (loading.loading.value) return
		error.setError('')
		loading.setLoading(true)
		try {
			await Logic.Conversations.DeleteConversation(id)
			Logic.Common.showLoader({
				show: true,
				message: 'Conversation deleted',
				type: 'success',
			})
			await Logic.Common.GoToRoute('/chats')
		} catch (e) {
			error.setError(e)
		}
		loading.setLoading(false)
	}

	return { ...conversationList, conversation, endSession, deleteConversation }
}

export const useCreateConversation = () => {
	const { error, setError } = useErrorHandler()
	const { loading, setLoading } = useLoadingHandler()
	const factory = new ConversationFactory()
	const router = useRouter()

	const createConversation = async () => {
		await setError('')
		if (factory.title && !loading.value) {
			try {
				await setLoading(true)
				const conversation = await Logic.Conversations.CreateConversation(factory.title)
				factory.reset()
				await router.push(`/chats/${conversation.id}`)
			} catch (error) {
				await setError(error)
			}
			await setLoading(false)
		} else factory.validateAll()
	}

	return { error, loading, factory, createConversation }
}