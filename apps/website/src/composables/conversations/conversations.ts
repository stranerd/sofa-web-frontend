import { Conversation, ConversationFactory, Logic } from 'sofa-logic'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useListener } from '../core/listener'
import { useErrorHandler, useLoadingHandler, useSuccessHandler } from '../core/states'

const store = {
	conversations: ref<Conversation[]>([]),
	fetched: ref(false),
	...useLoadingHandler(),
	...useErrorHandler(),
	listener: useListener(async () => {
		return Logic.Common.listenToMany<Conversation>('conversations/conversations', {
			created: async (entity) => {
				Logic.addToArray(store.conversations.value, entity, (e) => e.id, (e) => (e.last?.createdAt ?? 0))
			},
			updated: async (entity) => {
				Logic.addToArray(store.conversations.value, entity, (e) => e.id, (e) => (e.last?.createdAt ?? 0))
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
			conversations.results.forEach((r) => Logic.addToArray(store.conversations.value, r, (e) => e.id, (e) => (e.last?.createdAt ?? 0)))
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
	const { setMessage } = useSuccessHandler()

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
			await setMessage('Tutor has been removed from this chats')
			await Logic.Common.GoToRoute('/chats')
		} catch (e) {
			error.setError(e)
		}
		loading.setLoading(false)
	}

	const deleteConversation = async () => {
		const confirmed = await Logic.Common.confirm({
			title: 'Are you sure?',
			sub: 'This action is permanent. All messages in this conversation would be lost',
			rightLabel: 'Yes, delete',
		})
		if (!confirmed) return
		if (loading.loading.value) return
		error.setError('')
		loading.setLoading(true)
		try {
			await Logic.Conversations.DeleteConversation(id)
			await setMessage('Conversation deleted')
			await Logic.Common.GoToRoute('/chats')
		} catch (e) {
			error.setError(e)
		}
		loading.setLoading(false)
	}

	const addTutor = async (data: { message: string, tutorId: string }) => {
		if (loading.loading.value) return false
		error.setError('')
		loading.setLoading(true)
		let errored = false
		try {
			await Logic.Conversations.CreateTutorRequest({
				...data,
				conversationId: id as string,
			})
			Logic.Common.showAlert({
				message: 'Tutor request sent',
				type: 'success',
			})
		} catch (e) {
			error.setError(e)
			errored = true
		}
		loading.setLoading(false)
		return !errored
	}

	return { ...conversationList, conversation, endSession, deleteConversation, addTutor }
}

export const useCreateConversation = () => {
	const { error, setError } = useErrorHandler()
	const { loading, setLoading } = useLoadingHandler()
	const factory = new ConversationFactory()
	const router = useRouter()

	const createConversation = async () => {
		await setError('')
		if (factory.valid && !loading.value) {
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