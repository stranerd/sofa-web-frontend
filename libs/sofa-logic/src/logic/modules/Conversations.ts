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

  public GetConversations = (filters: QueryParams) => {
    return new Promise((resolve) => {
      $api.conversations.conversation.fetch(filters).then((response) => {
        this.AllConversations = response.data
        if (Logic.Users.getUserType() == 'student') {
          this.GetTutorRequests({
            where: [
              {
                field: 'userId',
                value: Logic.Auth.AuthUser.id,
                condition: Conditions.eq,
              },
            ],
          }).then(() => {
            resolve('')
          })
        } else {
          resolve('')
        }
      })
    })
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

  public GetTutorRequests = (filters: QueryParams, fetchConvos = false) => {
    return new Promise((resolve) => {
      $api.conversations.tutor_request.fetch(filters).then((response) => {
        this.AllTutorRequests = response.data
        if (fetchConvos) {
          const itemsFetched = []

          const allConversations = this.AllTutorRequests.results.map(
            (item) => item.conversationId,
          )

          const allUsers = this.AllTutorRequests.results.map(
            (item) => item.userId,
          )

          this.GetConversations({
            where: [
              {
                field: 'id',
                value: allConversations,
                condition: Conditions.in,
              },
            ],
          }).then(() => {
            itemsFetched.push('convos')
            if (itemsFetched.length == 2) {
              resolve('')
            }
          })

          Logic.Users.GetUsers(
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
            itemsFetched.push('users')
            if (itemsFetched.length == 2) {
              resolve('')
            }
          })
        } else {
          resolve('')
        }
      })
    })
  }

  public GetTutorRequest = (id: string) => {
    return $api.conversations.tutor_request.get(id).then((response) => {
      this.SingleTutorRequest = response.data
      return response.data
    })
  }

  public GetMessages = (conversationId: string) => {
    if (!conversationId || conversationId == 'empty') {
      return new Promise((resolve) => {
        resolve('')
      })
    }
    return new Promise((resolve) => {
      $api.conversations.conversation
        .getMessages(conversationId)
        .then((response) => {
          this.Messages = response.data
          // get all chat members
          const membersIds = this.Messages.results.map((item) => item.userId)

          const otherMembers = membersIds.filter(
            (item) => item != 'ai-bot' && item != Logic.Auth.AuthUser.id,
          )

          if (otherMembers.length) {
            Logic.Users.GetUsers(
              {
                where: [
                  {
                    field: 'id',
                    value: otherMembers,
                    condition: Conditions.in,
                  },
                ],
              },
              false,
            ).then((users: SingleUser[]) => {
              this.ChatMembers = users
              resolve(response.data)
            })
          } else {
            resolve(response.data)
          }
        })
        .catch(() => {
          resolve('')
        })
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
      .catch((error) => {
        Logic.Common.showError(capitalize(error.response.data[0]?.message))
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
        //
      })
      .catch((error) => {
        //
      })
  }

  public CreateMessage = (conversationId: string, formIsValid: boolean) => {
    if (formIsValid && this.CreateMessageForm) {
      return $api.conversations.conversation
        .createMessage(conversationId, this.CreateMessageForm)
        .then((response) => {
          this.SingleMessage = response.data
        })
        .catch((error) => {
          //
        })
    }
  }

  public DeleteConversation = (id: string) => {
    Logic.Common.showLoader({
      loading: true,
      show: false,
    })
    return $api.conversations.conversation
      .delete(id)
      .then((response) => {
        this.GetConversations({
          where: [
            {
              field: 'user.id',
              value: Logic.Auth.AuthUser?.id,
              condition: Conditions.eq,
            },
          ],
        }).then(() => {
          Logic.Common.hideLoader()
        })
      })
      .then((error) => {
        //
      })
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
      .then((response) => {
        this.GetConversations({
          where: [
            {
              field: 'user.id',
              value: Logic.Auth.AuthUser?.id,
              condition: Conditions.eq,
            },
          ],
        }).then(() => {
          Logic.Common.showLoader({
            show: true,
            message: 'Tutor has been removed from this chat',
            type: 'success',
          })
        })
        return response.data
      })
      .catch((error) => {
        Logic.Common.showError(capitalize(error.response.data[0]?.message))
      })
  }
}
