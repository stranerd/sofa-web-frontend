import { AxiosResponse } from 'axios'
import { Paginated, QueryParams } from '../../logic'
import { Conversation, Message } from '../../logic/types/domains/conversations'
import { ModelApiService } from '../common/ModelService'
import {
	CreateMessageInput,
	EndConversationInput,
	StarMessageInput,
} from './../../logic/types/forms/conversations'

export default class ConversationsApi extends ModelApiService {
	constructor() {
		super('conversations/conversations')
	}

	public async getMessages(conversationId: string, filters: QueryParams = {},) {
		try {
			const response: AxiosResponse<Paginated<Message>> = await this.axiosInstance.get(this.getUrl() + `/${conversationId}/messages`,
				{ params: filters }
			)

			return response
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}

	public async getMessage(conversationId: string, messageId: string) {
		try {
			const response: AxiosResponse<Message> = await this.axiosInstance.get(
				this.getUrl() + `/${conversationId}/messages/${messageId}`,
			)

			return response
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}

	public async starMessage(
		conversationId: string,
		messageId: string,
		data: StarMessageInput,
	) {
		try {
			const response: AxiosResponse<Message> = await this.axiosInstance.post(
				this.getUrl() + `/${conversationId}/messages/${messageId}/star`,
				data,
			)

			return response
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}

	public async markMessagesAsRead(conversationId: string) {
		try {
			const response: AxiosResponse<boolean> = await this.axiosInstance.put(
				this.getUrl() + `/${conversationId}/messages/read`,
			)

			return response
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}

	public async createMessage(conversationId: string, data: CreateMessageInput) {
		try {
			const response: AxiosResponse<Message> = await this.axiosInstance.post(
				this.getUrl() + `/${conversationId}/messages`,
				data,
			)

			return response
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}

	public async end(id: string, data: EndConversationInput) {
		try {
			const response: AxiosResponse<Conversation> = await this.axiosInstance.post(
				this.getUrl() + `/${id}/end`,
				data,
			)
			return response.data
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}

	public async accept(id: string, accept: boolean) {
		try {
			const response: AxiosResponse<Conversation> = await this.axiosInstance.post(
				this.getUrl() + `/${id}/accept`,
				{ accept }
			)
			return response.data
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}
}
