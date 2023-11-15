import {
  Conditions, Conversation, Logic, Message,
  ConversationTutorRequest as TutorRequest
} from 'sofa-logic'
import { computed, reactive, ref } from 'vue'
import { scrollToBottom } from './index'

export const contentList = [
  {
    icon: "master-subject",
    title: "Master your subjects",
    body: "Ask for answers, explanations, feedback on work, and anything else to help you learn better",
  },
  {
    icon: "study-skill",
    title: "Hone great study skills",
    body: "Get better at time management, planning, scheduling, and many other skills with Dr. Sofa",
  },
  {
    icon: "chat-category",
    title: "Chat categorization",
    body: "Have separate chats for each topic you want to learn under courses, subjects, or study skills",
  },
  {
    icon: "study-material",
    title: "Creating study materials",
    body: "Dr. Sofa can take information you give it to create quizzes or courses for you to study with",
  },
  {
    icon: "personal-learning",
    title: "Personalized learning",
    body: "The more you interact with, and give information to Dr. Sofa, the better it gets at helping you",
  },
  {
    icon: "extra-hand",
    title: "An extra hand",
    body: "Add a tutor to a chat for a while to better help you learn beyond the limits of Dr. Sofa",
  },
]

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

export const showNeedsSubscription = ref(false)

const showMoreOptions = ref(false)

const itIsNewMessage = computed(() => ['/chats/', '/chats/new'].includes(Logic.Common.route.path))

const showRateAndReviewTutor = ref(false)

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
      ? Logic.Users.UserProfile?.ai?.photo?.link || '/images/icons/robot.svg'
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

const addNewChat = async (convoMessage = '') => {
  return createCoversation(convoMessage).then(async (data) => {
    if (data) {
      await selectConversation(data.id)
      await Logic.Conversations.GetConversations({
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

const setConversations = (goToIndex = -1, limit = 0) => {
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

    if (limit == 0 || index <= limit - 1) {
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
    }
  })
  tutorRequestList.length = 0
  if (
    Logic.Users.getUserType() == 'teacher' ||
    Logic.Users.getUserType() == 'student'
  ) {
    AllTutorRequests.value?.results.forEach((request) => {
      if (
        (Logic.Users.getUserType() == 'student' && request.accepted) ||
        (Logic.Users.getUserType() == 'teacher' && request.pending)
      ) {
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

const listenToTutorRequest = () => {
  Logic.Common.listenOnSocket(
    `conversations/tutorRequests`,
    (data) => {
      const tutorRequest: TutorRequest = data.data

      if (Logic.Conversations.AllTutorRequests) {
        let dataIsPresent = false

        Logic.Conversations.AllTutorRequests.results.forEach((item) => {
          if (item.id == tutorRequest.id) {
            dataIsPresent = true
            item = tutorRequest
          }
        })

        if (!dataIsPresent) {
          Logic.Conversations.AllTutorRequests.results.push(tutorRequest)
        }

        setConversations()
      }
    },
    (data) => {
      console.log(data)
    },
  )
}

const listenToConversation = (id: string) => {
  Logic.Common.listenOnSocket(
    `conversations/conversations/${id}`,
    (data) => {
      const conversation: Conversation = data.data

      if (Logic.Conversations.AllConversations) {
        Logic.Conversations.AllConversations.results.forEach((item) => {
          if (item.id == id) {
            item = conversation
          }
        })
        setConversations()
      }

      if (SingleConversation.value?.id == conversation.id) {
        SingleConversation.value = conversation
        selectConversation(conversation.id)
      }
    },
    (data) => {
      console.log(data)
    },
  )
}

const selectConversation = async (convoId: string) => {
  itIsTutorRequest.value = false
  showMoreOptions.value = false
  await Logic.Common.GoToRoute('/chats/' + convoId)
  showMoreOptions.value = false

  Logic.Common.showLoader({
    loading: true,
    show: false,
  })

  await Logic.Conversations.GetConversation(convoId).then((response: any) => {
    if (response) {
      Logic.Conversations.GetMessages(convoId).then(async (responseData: any) => {
        if (responseData) {
          await Logic.Common.setupWebsocket()

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
            if (item.id == SingleConversation.value?.id) {
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

          listenToConversation(SingleConversation.value.id)
        }
      })
    }
  })
}

const createCoversation = async (title: string) => {
  return Logic.Conversations.CreateConversation(title).then((response) => {
    return response
  })
}

const onInput = (e: any) => {
  messageContent.value = e.target.innerText
}

const handleKeyEvent = async (e: any) => {
  if (e.keyCode == 13 && e.shiftKey) {
    return
  }

  if (e.key === 'Enter' || e.keyCode === 13) {
    await sendNewMessage(undefined)
    e.preventDefault()
    return
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-types
const sendNewMessage = async (selectConversation: Function | undefined) => {
  if (itIsNewMessage.value) {
    await setConvoFromRoute(messageContent.value)
    messageContent.value = ''
  } else {
    if (messageContent.value) {
      await sendMessage(messageContent.value, selectConversation)
      messageContent.value = ''
    }
  }

  const messageContainerSm = document.getElementById('messageContainerSm')
  const messageContainer = document.getElementById('messageContainer')

  if (messageContainerSm) {
    messageContainerSm.innerText = ''
  }

  if (messageContainer) {
    messageContainer.innerText = ''
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
const sendMessage = async (content: string, selectConversation = undefined) => {
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

    await Logic.Conversations.CreateMessage(
      Logic.Conversations.SingleConversation.id,
      true,
    )
  } else {
    await createCoversation(content).then(async (response) => {
      if (Logic.Common.isLarge) {
        if (selectConversation) {
          await selectConversation(response.id)
        }
      }
      await Logic.Conversations.GetConversations({
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

const setConvoFromRoute = async (message = '') => {
  const route = Logic.Common.route
  if (message) {
    await addNewChat(message)
  } else {
    if (route.query?.id) {
      await Logic.Common.GoToRoute('/chats/' + route.query?.id.toString())
    } else if (route.query?.message) {
      await addNewChat(route.query?.message.toString())
    }
  }
}

const deleteConvo = async (id: string) => {
  if (Logic.Common.loaderSetup.loading) return
  await Logic.Conversations.DeleteConversation(id)
}

const contentTitleChanged = (content) => {
  Logic.Common.debounce(async () => {
    if (SingleConversation.value) {
      conversationTitle.value = content
      await Logic.Conversations.UpdateConversation(
        content,
        SingleConversation.value.id,
      )
    }
  }, 700)
}

const acceptOrRejectTutorRequest = async (accept: boolean) => {
  await Logic.Conversations.AcceptTutorRequest(
    selectedTutorRequestData.value.id,
    accept,
  ).then(async () => {
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
      ).then(async () => {
        setConversations()
        await selectConversation(selectedTutorRequestData.value.convoId)
      })
    } else {
      Logic.Common.hideLoader()
      Logic.Conversations.SingleConversation = undefined
      await Logic.Common.GoToRoute('/chats')
    }
  })
}

const endChatSession = async (reviewData: { ratings: number; review: string }) => {
  Logic.Conversations.DeleteTutorForm = {
    id: SingleConversation.value.id,
    message: reviewData.review,
    rating: reviewData.ratings,
  }

  await Logic.Conversations.DeleteTutor().then(async (data) => {
    if (data) {
      showRateAndReviewTutor.value = false
      setChatToDefault()
      await Logic.Common.GoToRoute('/chats')
    }
  })
}

export const newChat = async () => {
  if (Messages.value) Messages.value = undefined
  showMoreOptions.value = false
  showAddTutor.value = false
  showNeedsSubscription.value = false
  showEndSession.value = false
  showDeleteConvo.value = false
  showRateAndReviewTutor.value = false
	await Logic.Common.GoToRoute("/chats/new")

  selectedChatData.value.title = "New Chat"
  Logic.Conversations.SingleConversation = undefined
  Logic.Conversations.Messages = undefined
}

export const onClickAddTutor = () => {
  showMoreOptions.value = false;
  if (Logic.Payment.UserWallet?.subscription.data.tutorAidedConversations > 0) showAddTutor.value = true
  else showNeedsSubscription.value = true
}

export {
  AllConversations, AllTutorRequests, ChatMembers, Messages, SingleConversation, acceptOrRejectTutorRequest, addNewChat, chatList, contentTitleChanged,
  conversationTitle, createCoversation, deleteConvo, endChatSession, handleIncomingMessage, handleKeyEvent, hasMessage, itIsNewMessage, itIsTutorRequest, listenToConversation, listenToTutorRequest, messageContent, onInput, selectConversation,
  selectedChatData, selectedConvoId, selectedTutorRequestData, sendMessage, sendNewMessage, setChatToDefault, setConversations, setConvoFromRoute, showAddTutor, showDeleteConvo, showEndSession, showLoader, showMoreOptions, showRateAndReviewTutor, tutorRequestList
}
