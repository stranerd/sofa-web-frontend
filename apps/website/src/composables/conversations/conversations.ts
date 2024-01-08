import { ConversationEntity, ConversationFactory, ConversationsUseCases } from '@modules/conversations'
import { Logic } from 'sofa-logic'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../auth/auth'
import { useListener } from '../core/listener'
import { useErrorHandler, useLoadingHandler, useSuccessHandler } from '../core/states'

const store = {
	conversations: ref<ConversationEntity[]>([]),
	fetched: ref(false),
	...useLoadingHandler(),
	...useErrorHandler(),
	listener: useListener(async () => {
		return await ConversationsUseCases.listenToAll({
			created: async (entity) => {
				Logic.addToArray(
					store.conversations.value,
					entity,
					(e) => e.id,
					(e) => e.last?.createdAt ?? 0,
				)
			},
			updated: async (entity) => {
				Logic.addToArray(
					store.conversations.value,
					entity,
					(e) => e.id,
					(e) => e.last?.createdAt ?? 0,
				)
			},
			deleted: async (entity) => {
				store.conversations.value = store.conversations.value.filter((m) => m.id !== entity.id)
			},
		})
	}),
}

export const useConversationsList = () => {
	const { id: authId } = useAuth()

	const fetchConversations = async () => {
		try {
			await store.setError('')
			await store.setLoading(true)
			const conversations = await ConversationsUseCases.getAll()
			conversations.results.forEach((r) =>
				Logic.addToArray(
					store.conversations.value,
					r,
					(e) => e.id,
					(e) => e.last?.createdAt ?? 0,
				),
			)
			store.fetched.value = true
		} catch (e) {
			await store.setError(e)
		}
		await store.setLoading(false)
	}

	onMounted(async () => {
		if (!store.fetched.value && !store.loading.value) await fetchConversations()
		await store.listener.start()
	})
	onUnmounted(async () => {
		await store.listener.close()
	})

	const conversations = computed(() =>
		store.conversations.value.filter((c) => !c.pending && (c.tutor?.id === authId.value ? c.accepted?.is : true)),
	)
	const requests = computed(() => store.conversations.value.filter((c) => c.pending && c.tutor?.id === authId.value))
	const pending = computed(() => store.conversations.value.filter((c) => c.pending && c.user.id === authId.value))

	return { ...store, conversations, requests, pending }
}

export const useConversation = (id: string) => {
	const conversationList = useConversationsList()
	const error = useErrorHandler()
	const loading = useLoadingHandler()
	const { setMessage } = useSuccessHandler()

	const { id: authId } = useAuth()
	const router = useRouter()

	const conversation = computed(() => store.conversations.value.find((q) => q.id === id) ?? null)

	const end = async (reviewData: { rating: number; message: string }) => {
		if (loading.loading.value) return
		error.setError('')
		loading.setLoading(true)
		try {
			await ConversationsUseCases.end(id, reviewData)
			await setMessage('Conversation has ended')
			await Logic.Common.GoToRoute('/chats')
		} catch (e) {
			error.setError(e)
		}
		loading.setLoading(false)
	}

	const deleteConv = async () => {
		const confirmed = await Logic.Common.confirm({
			title: 'Are you sure?',
			sub: 'This action is permanent. All messages in this conversation would be lost',
			right: { label: 'Yes, delete' },
		})
		if (!confirmed) return
		if (loading.loading.value) return
		error.setError('')
		loading.setLoading(true)
		try {
			await ConversationsUseCases.delete(id)
			await setMessage('Conversation deleted')
			await Logic.Common.GoToRoute('/chats')
		} catch (e) {
			error.setError(e)
		}
		loading.setLoading(false)
	}

	const accept = async (accepted: boolean) => {
		if (loading.loading.value) return
		await loading.setLoading(true)
		await error.setError('')
		try {
			const conv = conversation.value
			if (!conv || !conv.pending || conv.tutor.id !== authId.value) return
			await ConversationsUseCases.accept(id, accepted)
			await setMessage(`Request has been ${accepted ? 'accepted' : 'rejected'} successfully`)
			if (accepted) await router.push(`/chats/${id}`)
			else await router.push('/chats')
		} catch (e) {
			await error.setError(e)
		}
		await loading.setLoading(false)
	}

	return { ...conversationList, conversation, end, deleteConv, accept }
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
				const conversation = await ConversationsUseCases.add(factory)
				factory.reset()
				await router.push(`/chats/${conversation.id}`)
				if (conversation.tutor)
					await Logic.Common.success({
						title: 'Tutor request sent!',
						sub: 'You will get notified when the tutor responds',
						button: { label: 'Done' },
					})
			} catch (error) {
				await setError(error)
			}
			await setLoading(false)
		} else factory.validateAll()
	}

	return { error, loading, factory, createConversation }
}
