import { addToArray } from 'valleyed'
import { Ref, computed, onMounted, onUnmounted, ref } from 'vue'
import { useAuth } from '../auth/auth'
import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'
import { createStore } from '../core/store'
import { ConversationEntity, MessageEntity, MessageFactory, MessagesUseCases } from '@modules/conversations'

const store = createStore(
	<
		Record<
			string,
			{
				messages: Ref<MessageEntity[]>
				hasMore: Ref<boolean>
				listener: ReturnType<typeof useListener>
			}
		>
	>{},
	'conversations/messages',
)

export const useMessages = (conversation: ConversationEntity) => {
	const conversationId = conversation.id

	const { userAi } = useAuth()

	if (store[conversationId] === undefined) {
		const listener = useListener(() =>
			MessagesUseCases.listen(
				conversationId,
				{
					created: async (entity) => {
						addToArray(
							store[conversationId].messages.value,
							entity,
							(e) => e.id,
							(e) => e.createdAt,
						)
					},
					updated: async (entity) => {
						addToArray(
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
			),
		)
		store[conversationId] = {
			messages: ref([]),
			hasMore: ref(false),
			listener,
		}
	}

	const {
		asyncFn: fetchMessages,
		loading,
		error,
		called,
	} = useAsyncFn(
		async () => {
			const c = await MessagesUseCases.get(conversationId, store[conversationId].messages.value.at(-1)?.createdAt)
			store[conversationId].hasMore.value = !!c.pages.next
			c.results.map((c) =>
				addToArray(
					store[conversationId].messages.value,
					c,
					(e) => e.id,
					(e) => e.createdAt,
				),
			)
		},
		{ key: `conversations/messages/${conversationId}` },
	)

	const fetchOlderMessages = async () => {
		await fetchMessages()
		await store[conversationId].listener.restart()
	}

	onMounted(async () => {
		if (!called.value) await fetchMessages()
		await store[conversationId].listener.start()
	})
	onUnmounted(async () => {
		await store[conversationId].listener.close()
	})

	const users = computed(() =>
		[conversation.user, conversation.tutor].filter(Boolean).reduce(
			(acc, cur) => {
				acc[cur.id] = {
					name: cur.bio.publicName,
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
		called,
		loading,
		error,
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
	const factory = new MessageFactory()
	const {
		asyncFn: createMessage,
		loading,
		error,
	} = useAsyncFn(async () => {
		await MessagesUseCases.add(conversationId, factory)
		factory.reset()
	})

	return { error, loading, factory, createMessage }
}
