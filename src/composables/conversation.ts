import { Logic } from 'sofa-logic'
import { Conditions } from 'sofa-logic/src/logic/types/common'
import { Message } from 'sofa-logic/src/logic/types/domains/conversations'
import { reactive, ref } from 'vue'
import { scrollToBottom } from './index'

export interface ChatListData {
  title: string
  selected: boolean
  subTitle: string
  icon?: string
  iconSize?: string
  id: string
  hover: boolean
  isDone: boolean
  photoUrl: string
  lastMessage: string
  unread: number
  lastMessageTime: string
  isRequest?: boolean
  convoId?: string
}

const messageContent = ref('')

const showLoader = ref(false)

const showDeleteConvo = ref(false)

const selectedConvoId = ref('')

const showEndSession = ref(false)

const showAddTutor = ref(false)

const showMoreOptions = ref(false)

const itIsNewMessage = ref(false)

const itIsTutorRequest = ref(false)

const conversationTitle = ref('New Chat')

const selectedTutorRequestData = ref<ChatListData>()

const selectedChatData = ref<ChatListData>({
  icon: 'conversation',
  iconSize: 'h-[35px]',
  selected: false,
  subTitle: 'New chat',
  title: 'New chat',
  id: '0',
  hover: false,
  isDone: false,
  photoUrl:
    Logic.Users.getUserType() == 'student'
      ? Logic.Users.UserProfile.ai?.photo?.link || '/images/icons/robot.svg'
      : '',
  lastMessage: 'No message',
  unread: 0,
  lastMessageTime: Logic.Common.fomartDate(new Date().getTime(), 'h:mma'),
})

const chatList = reactive<ChatListData[]>([])

const tutorRequestList = reactive<ChatListData[]>([])

const AllConversations = ref(Logic.Conversations.AllConversations)
const AllTutorRequests = ref(Logic.Conversations.AllTutorRequests)
const SingleConversation = ref(Logic.Conversations.SingleConversation)
const Messages = ref(Logic.Conversations.Messages)
const ChatMembers = ref(Logic.Conversations.ChatMembers)

const hasMessage = ref(false)

const addNewChat = (convoMessage = '') => {
  createCoversation(convoMessage).then((data) => {
    if (data) {
      if (
        Logic.Common.mediaQuery() != 'sm' &&
        Logic.Common.mediaQuery() != 'md'
      ) {
        showLoader.value = true
        selectConversation(data.id)
      } else {
        Logic.Common.GoToRoute('/chat/' + data.id)
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
    }
  })
}

const setChatToDefault = () => {
  selectedChatData.value = {
    icon: 'conversation',
    iconSize: 'h-[35px]',
    selected: false,
    subTitle: 'New chat',
    title: 'New chat',
    id: '0',
    hover: false,
    isDone: false,
    photoUrl:
      Logic.Users.getUserType() == 'student'
        ? Logic.Users.UserProfile.ai?.photo?.link || '/images/icons/robot.svg'
        : '',
    lastMessage: 'No message',
    unread: 0,
    lastMessageTime: Logic.Common.fomartDate(new Date().getTime(), 'h:mma'),
  }
}

const setConversations = (goToIndex = -1) => {
  chatList.length = 0
  AllConversations.value.results.forEach((convo, index) => {
    let photourl = ''

    if (Logic.Users.getUserType() == 'student') {
      photourl = !convo.tutor
        ? Logic.Users.UserProfile.ai?.photo?.link || '/images/icons/robot.svg'
        : convo.tutor?.bio.photo?.link || ''
    }

    if (Logic.Users.getUserType() == 'teacher') {
      photourl = convo.user.bio.photo?.link || ''
    }

    chatList.push({
      icon: 'conversation',
      iconSize: 'h-[35px]',
      selected: index == goToIndex,
      subTitle: convo.last.body,
      title: !convo.tutor ? convo.title : convo.tutor?.bio.name.full,
      id: convo.id,
      hover: false,
      isDone: false,
      photoUrl: photourl,
      lastMessage: convo.last.body || 'No message',
      unread: 0,
      lastMessageTime: Logic.Common.fomartDate(
        convo.last?.createdAt || new Date().getTime(),
        'h:mma',
      ),
    })
  })
  tutorRequestList.length = 0
  if (
    Logic.Users.getUserType() == 'teacher' ||
    Logic.Users.getUserType() == 'student'
  ) {
    AllTutorRequests.value.results.forEach((request) => {
      if (request.pending || Logic.Users.getUserType() == 'student') {
        tutorRequestList.push({
          icon: 'conversation',
          iconSize: 'h-[35px]',
          selected: false,
          subTitle: request.message,
          title: request.user?.bio?.name?.full,
          id: request.id,
          hover: false,
          isDone: false,
          photoUrl: request.user?.bio?.photo?.link || '',
          lastMessage: request.message,
          unread: 0,
          lastMessageTime: Logic.Common.fomartDate(
            request.createdAt || new Date().getTime(),
            'h:mma',
          ),
          convoId: request.conversationId,
        })
      }
    })
  }
}

const selectConversation = (convoId: string) => {
  showMoreOptions.value = false
  if (Logic.Common.mediaQuery() == 'md' || Logic.Common.mediaQuery() == 'sm') {
    showMoreOptions.value = false
    Logic.Common.GoToRoute('/chat/' + convoId)
    return
  }
  Logic.Common.showLoader({
    loading: true,
    show: false,
  })

  Logic.Conversations.GetConversation(convoId).then((response: any) => {
    if (response) {
      Logic.Conversations.GetMessages(convoId).then((responseData: any) => {
        if (responseData) {
          Logic.Common.setupWebsocket()

          setTimeout(() => {
            Logic.Common.listenOnSocket(
              `conversations/conversations/${SingleConversation.value.id}/messages`,
              (data) => {
                handleIncomingMessage(data)
              },
              (data) => {
                console.log(data)
              },
            )
          }, 100)

          if (Messages.value) {
            hasMessage.value = true
          }

          // scroll to bottom
          setTimeout(() => {
            scrollToBottom('MessagesScrollContainerLg')
          }, 1000)

          Logic.Common.hideLoader()

          chatList.forEach((item) => {
            if (item.id == SingleConversation.value.id) {
              item.selected = true
              selectedChatData.value = item
            } else {
              item.selected = false
            }
          })

          // set tutor request if it exists
          selectedTutorRequestData.value = undefined
          tutorRequestList.forEach((item) => {
            if (item.convoId == convoId) {
              selectedTutorRequestData.value = item
            }
          })
        }
      })
    }
  })
}

const createCoversation = (title: string) => {
  return Logic.Conversations.CreateConversation(title).then((response) => {
    return response
  })
}

const onInput = (e: any) => {
  messageContent.value = e.target.innerText
}

const handleKeyEvent = (e: any) => {
  if (e.keyCode == 13 && e.shiftKey) {
    return
  }

  if (e.key === 'Enter' || e.keyCode === 13) {
    sendNewMessage(undefined)
    e.preventDefault()
    return
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-types
const sendNewMessage = (selectConversation: Function | undefined) => {
  if (itIsNewMessage.value) {
    itIsNewMessage.value = false
    setConvoFromRoute(messageContent.value)
    messageContent.value = ''
  } else {
    if (messageContent.value) {
      sendMessage(messageContent.value, selectConversation)
      messageContent.value = ''
      document.getElementById('messageContainer').innerHTML = ''
    }
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
const sendMessage = (content: string, selectConversation = undefined) => {
  if (Logic.Conversations.SingleConversation) {
    Logic.Conversations.CreateMessageForm = {
      body: content,
    }

    const message: Message = {
      body: content,
      conversationId: Logic.Conversations.SingleConversation.id,
      createdAt: Date.now(),
      hash: Logic.Common.makeid(19),
      id: Logic.Common.makeid(19),
      readAt: Date.now(),
      starred: false,
      tags: [],
      updatedAt: Date.now(),
      userId: Logic.Auth.AuthUser.id,
      media: {
        link: '',
        name: '',
        path: '',
        size: 0,
        timestamp: Date.now(),
        type: '',
      },
    }
    const existingMessages = JSON.parse(
      JSON.stringify(Logic.Conversations.Messages),
    )
    existingMessages.results.push(message)

    Logic.Conversations.Messages = existingMessages

    showLoader.value = true

    Logic.Conversations.CreateMessage(
      Logic.Conversations.SingleConversation.id,
      true,
    )
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

const handleIncomingMessage = (data: any) => {
  const message: Message = data.data

  if (message.userId != Logic.Auth.AuthUser.id) {
    // check if message exist
    const currentMessage = Logic.Conversations.Messages.results.filter(
      (msg) => {
        return message.id == msg.id
      },
    )

    if (currentMessage.length == 0) {
      const existingMessages = JSON.parse(
        JSON.stringify(Logic.Conversations.Messages),
      )
      existingMessages.results.push(message)

      Logic.Conversations.Messages = existingMessages

      showLoader.value = false
    }
  }
}

const setConvoFromRoute = (message = '') => {
  const route = Logic.Common.route
  if (message) {
    addNewChat(message)
  } else {
    if (route.query?.id) {
      if (
        Logic.Common.mediaQuery() != 'sm' &&
        Logic.Common.mediaQuery() != 'md'
      ) {
        // showLoader.value = true
        selectConversation(route.query?.id.toString())
      } else {
        Logic.Common.GoToRoute('/chat/' + route.query?.id.toString())
      }
    } else if (route.query?.message) {
      addNewChat(route.query?.message.toString())
    }
  }
}

const deleteConvo = (id: string) => {
  if (Logic.Common.loaderSetup.loading) return
  Logic.Conversations.DeleteConversation(id)
}

const contentTitleChanged = (content) => {
  Logic.Common.debounce(() => {
    if (SingleConversation.value) {
      conversationTitle.value = content
      Logic.Conversations.UpdateConversation(
        content,
        SingleConversation.value.id,
      )
    }
  }, 700)
}

const acceptOrRejectTutorRequest = (accept: boolean) => {
  Logic.Conversations.AcceptTutorRequest(
    selectedTutorRequestData.value.id,
    accept,
  ).then(() => {
    itIsTutorRequest.value = false
    setChatToDefault()

    if (accept) {
      Logic.Conversations.GetTutorRequests(
        {
          where: [
            {
              field: 'tutor.id',
              condition: Conditions.eq,
              value: Logic.Auth.AuthUser?.id,
            },
          ],
        },
        true,
      ).then(() => {
        setConversations()
        selectConversation(selectedTutorRequestData.value.convoId)
      })
    }
  })
}

export {
  messageContent,
  showLoader,
  chatList,
  AllConversations,
  SingleConversation,
  Messages,
  hasMessage,
  showDeleteConvo,
  selectedConvoId,
  showAddTutor,
  showMoreOptions,
  conversationTitle,
  itIsNewMessage,
  AllTutorRequests,
  tutorRequestList,
  itIsTutorRequest,
  selectedTutorRequestData,
  selectedChatData,
  ChatMembers,
  showEndSession,
  setChatToDefault,
  setConvoFromRoute,
  selectConversation,
  setConversations,
  addNewChat,
  createCoversation,
  sendMessage,
  onInput,
  sendNewMessage,
  handleIncomingMessage,
  deleteConvo,
  handleKeyEvent,
  contentTitleChanged,
  acceptOrRejectTutorRequest,
}
