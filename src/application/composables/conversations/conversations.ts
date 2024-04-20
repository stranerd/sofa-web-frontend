import { addToArray } from 'valleyed'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../auth/auth'
import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'
import { useSuccessHandler } from '../core/states'
import { ConversationEntity, ConversationFactory, ConversationsUseCases } from '@modules/conversations'

const store = {
	conversations: ref<ConversationEntity[]>([]),
	listener: useListener(
		async () =>
			await ConversationsUseCases.listenToAll({
				created: async (entity) => {
					addToArray(
						store.conversations.value,
						entity,
						(e) => e.id,
						(e) => e.last?.createdAt ?? 0,
					)
				},
				updated: async (entity) => {
					addToArray(
						store.conversations.value,
						entity,
						(e) => e.id,
						(e) => e.last?.createdAt ?? 0,
					)
				},
				deleted: async (entity) => {
					store.conversations.value = store.conversations.value.filter((m) => m.id !== entity.id)
				},
			}),
	),
}

export const useConversationsList = () => {
	const { id: authId } = useAuth()

	const {
		asyncFn: fetchConversations,
		loading,
		error,
		called,
	} = useAsyncFn(
		async () => {
			const conversations = await ConversationsUseCases.getAll()
			conversations.results.forEach((r) =>
				addToArray(
					store.conversations.value,
					r,
					(e) => e.id,
					(e) => e.last?.createdAt ?? 0,
				),
			)
		},
		{ key: 'conversations/conversations/all' },
	)

	onMounted(async () => {
		if (!called.value) await fetchConversations()
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

	return { ...store, loading, error, conversations, requests, pending }
}

export const useConversation = (id: string) => {
	const { id: authId } = useAuth()
	const router = useRouter()
	useConversationsList()
	const conversation = computed(() => store.conversations.value.find((q) => q.id === id) ?? null)
	const { setMessage } = useSuccessHandler()
	const {
		asyncFn: end,
		loading: endLoading,
		error: endError,
	} = useAsyncFn(async (reviewData: { rating: number; message: string }) => {
		await ConversationsUseCases.end(id, reviewData)
		await setMessage('Conversation has ended')
		await router.push('/chats')
		return true
	})
	const {
		asyncFn: deleteConv,
		loading: deleteConvLoading,
		error: deleteConvError,
	} = useAsyncFn(
		async () => {
			await ConversationsUseCases.delete(id)
			await setMessage('Conversation deleted')
			await router.push('/chats')
		},
		{
			pre: async () =>
				await $utils.confirm({
					title: 'Are you sure?',
					sub: 'This action is permanent. All messages in this conversation would be lost',
					right: { label: 'Yes, delete' },
				}),
		},
	)
	const {
		asyncFn: accept,
		loading: acceptLoading,
		error: acceptError,
	} = useAsyncFn(async (accepted: boolean) => {
		const conv = conversation.value
		if (!conv || !conv.pending || conv.tutor?.id !== authId.value) return
		await ConversationsUseCases.accept(id, accepted)
		await setMessage(`Request has been ${accepted ? 'accepted' : 'rejected'} successfully`)
		if (accepted) await router.push(`/chats/${id}`)
		else await router.push('/chats')
	})

	return {
		conversation,
		end,
		endLoading,
		endError,
		deleteConv,
		deleteConvLoading,
		deleteConvError,
		accept,
		acceptLoading,
		acceptError,
	}
}

export const useCreateConversation = () => {
	const factory = new ConversationFactory()
	const router = useRouter()
	const {
		asyncFn: createConversation,
		loading,
		error,
	} = useAsyncFn(async () => {
		const conversation = await ConversationsUseCases.add(factory)
		factory.reset()
		await router.push(`/chats/${conversation.id}`)
		if (conversation.tutor)
			await $utils.success({
				title: 'Tutor request sent!',
				sub: 'You will get notified when the tutor responds',
				button: { label: 'Done' },
			})
	})

	return { error, loading, factory, createConversation }
}
