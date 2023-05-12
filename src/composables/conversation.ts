import { Logic } from 'sofa-logic'
import { Conditions } from 'sofa-logic/src/logic/types/common'
import { ref } from 'vue'

const messageContent = ref('')

const createCoversation = (title: string) => {
  return Logic.Conversations.CreateConversation(title).then((response) => {
    return response
  })
}

const onInput = (e: any) => {
  messageContent.value = e.target.innerText
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-types
const sendNewMessage = (selectConversation: Function) => {
  if (messageContent.value) {
    sendMessage(messageContent.value, selectConversation)
    messageContent.value = ''
    document.getElementById('messageContainer').innerHTML = ''
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
const sendMessage = (content: string, selectConversation = undefined) => {
  if (Logic.Conversations.SingleConversation) {
    Logic.Conversations.CreateMessageForm = {
      body: content,
    }

    Logic.Conversations.CreateMessage(
      Logic.Conversations.SingleConversation.id,
      true,
    ).then(() => {
      Logic.Conversations.GetMessages(Logic.Conversations.SingleConversation.id)
    })
  } else {
    createCoversation(content).then((response) => {
      if (
        Logic.Common.mediaQuery() != 'sm' &&
        Logic.Common.mediaQuery() != 'md'
      ) {
        if (selectConversation) {
          selectConversation(response.id)
        }
      }
      Logic.Conversations.GetConversations({
        where: [
          {
            field: 'user.id',
            value: Logic.Auth.AuthUser.id,
            condition: Conditions.eq,
          },
        ],
      })
    })
  }
}

export {
  messageContent,
  createCoversation,
  sendMessage,
  onInput,
  sendNewMessage,
}
