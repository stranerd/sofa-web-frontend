<template>
  <ChatLayout title="Chat">
    <ChatContent class="h-full" />

    <add-tutor v-if="showAddTutor" :close="() => showAddTutor = false" @on-request-sent="handleRequestSent" />

    <!-- Success prompt for tutor request -->
    <sofa-success-prompt v-if="showTutorRequestSubmited" :title="'Tutor request sent'"
      :subTitle="`You will get notified when the tutor responds`" :close="() => showTutorRequestSubmited = false"
      :button="{ label: 'Done', action: () => showTutorRequestSubmited = false }" />

    <!-- End session modal -->
    <sofa-delete-prompt v-if="showEndSession" :title="'End session with tutor?'"
      :subTitle="`Are you sure you want to end this session? The tutor will be removed from this chat`"
      :close="() => showEndSession = false" :buttons="[
        {
          label: 'No',
          isClose: true,
          action: () => {
            showEndSession = false
          },
        },
        {
          label: 'End session',
          isClose: false,
          action: () => {
            showEndSession = false
            showRateAndReviewTutor = true
          },
        },
      ]" />

    <!-- Rate and review modal -->
    <rate-and-review-modal v-if="showRateAndReviewTutor" :close="() => showRateAndReviewTutor = false"
      :title="'Session ended, rate tutor'" :tutor="{
        name: SingleConversation?.tutor.bio.name.full,
        photo: SingleConversation?.tutor?.bio?.photo?.link || '',
      }" @on-review-submitted="(data) => endChatSession(data)" />

    <!-- More options for smaller screens -->
    <sofa-modal :close="() => showMoreOptions = false" v-if="showMoreOptions" :customClass="`mdlg:!hidden`">
      <div :class="`w-full top-0 px-0 pt-0 h-full flex flex-col`" @click.stop="() => showMoreOptions = false">
        <div @click.stop="() => { }"
          class="w-[80%] md:!w-[60%] flex flex-col bg-white left-[20%] md:!left-[40%] gap-4 relative overflow-y-auto h-full">
          <div
            class="w-full flex flex-row items-center justify-start top-0 left-0 sticky pt-4 bg-white z-30 gap-3 py-3 px-4 cursor-pointer"
            @click="newChat()" v-if="Logic.Users.getUserType() == 'student'">
            <sofa-icon :name="'box-add-pink'" :custom-class="'h-[17px]'" />
            <sofa-normal-text :color="'text-primaryPink'">
              New chat
            </sofa-normal-text>
          </div>

          <div class="w-full flex flex-col gap-2">
            <!-- Chat list -->
            <ChatList :customClass="'!rounded-none'" :extraStyle="'px-3'" @itemSelected="() => showMoreOptions = false" />
          </div>

          <div class="sticky w-full bottom-0 left-0 bg-white z-50 px-4 py-4 border-t border-[#F1F6FA] flex flex-col gap-4"
            v-if="!itIsNewMessage && Logic.Users.getUserType() == 'student'">
            <a class="w-full flex flex-row items-center justify-start gap-2" v-if="SingleConversation.tutor"
              @click="showEndSession = true; selectedConvoId = SingleConversation.id">
              <sofa-icon :customClass="'h-[16px]'" :name="'tutor-red'" />
              <sofa-normal-text :color="'text-primaryRed'">End tutor session</sofa-normal-text>
            </a>
            <template v-if="Logic.Payment.UserWallet?.subscription.data.tutorAidedConversations > 0">
              <a class="w-full flex flex-row items-center justify-start gap-2"
                @click="showMoreOptions = false; showAddTutor = true" v-if="!selectedTutorRequestData">
                <sofa-icon :customClass="'h-[16px]'" :name="'tutor-green'" />
                <sofa-normal-text :color="'text-primaryGreen'">
                  Add a tutor
                </sofa-normal-text>
              </a>
            </template>

            <a class="w-full flex flex-row items-center justify-start gap-2"
              @click="showDeleteConvo = true; selectedConvoId = SingleConversation?.id">
              <sofa-icon :customClass="'h-[16px]'" :name="'trash'" />
              <sofa-normal-text :color="'text-primaryRed'">
                Delete chat
              </sofa-normal-text>
            </a>
          </div>
        </div>
      </div>
    </sofa-modal>
  </ChatLayout>
</template>

<script lang="ts">
import RateAndReviewModal from "@/components/common/RateAndReviewModal.vue"
import AddTutor from "@/components/conversation/AddTutor.vue"
import ChatContent from "@/components/conversation/ChatContent.vue"
import ChatLayout from "@/components/conversation/ChatLayout.vue"
import ChatList from "@/components/conversation/ChatList.vue"
import { scrollToBottom, scrollToTop } from "@/composables"
import {
  AllConversations,
  AllTutorRequests,
  ChatMembers,
  acceptOrRejectTutorRequest,
  addNewChat,
  chatList,
  contentTitleChanged,
  conversationTitle,
  endChatSession,
  handleIncomingMessage,
  handleKeyEvent,
  hasMessage,
  itIsNewMessage,
  itIsTutorRequest,
  listenToConversation,
  listenToTutorRequest,
  messageContent,
  newChat,
  onInput,
  selectConversation,
  selectedChatData,
  selectedConvoId,
  selectedTutorRequestData,
  sendNewMessage,
  setConversations,
  showAddTutor,
  showDeleteConvo,
  showEndSession,
  showLoader,
  showMoreOptions,
  showRateAndReviewTutor,
  tutorRequestList,
} from "@/composables/conversation"
import { Logic } from "sofa-logic"
import { Conditions } from "sofa-logic/src/logic/types/domains/common"
import {
  SofaDeletePrompt,
  SofaIcon,
  SofaModal,
  SofaNormalText,
  SofaSuccessPrompt,
} from "sofa-ui-components"
import { defineComponent, onMounted, ref, watch } from "vue"
import { useMeta } from "vue-meta"

export default defineComponent({
  components: {
    ChatLayout,
    ChatList,
    SofaIcon,
    SofaNormalText,
    ChatContent,
    AddTutor,
    SofaModal,
    SofaSuccessPrompt,
    SofaDeletePrompt,
    RateAndReviewModal,
  },
  middlewares: {
    fetchRules: [
      {
        domain: "Users",
        property: "UserProfile",
        method: "GetUserProfile",
        params: [],
        requireAuth: true,
      },
      {
        domain: "Conversations",
        property: "SingleConversation",
        method: "GetConversation",
        params: [],
        useRouteId: true,
        ignoreProperty: true,
        requireAuth: true,
      },
      {
        domain: "Conversations",
        property: "Messages",
        method: "GetMessages",
        params: [],
        useRouteId: true,
        requireAuth: true,
        ignoreProperty: true,
      },
      {
        domain: "Study",
        property: "Tags",
        method: "GetTags",
        params: [
          {
            all: true,
          },
        ],
        requireAuth: true,
        ignoreProperty: false,
      },
      {
        domain: "Payment",
        property: "UserWallet",
        method: "GetUserWallet",
        params: [],
        requireAuth: true,
        ignoreProperty: false,
      },
      {
        domain: "Users",
        property: "AllTutorRequests",
        method: "GetTutorRequests",
        params: [
          {
            where: [
              {
                field: "userId",
                condition: Conditions.eq,
                value: Logic.Auth.AuthUser?.id,
              },
            ],
          },
          true,
        ],
        shouldSkip: () => Logic.Users.getUserType() !== "teacher",
        requireAuth: true,
        ignoreProperty: true,
      },
      {
        domain: "Conversations",
        property: "AllTutorRequests",
        method: "GetTutorRequests",
        params: [
          {
            where: [
              {
                field: "tutor.id",
                condition: Conditions.eq,
                value: Logic.Auth.AuthUser?.id,
              },
            ],
          },
          true,
        ],
        shouldSkip: () => Logic.Users.getUserType() !== "teacher",
        requireAuth: true,
        ignoreProperty: true,
      },
      {
        domain: "Conversations",
        property: "AllConversations",
        method: "GetConversations",
        params: [],
        shouldSkip: () => Logic.Users.getUserType() === "teacher",
        requireAuth: true,
        ignoreProperty: true,
      }
    ],
    goBackRoute: "/chat",
  },
  name: "ChatsIdPage",
  setup () {
    useMeta({
      title: "Chat",
    })

    const editTitle = ref(false)

    const SingleConversation = ref(Logic.Conversations.SingleConversation)
    const Messages = ref(Logic.Conversations.Messages)

    const showTutorRequestSubmited = ref(false)

    const setNewMessage = () => {
      if (itIsNewMessage.value) {
        selectedChatData.value.title = "New Chat"
        Logic.Conversations.Messages = undefined
        Logic.Conversations.SingleConversation = undefined
      }
    }

    const connectWebsocket = () => {
      if (SingleConversation.value) {
        Logic.Common.setupWebsocket()

        Logic.Common.listenOnSocket(
          `conversations/conversations/${Logic.Conversations.SingleConversation.id}/messages`,
          (data) => {
            handleIncomingMessage(data)
          },
          (data) => {
            console.log(data)
          }
        )

        setTimeout(() => {
          scrollToBottom("MessagesScrollContainer")
        }, 500)
      }
    }

    const setTutorRequest = () => {
      if (Logic.Users.getUserType() == "teacher" && !SingleConversation.value) {
        const requestId = Logic.Common.route.query?.requestId?.toString()
        if (requestId) {
          itIsTutorRequest.value = true
          tutorRequestList.forEach((item) => {
            if (item.id == requestId) {
              item.selected = true
              selectedChatData.value = item
              selectedTutorRequestData.value = item
            }
          })
        }
      }
    }

    onMounted(() => {
      scrollToTop()

      Logic.Conversations.watchProperty("AllConversations", AllConversations)
      Logic.Conversations.watchProperty("AllTutorRequests", AllTutorRequests)
      Logic.Conversations.watchProperty("ChatMembers", ChatMembers)
      Logic.Conversations.watchProperty("SingleConversation", SingleConversation)
      Logic.Conversations.watchProperty("Messages", Messages)

      conversationTitle.value = SingleConversation.value?.title || ""

      setConversations()

      chatList.forEach((chat) => {
        if (chat.id == SingleConversation.value?.id) {
          chat.selected = true
          selectedChatData.value = chat
        }
      })

      if (SingleConversation.value) {
        listenToConversation(SingleConversation.value.id)
      }

      setTutorRequest()
      setNewMessage()
      listenToTutorRequest()
      connectWebsocket()
    })

    watch(Messages, () => {
      //
      setTimeout(() => {
        scrollToBottom("MessagesScrollContainer")
      }, 500)
    })

    watch(itIsNewMessage, () => {
      if (itIsNewMessage.value) {
        setNewMessage()
      }
    })

    const handleRequestSent = () => {
      showAddTutor.value = false
      showTutorRequestSubmited.value = true
      showMoreOptions.value = false
    }

    watch(SingleConversation, () => {
      if (SingleConversation.value) {
        chatList.forEach((chat) => {
          if (chat.id == SingleConversation.value?.id) {
            chat.selected = true
          } else {
            chat.selected = false
          }
        })
        connectWebsocket()

        if (editTitle.value == false) {
          if (SingleConversation.value) {
            conversationTitle.value = SingleConversation.value.title
            selectedChatData.value.title = SingleConversation.value.title
          } else {
            conversationTitle.value = "New Chat"
            selectedChatData.value.title = "New Chat"
          }
          editTitle.value = false
        }
      }
    })

    return {
      Logic,
      SingleConversation,
      Messages,
      onInput,
      messageContent,
      sendNewMessage,
      showLoader,
      showAddTutor,
      showMoreOptions,
      chatList,
      showDeleteConvo,
      selectConversation,
      selectedConvoId,
      addNewChat,
      hasMessage,
      handleKeyEvent,
      conversationTitle,
      contentTitleChanged,
      editTitle,
      selectedChatData,
      itIsTutorRequest,
      acceptOrRejectTutorRequest,
      selectedTutorRequestData,
      showTutorRequestSubmited,
      showEndSession,
      itIsNewMessage,
      handleRequestSent,
      newChat,
      showRateAndReviewTutor,
      endChatSession,
    }
  },
})
</script>
