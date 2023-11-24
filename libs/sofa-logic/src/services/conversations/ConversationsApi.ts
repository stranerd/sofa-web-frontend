import {
  AddTutorInput,
  CreateMessageInput,
  DeleteTutorInput,
  StarMessageInput,
} from './../../logic/types/forms/conversations'
import { AxiosResponse } from 'axios'
import { ModelApiService } from '../common/ModelService'
import { Conversation, Message } from '../../logic/types/domains/conversations'
import { Paginated } from '../../logic/types/domains/common'
import { QueryParams } from 'src/logic'

export default class ConversationsApi extends ModelApiService {
  constructor() {
    super('conversations/conversations')
  }

  public async getMessages(conversationId: string, filters: QueryParams = {},) {
    try {
      const response: AxiosResponse<Paginated<
        Message
      >> = await this.axiosInstance.get(
        this.getUrl() + `/${conversationId}/messages`,
        {
          params: filters
        }
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

  public async addTutor(data: AddTutorInput) {
    try {
      const response: AxiosResponse<Conversation> = await this.axiosInstance.post(
        this.getUrl() + `/${data.id}/tutor`,
        data,
      )

      return response
    } catch (err) {
      this.handleErrors(err)
      if (err.response) {
      }
    }
  }

  public async deleteTutor(data: DeleteTutorInput) {
    try {
      const response: AxiosResponse<Conversation> = await this.axiosInstance.delete(
        this.getUrl() + `/${data.id}/tutor`,
        {
          data,
        },
      )

      return response
    } catch (err) {
      this.handleErrors(err)
      if (err.response) {
      }
    }
  }
}
