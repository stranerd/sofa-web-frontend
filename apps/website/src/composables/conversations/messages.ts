import { ConversationEntity, MessageEntity, MessageFactory, MessagesUseCases } from '@modules/conversations'
import { Logic } from 'sofa-logic'
import { Ref, computed, onMounted, onUnmounted, ref } from 'vue'
import { useAuth } from '../auth/auth'
import { useListener } from '../core/listener'
import { useErrorHandler, useLoadingHandler } from '../core/states'

const store = {} as Record<
	string,
	{
		messages: Ref<MessageEntity[]>
		fetched: Ref<boolean>
		hasMore: Ref<boolean>
		listener: ReturnType<typeof useListener>
	} & ReturnType<typeof useErrorHandler> &
		ReturnType<typeof useLoadingHandler>
>

export const useMessages = (conversation: ConversationEntity) => {
	const conversationId = conversation.id

	const { userAi } = useAuth()

	if (store[conversationId] === undefined) {
		const listener = useListener(() => {
			return MessagesUseCases.listen(
				conversationId,
				{
					created: async (entity) => {
						Logic.addToArray(
							store[conversationId].messages.value,
							entity,
							(e) => e.id,
							(e) => e.createdAt,
						)
					},
					updated: async (entity) => {
						Logic.addToArray(
							store[conversationId].messages.value,
							entity,
							(e) => e.id,
							(e) => e.createdAt,
						)
					},
					deleted: async (entity) => {
						const index = store[conversationId].messages.value.findIndex((c) => c.id === entity.id)
						if (index !== -1) store[conversationId].messages.value.splice(index, 1)
					},
				},
				store[conversationId].messages.value.at(-1)?.createdAt,
			)
		})
		store[conversationId] = {
			messages: ref([]),
			fetched: ref(false),
			hasMore: ref(false),
			listener,
			...useErrorHandler(),
			...useLoadingHandler(),
		}
	}

	const fetchMessages = async () => {
		await store[conversationId].setError('')
		try {
			await store[conversationId].setLoading(true)
			const c = await MessagesUseCases.get(conversationId, store[conversationId].messages.value.at(-1)?.createdAt)
			store[conversationId].hasMore.value = !!c.pages.next
			c.results.map((c) =>
				Logic.addToArray(
					store[conversationId].messages.value,
					c,
					(e) => e.id,
					(e) => e.createdAt,
				),
			)
			store[conversationId].fetched.value = true
		} catch (e) {
			await store[conversationId].setError(e)
		}
		await store[conversationId].setLoading(false)
	}

	const fetchOlderMessages = async () => {
		await fetchMessages()
		await store[conversationId].listener.restart()
	}

	onMounted(async () => {
		if (!store[conversationId].fetched.value && !store[conversationId].loading.value) await fetchMessages()
		await store[conversationId].listener.start()
	})
	onUnmounted(async () => {
		await store[conversationId].listener.close()
	})

	const users = computed(() =>
		[conversation.user, conversation.tutor].filter(Boolean).reduce(
			(acc, cur) => {
				acc[cur.id] = {
					name: cur.bio.name.full,
					photoUrl: cur.bio.photo?.link ?? null,
				}
				return acc
			},
			{ 'ai-bot': { name: userAi.value.name, photoUrl: userAi.value.image } } as Record<
				string,
				{ name: string; photoUrl: string | null }
			>,
		),
	)

	return {
		users,
		messages: computed(() => [...store[conversationId].messages.value].reverse()),
		fetched: store[conversationId].fetched,
		loading: store[conversationId].loading,
		error: store[conversationId].error,
		hasMore: store[conversationId].hasMore,
		fetchOlderMessages,
	}
}

export const useMessage = (message: MessageEntity) => {
	const { id } = useAuth()

	const markMessageRead = async () => {
		await MessagesUseCases.markRead(message.conversationId).catch()
	}
	onMounted(async () => {
		if (!message.readAt[id.value]) await markMessageRead()
	})
	return { markMessageRead }
}

export const useCreateMessage = (conversationId: string) => {
	const { error, setError } = useErrorHandler()
	const { loading, setLoading } = useLoadingHandler()
	const factory = new MessageFactory()

	const createMessage = async () => {
		await setError('')
		if (factory.valid && !loading.value) {
			try {
				await setLoading(true)
				await MessagesUseCases.add(conversationId, factory)
				factory.reset()
			} catch (error) {
				await setError(error)
			}
			await setLoading(false)
		} else factory.validateAll()
	}

	return { error, loading, factory, createMessage }
}
