import { $api } from '../../services'
import { QueryParams } from '../types/common'
import { Paginated } from '../types/domains/common'
import { Conversation, Message } from '../types/domains/conversations'
import {
	CreateConversationInput,
	CreateMessageInput,
	EndConversationInput
} from '../types/forms/conversations'
import Common from './Common'

export default class Conversations extends Common {
	constructor() {
		super()
	}

	public AllConversations: Paginated<Conversation> | undefined
	public SingleConversation: Conversation | undefined
	public Messages: Paginated<Message> | undefined
	public SingleMessage: Message | undefined

	public async GetConversations (filters: QueryParams) {
		const response = await $api.conversations.conversation.fetch(filters)
		this.AllConversations = response.data
		return this.AllConversations
	}

	public async GetConversation (id: string) {
		return $api.conversations.conversation.get(id).then((response) => {
			this.SingleConversation = response.data
			return this.SingleConversation
		})
	}

	public async GetMessages (conversationId: string, filters: QueryParams = {}) {
		return $api.conversations.conversation
			.getMessages(conversationId, filters)
			.then((response) => {
				this.Messages = response.data
				return this.Messages
			})
	}

	public GetMessage = (conversationId: string, messageId: string) => {
		return $api.conversations.conversation
			.getMessage(conversationId, messageId)
			.then((response) => {
				this.SingleMessage = response.data
				return this.SingleMessage
			})
	}

	public async CreateConversation (data: CreateConversationInput) {
		return $api.conversations.conversation
			.post(null, data)
			.then((response) => {
				this.SingleConversation = response.data
				return this.SingleConversation
			})
	}

	public UpdateConversation = (title: string, uuid: string) => {
		return $api.conversations.conversation
			.put(null, uuid, { title: title })
			.then((response) => {
				this.SingleConversation = response.data
				return this.SingleConversation
			})
	}

	public async accept (id: string, accept: boolean) {
		return $api.conversations.conversation.accept(id, accept)
	}

	public async end (id: string, data: EndConversationInput) {
		return $api.conversations.conversation.end(id, data)
	}

	public StarMessage = (
		conversationId: string,
		messageId: string,
		starred: boolean,
	) => {
		return $api.conversations.conversation
			.starMessage(conversationId, messageId, { starred })
			.then((response) => {
				this.SingleMessage = response.data
				this.Messages.results.forEach((message) => {
					if (message.id == response.data.id) message = response.data
				})
			})
			.catch(() => {
				//
			})
	}

	public MarkMessages = (conversationId: string) => {
		return $api.conversations.conversation
			.markMessagesAsRead(conversationId)
			.then((response) => {
				return response.data
			})
	}

	public CreateMessage = (conversationId: string, CreateMessageForm: CreateMessageInput) => {
		return $api.conversations.conversation
			.createMessage(conversationId, CreateMessageForm)
			.then((response) => {
				this.SingleMessage = response.data
				return this.SingleMessage
			})
	}

	public DeleteConversation = (id: string) => {
		return $api.conversations.conversation.delete(id)
			.then((response) => response.data)
	}
}
