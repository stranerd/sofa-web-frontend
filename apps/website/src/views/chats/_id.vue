<template>
  <ChatLayout v-if="conversation" title="Chat">
    <ChatContent class="h-full">
      <template v-slot:top-extras>
        <div class="flex flex-row items-center gap-3">
          <sofa-icon :customClass="'h-[17px] cursor-pointer mdlg:hidden'" :name="'tutor-black'"
            @click="showAddTutor = true"
            v-if="Logic.Users.isStudent && Logic.Payment.UserWallet.subscription.data.tutorAidedConversations > 1" />

          <sofa-icon :customClass="'h-[23px] mdlg:hidden cursor-pointer'" :name="'menu'"
            @click="showMoreOptions = true" />
        </div>
      </template>
      <ConversationMessages :conversation="conversation" id="MessagesScrollContainer" />
      <template v-slot:bottom>
        <form @submit.prevent="console.log"
          class="w-full flex gap-2 items-center bg-fadedPurple rounded-tl-2xl rounded-br-2xl rounded-tr-lg rounded-bl-lg mdlg:!rounded-lg px-1">
          <textarea
            :class="`w-full resize-none !min-h-[48px] text-bodyBlack focus:outline-none !max-h-[80px] overflow-hidden bg-transparent rounded-lg p-3 items-start text-left overflow-y-auto`"
            placeholder="Enter message" />
          <a class="min-w-[45px] h-[40px] flex items-center justify-center pr-[5px]">
            <sofa-icon :name="'send'" :customClass="'h-[19px]'" />
          </a>
        </form>
      </template>
    </ChatContent>

    <template v-slot:right-extras>
      <template
        v-if="!conversation.tutor">
        <div class="w-full shadow-custom p-4 bg-primaryPurple rounded-[16px] flex flex-col gap-3 items-start">
          <div class="w-full flex flex-row gap-2 items-center justify-start">
            <sofa-icon :customClass="'h-[24px]'" :name="'add-tutor-white'" />
            <sofa-normal-text :color="'text-white'" :customClass="'!text-base !font-bold'">
              Tutor help
            </sofa-normal-text>
          </div>
          <sofa-normal-text :customClass="'text-left'" :color="'text-[#E1E6EB]'">
            Need extra help with your work?
          </sofa-normal-text>
          <sofa-button :bg-color="'bg-white'" :text-color="'!text-primaryPurple'" :padding="'px-5 py-1'" @click="onClickAddTutor">
            Add a tutor
          </sofa-button>
        </div>
      </template>

      <div class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col gap-4">
        <a class="w-full flex items-center justify-start gap-2" v-if="conversation.tutor" @click.stop.prevent="showEndSession = true">
          <sofa-icon :customClass="'h-[16px]'" :name="'tutor-red'" />
          <sofa-normal-text :color="'text-primaryRed'">End tutor session</sofa-normal-text>
        </a>

        <a class="w-full flex items-center justify-start gap-2"  @click.stop.prevent="showDeleteConvo = true">
          <sofa-icon :customClass="'h-[16px]'" :name="'trash'" />
          <sofa-normal-text :color="'text-primaryRed'">Delete chat</sofa-normal-text>
        </a>
      </div>

      <!-- Teacher POV -->
      <template v-if="Logic.Users.isTeacher">
        <div class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col gap-4 justify-center items-center">
          <div class="w-full flex flex-col items-center justify-center gap-3">
            <sofa-avatar :size="'180'" :bgColor="'bg-grayColor'"
              :photoUrl="Logic.Users.UserProfile?.bio.photo?.link ?? ''" :customClass="'!cursor-pointer'"
              @click="Logic.Common.GoToRoute('/settings')">
              <sofa-icon :customClass="'h-[23px]'" :name="'user'" />
            </sofa-avatar>
          </div>

          <sofa-header-text :size="'xl'" :content="Logic.Users.UserProfile?.bio.name.full" />

          <sofa-normal-text :customClass="'text-center'" :color="'text-[#78828C]'">
            {{ Logic.Users.UserProfile?.bio.description }}
          </sofa-normal-text>
        </div>
      </template>
    </template>

    <add-tutor v-if="showAddTutor" :close="() => showAddTutor = false" @on-request-sent="handleRequestSent" />

    <template v-if="showNeedsSubscription">
      <sofa-delete-prompt v-if="Logic.Payment.UserWallet?.subscription.active"
        title="You have run out of tutor aided conversations"
        subTitle="This feature will become available on your next subscription renewal"
        :close="() => showNeedsSubscription = false" :buttons="[
          {
            label: 'Close',
            hide: true,
            action: () => {
              showNeedsSubscription = false
            },
          },
          {
            label: 'Close',
            bgColor: 'bg-primaryBlue',
            isClose: false,
            action: () => {
              showNeedsSubscription = false
            },
          },
        ]" />
      <sofa-delete-prompt v-else title="You have no subscription"
        subTitle="You need to be subscribed to Stranerd Plus to access this feature"
        :close="() => showNeedsSubscription = false" :buttons="[
          {
            label: 'Cancel',
            isClose: true,
            action: () => {
              showNeedsSubscription = false
            },
          },
          {
            label: 'Subscribe',
            bgColor: 'bg-primaryBlue',
            isClose: false,
            action: () => {
              showNeedsSubscription = false
              Logic.Common.GoToRoute('/settings/subscription')
            },
          },
        ]" />
    </template>

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
        name: conversation.tutor?.bio.name.full,
        photo: conversation.tutor?.bio.photo?.link,
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
            <ChatList :customClass="'!rounded-none'" :extraStyle="'px-3'" />
          </div>

          <div class="sticky w-full bottom-0 left-0 bg-white z-50 px-4 py-4 border-t border-[#F1F6FA] flex flex-col gap-4"
            v-if="!itIsNewMessage && Logic.Users.getUserType() == 'student'">
            <a class="w-full flex flex-row items-center justify-start gap-2" v-if="conversation.tutor"
              @click="showEndSession = true; selectedConvoId = conversation.id">
              <sofa-icon :customClass="'h-[16px]'" :name="'tutor-red'" />
              <sofa-normal-text :color="'text-primaryRed'">End tutor session</sofa-normal-text>
            </a>
            <a class="w-full flex flex-row items-center justify-start gap-2" @click="onClickAddTutor"
              v-if="!conversation.tutor && !selectedTutorRequestData">
              <sofa-icon :customClass="'h-[16px]'" :name="'tutor-green'" />
              <sofa-normal-text :color="'text-primaryGreen'">
                Add a tutor
              </sofa-normal-text>
            </a>

            <a class="w-full flex flex-row items-center justify-start gap-2"
              @click="showDeleteConvo = true; selectedConvoId = conversation?.id">
              <sofa-icon :customClass="'h-[16px]'" :name="'trash'" />
              <sofa-normal-text :color="'text-primaryRed'">
                Delete chat
              </sofa-normal-text>
            </a>
          </div>
        </div>
      </div>
    </sofa-modal>

    <sofa-delete-prompt v-if="showDeleteConvo" title="Are you sure?"
      subTitle="This action is permanent. All messages in this conversation would be lost"
      :close="() => showDeleteConvo = false" :buttons="[
        {
          label: 'No',
          isClose: true,
          action: () => {
            showDeleteConvo = false
          },
        },
        {
          label: 'Yes, delete',
          isClose: false,
          action: () => {
            deleteConvo(selectedConvoId)
          },
        },
      ]" />

    <!-- End session modal -->
    <sofa-delete-prompt v-if="showEndSession" title="End session with tutor?"
      subTitle="Are you sure you want to end this session? The tutor will be removed from this chat"
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
  </ChatLayout>
</template>

<script lang="ts">
import RateAndReviewModal from "@/components/common/RateAndReviewModal.vue"
import AddTutor from "@/components/conversation/AddTutor.vue"
import ChatContent from "@/components/conversation/ChatContent.vue"
import ChatLayout from "@/components/conversation/ChatLayout.vue"
import ChatList from "@/components/conversation/ChatList.vue"
import ConversationMessages from "@/components/conversation/Messages.vue"
import {
  acceptOrRejectTutorRequest,
  addNewChat,
  chatList,
  contentTitleChanged,
  conversationTitle,
  endChatSession,
  handleKeyEvent,
  hasMessage,
  itIsNewMessage,
  itIsTutorRequest,
  messageContent,
  newChat,
  onClickAddTutor,
  onInput,
  selectConversation,
  selectedChatData,
  selectedConvoId,
  selectedTutorRequestData,
  sendNewMessage,
  showAddTutor,
  showDeleteConvo,
  showEndSession,
  showLoader,
  showMoreOptions,
  showNeedsSubscription,
  showRateAndReviewTutor
} from "@/composables/conversation"
import { useConversation } from '@/composables/conversations/conversations'
import { Logic } from "sofa-logic"
import {
  SofaDeletePrompt,
  SofaIcon,
  SofaModal,
  SofaNormalText,
  SofaSuccessPrompt,
} from "sofa-ui-components"
import { defineComponent, ref } from "vue"
import { useMeta } from "vue-meta"
import { useRoute } from 'vue-router'

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
    ConversationMessages,
  },
  middlewares: {
    fetchRules: [
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
    ],
    goBackRoute: "/chats",
  },
  name: "ChatsIdPage",
  setup () {
    useMeta({
      title: "Chat",
    })

    const route = useRoute()
    const { id } = route.params

    const { conversation } = useConversation(id as string)


    const showTutorRequestSubmited = ref(false)

    const handleRequestSent = () => {
      showAddTutor.value = false
      showTutorRequestSubmited.value = true
      showMoreOptions.value = false
    }

    return {
      Logic,
      conversation,
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
      selectedChatData,
      onClickAddTutor,
      itIsTutorRequest,
      acceptOrRejectTutorRequest,
      selectedTutorRequestData,
      showTutorRequestSubmited,
      showNeedsSubscription,
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
