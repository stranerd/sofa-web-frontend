import { capitalize } from 'vue'
import { Logic } from '..'
import { $api } from '../../services'
import { Conditions, QueryParams } from '../types/common'
import { Paginated } from '../types/domains/common'
import {
  Conversation,
  Message,
  ConversationTutorRequest as TutorRequest,
} from '../types/domains/conversations'
import { Review } from '../types/domains/interactions'
import { SingleUser } from '../types/domains/users'
import {
  AddTutorInput,
  CreateMessageInput,
  CreateTutorRequestInput,
  DeleteTutorInput,
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
  public Reviews: Paginated<Review> | undefined
  public SingleReview: Review | undefined
  public AllTutorRequests: Paginated<TutorRequest> | undefined
  public SingleTutorRequest: TutorRequest | undefined
  public ChatMembers: SingleUser[] | undefined

  // form input
  public AddTutorForm: AddTutorInput | undefined
  public DeleteTutorForm: DeleteTutorInput | undefined
  public CreateMessageForm: CreateMessageInput | undefined
  public CreateTutorRequestForm: CreateTutorRequestInput | undefined

  public async GetConversations (filters: QueryParams) {
    const response = await $api.conversations.conversation.fetch(filters)
    this.AllConversations = response.data
    if (Logic.Users.getUserType() === 'student') await this.GetTutorRequests({})
    return this.AllConversations
  }

  public GetConversation = (id: string) => {
    if (!id || id == 'empty' || id == 'nill') {
      return new Promise((resolve) => {
        resolve('')
      })
    }
    return $api.conversations.conversation.get(id).then((response) => {
      this.SingleConversation = response.data
      return response.data
    })
  }

  public async GetTutorRequests (filters: QueryParams, fetchConvos = false) {
    const response = await $api.conversations.tutor_request.fetch(filters)
    this.AllTutorRequests = response.data
    if (fetchConvos) {
      const allConversations = this.AllTutorRequests.results.map((item) => item.conversationId)

      const allUsers = this.AllTutorRequests.results.map((item) => item.userId)

      await this.GetConversations({
        where: [
          {
            field: 'id',
            value: allConversations,
            condition: Conditions.in,
          },
        ],
      })

      await Logic.Users.GetUsers(
        {
          where: [
            {
              field: 'id',
              value: allUsers,
              condition: Conditions.in,
            },
          ],
        },
        false,
      ).then((users: SingleUser[]) => {
        users.forEach((user) => {
          this.AllTutorRequests.results.forEach((request) => {
            if (request.userId == user.id) {
              request.user = user
            }
          })
        })
      })
    }
    return this.AllTutorRequests
  }

  public GetTutorRequest = (id: string) => {
    return $api.conversations.tutor_request.get(id).then((response) => {
      this.SingleTutorRequest = response.data
      return response.data
    })
  }

  public GetMessages = (conversationId: string, filters: QueryParams = {}) => {
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
      })
  }

  public GetReviews = (filters: QueryParams) => {
    return $api.conversations.review.fetch(filters).then((response) => {
      this.Reviews = response.data
    })
  }

  public GetReview = (id: string) => {
    return $api.conversations.review
      .get(id)
      .then((response) => {
        this.SingleReview = response.data
      })
      .catch((error) => {
        //
      })
  }

  public CreateTutorRequest = () => {
    if (this.CreateTutorRequestForm) {
      Logic.Common.showLoader({
        loading: true,
        show: false,
      })
      return $api.conversations.tutor_request
        .post(null, this.CreateTutorRequestForm)
        .then((response) => {
          this.SingleTutorRequest = response.data
          Logic.Common.hideLoader()
          return response.data
        })
        .catch((error) => {
          Logic.Common.showError(capitalize(error.response.data[0]?.message))
        })
    }
  }

  public AcceptTutorRequest = (tutorRequestId: string, accept: boolean) => {
    Logic.Common.showLoader({
      loading: true,
      show: false,
    })
    return $api.conversations.tutor_request
      .acceptTutorRequest(tutorRequestId, accept)
      .then((response) => {
        if (accept) {
          Logic.Common.showLoader({
            show: true,
            message: 'Request has been accepted successfully',
            type: 'success',
          })
        } else {
          Logic.Common.showLoader({
            show: true,
            message: 'Request has been rejected successfully',
            type: 'success',
          })
        }

        return response.data
      })
      .catch((error) => {
        Logic.Common.showError(capitalize(error.response.data[0]?.message))
      })
  }

  public CreateConversation = (title: string) => {
    return $api.conversations.conversation
      .post(null, {
        body: title,
      })
      .then((response) => {
        this.SingleConversation = response.data
        return response.data
      })
  }

  public UpdateConversation = (title: string, uuid: string) => {
    return $api.conversations.conversation
      .put(null, uuid, {
        title: title,
      })
      .then((response) => {
        this.SingleConversation = response.data
        this.GetConversations({
          where: [
            {
              field: 'user.id',
              value: Logic.Auth.AuthUser?.id,
              condition: Conditions.eq,
            },
          ],
        })
        return response.data
      })
      .catch((error) => {
        //
      })
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
          if (message.id == response.data.id) {
            message = response.data
          }
        })
      })
      .catch((error) => {
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
        .createMessage(conversationId, this.CreateMessageForm)
        .then((response) => {
          this.SingleMessage = response.data
          return this.SingleMessage
        })
  }

  public DeleteConversation = (id: string) => {
    return $api.conversations.conversation.delete(id)
      .then((response) => response.data)
  }

  public DeleteTutorRequest = (tutorRequestId: string) => {
    return $api.conversations.tutor_request
      .delete(tutorRequestId)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        Logic.Common.showError(capitalize(error.response.data[0]?.message))
      })
  }

  public DeleteTutor = () => {
    Logic.Common.showLoader({
      loading: true,
      show: false,
    })
    return $api.conversations.conversation
      .deleteTutor(this.DeleteTutorForm)
      .then((response) => response.data)
  }
}
