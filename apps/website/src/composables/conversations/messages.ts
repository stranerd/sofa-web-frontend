import { Conditions, Conversation, Logic, Message, MessageFactory, SingleUser } from 'sofa-logic'
import { Ref, computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useListener } from '../core/listener'
import { useErrorHandler, useLoadingHandler } from '../core/states'

const store = {} as Record<string, {
	messages: Ref<Message[]>
	users: Ref<SingleUser[]>
	fetched: Ref<boolean>
	hasMore: Ref<boolean>
	listener: ReturnType<typeof useListener>
} & ReturnType<typeof useErrorHandler> & ReturnType<typeof useLoadingHandler>>

export const useMessages = (conversation: Conversation) => {
	const conversationId = conversation.id

	if (store[conversationId] === undefined) {
		const listener = useListener(async () => await Logic.Common.listenToMany<Message>(`conversations/conversations/${conversationId}/messages`, {
			created: async (entity) => {
				Logic.addToArray(store[conversationId].messages.value, entity, (e) => e.id, (e) => e.createdAt)
			},
			updated: async (entity) => {
				Logic.addToArray(store[conversationId].messages.value, entity, (e) => e.id, (e) => e.createdAt)
			},
			deleted: async (entity) => {
				const index = store[conversationId].messages.value.findIndex((c) => c.id === entity.id)
				if (index !== -1) store[conversationId].messages.value.splice(index, 1)
			}
		}, (e) => e.createdAt >= (store[conversationId].messages.value.at(-1)?.createdAt ?? 0)))
		store[conversationId] = {
			messages: ref([]),
			users: ref([]),
			fetched: ref(false),
			hasMore: ref(false),
			listener,
			...useErrorHandler(),
			...useLoadingHandler()
		}
	}

	const fetchMessages = async () => {
		await store[conversationId].setError('')
		try {
			await store[conversationId].setLoading(true)
			const c = await Logic.Conversations.GetMessages(conversationId, {
				sort: [{ field: 'createdAt', desc: true }],
				all: true
				// limit: CHAT_PAGINATION_LIMIT
			})
			store[conversationId].hasMore.value = !!c.pages.next
			c.results.map((c) => Logic.addToArray(store[conversationId].messages.value, c, (e) => e.id, (e) => e.createdAt))
			store[conversationId].fetched.value = true
		} catch (e) {
			await store[conversationId].setError(e)
		}
		await store[conversationId].setLoading(false)
	}

	const fetchUsers = async () => {
		const ids = store[conversationId].messages.value.map((m) => m.userId)
			.filter((id) => id !== 'ai-bot' && id !== conversation.user.id && id !== conversation.tutor?.id)

		if (!ids.length) {
			store[conversationId].users.value = []
			return
		}

		const users = await Logic.Users.GetUsers({
			where: [{ field: 'id', value: ids, condition: Conditions.in }],
			all: true
		}, false)
		store[conversationId].users.value = users.results
	}

	watch(store[conversationId].messages, fetchUsers)

	const fetchOlderMessages = async () => {
		await fetchMessages()
		await store[conversationId].listener.restart()
	}

	onMounted(async () => {
		if (/* !store[conversationId].fetched.value &&  */!store[conversationId].loading.value) await fetchMessages()
		await store[conversationId].listener.start()
	})
	onUnmounted(async () => {
		await store[conversationId].listener.close()
	})

	const users = computed(() => [...store[conversationId].users.value, conversation.user, conversation.tutor]
		.filter(Boolean)
		.reduce((acc, cur) => {
			acc[cur.id] = {
				name: cur.bio.name.full,
				photoUrl: cur.bio.photo?.link ?? null
			}
			return acc
		}, { 'ai-bot': { name: Logic.Users.UserProfile?.ai?.name ?? 'Dr. Sofa', photoUrl: Logic.Users.UserProfile?.ai?.photo?.link ?? '/images/icons/robot.svg' } } as Record<string, { name: string, photoUrl: string | null }>)
	)

	return {
		users,
		messages: computed(() => [...store[conversationId].messages.value].reverse()),
		fetched: store[conversationId].fetched,
		loading: store[conversationId].loading,
		error: store[conversationId].error,
		hasMore: store[conversationId].hasMore,
		fetchOlderMessages
	}
}

export const useMessage = (message: Message) => {
	const markMessageRead = async () => {
		await Logic.Conversations.MarkMessages(message.conversationId).catch()
	}
	onMounted(async () => {
		if (!message.readAt[Logic.Auth.AuthUser?.id]) await markMessageRead()
	})
	return { markChatRead: markMessageRead }
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
				await Logic.Conversations.CreateMessage(conversationId, await factory.toModel())
				factory.reset()
			} catch (error) {
				await setError(error)
			}
			await setLoading(false)
		} else factory.validateAll()
	}

	return { error, loading, factory, createMessage }
}