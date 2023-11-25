<template>
  <ChatLayout v-if="conversation" title="Chat">
    <ChatContent class="h-full" :data="{
      title: conversation.title,
      photoUrl: otherUsers.at(0).photo ?? null,
      userNames: ['You', ...otherUsers.map((u) => u.name)]
    }">
      <template v-slot:top-extras>
        <div class="flex flex-row items-center gap-3">
          <sofa-icon :customClass="'h-[17px] cursor-pointer mdlg:hidden'" :name="'tutor-black'"
            @click="showAddTutor = true"
            v-if="Logic.Users.isStudent && Logic.Payment.UserWallet.subscription.data.tutorAidedConversations > 1" />

          <sofa-icon :customClass="'h-[23px] mdlg:hidden cursor-pointer'" :name="'menu'" @click="showMoreOptions = true" />
        </div>
      </template>
      <ConversationMessages :conversation="conversation" id="MessagesScrollContainer" />
      <template v-slot:bottom>
        <form @submit.prevent="createMessage"
          class="w-full flex gap-2 items-center bg-fadedPurple rounded-tl-2xl rounded-br-2xl rounded-tr-lg rounded-bl-lg mdlg:!rounded-lg px-1">
          <input v-model="factory.body"
            :class="`w-full text-bodyBlack focus:outline-none !max-h-[80px] overflow-hidden bg-transparent rounded-lg p-3 items-start text-left overflow-y-auto`"
            placeholder="Enter message" />
          <button type="submit" class="min-w-[45px] h-[40px] flex items-center justify-center pr-[5px]">
            <sofa-icon :name="'send'" :customClass="'h-[19px]'" />
          </button>
        </form>
      </template>
    </ChatContent>

    <template v-slot:right-extras>
      <div v-if="conversation.user.id === Logic.Auth.AuthUser?.id && !conversation.tutor"
        class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col gap-4">
        <div class="w-full flex flex-row items-center gap-3">
          <div :style="`background-image: url('${Logic.Users.UserProfile.ai?.photo?.link ?? '/images/icons/robot.svg'}')`"
            class="w-[64px] h-[64px] flex flex-row items-center justify-center bg-cover bg-center rounded-full">
          </div>

          <div class="flex flex-col gap-1">
            <sofa-header-text :customClass="'!text-base !font-bold'"
              :content="Logic.Users.UserProfile.ai?.name || 'Dr. Sofa'" />
          </div>
        </div>
        <div class="w-full flex flex-row justify-start px-4 py-4 rounded-[8px] bg-fadedPurple">
          <sofa-normal-text :customClass="'text-left'" :color="'text-deepGray'">
            Hello! I am here to respond to your messages in every chat 24/7.
            <br /><br />
            Let us work towards your highest ever academic achievements.
          </sofa-normal-text>
        </div>
      </div>

      <div v-if="conversation.user.id === Logic.Auth.AuthUser?.id && !conversation.tutor"
        class="w-full shadow-custom p-4 bg-primaryPurple rounded-[16px] flex flex-col gap-3 items-start">
        <div class="w-full flex flex-row gap-2 items-center justify-start">
          <sofa-icon :customClass="'h-[24px]'" :name="'add-tutor-white'" />
          <sofa-normal-text :color="'text-white'" :customClass="'!text-base !font-bold'">
            Tutor help
          </sofa-normal-text>
        </div>
        <sofa-normal-text :customClass="'text-left'" :color="'text-[#E1E6EB]'">
          Need extra help with your work?
        </sofa-normal-text>
        <sofa-button :bg-color="'bg-white'" :text-color="'!text-primaryPurple'" :padding="'px-5 py-1'"
          @click="onClickAddTutor">
          Add a tutor
        </sofa-button>
      </div>

      <div v-if="conversation.user.id === Logic.Auth.AuthUser?.id"
        class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col gap-4">
        <a class="w-full flex items-center justify-start gap-2" v-if="conversation.tutor"
          @click.stop.prevent="showEndSession = true">
          <sofa-icon :customClass="'h-[16px]'" :name="'tutor-red'" />
          <sofa-normal-text :color="'text-primaryRed'">End tutor session</sofa-normal-text>
        </a>

        <a class="w-full flex items-center justify-start gap-2" @click.stop.prevent="showDeleteConvo = true">
          <sofa-icon :customClass="'h-[16px]'" :name="'trash'" />
          <sofa-normal-text :color="'text-primaryRed'">Delete chat</sofa-normal-text>
        </a>
      </div>

      <!-- Teacher POV -->
      <template v-if="conversation.tutor?.id === Logic.Auth.AuthUser?.id">
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

    <!-- More options for smaller screens -->
    <sofa-modal :close="() => showMoreOptions = false" v-if="showMoreOptions" :customClass="`mdlg:!hidden`">
      <div :class="`w-full top-0 px-0 pt-0 h-full flex flex-col`" @click.stop="() => showMoreOptions = false">
        <div class="w-[80%] md:!w-[60%] flex flex-col bg-white left-[20%] md:!left-[40%] gap-4 relative overflow-y-auto h-full">
          <router-link to="/chats/new" v-if="conversation.user.id === Logic.Auth.AuthUser?.id"
            class="w-full flex items-center justify-start top-0 left-0 sticky pt-4 bg-white z-30 gap-3 py-3 px-4 cursor-pointer">
            <sofa-icon :name="'box-add-pink'" :custom-class="'h-[17px]'" />
            <sofa-normal-text :color="'text-primaryPink'">
              New chat
            </sofa-normal-text>
          </router-link>

          <div class="w-full flex flex-col gap-2">
            <ChatList :customClass="'!rounded-none'" :extraStyle="'px-3'" />
          </div>

          <div class="sticky w-full bottom-0 left-0 bg-white z-50 p-4 border-t border-[#F1F6FA] flex flex-col gap-4" v-if="conversation.user.id === Logic.Auth.AuthUser?.id">
            <a class="w-full flex items-center justify-start gap-2" v-if="conversation.tutor" @click="showEndSession = true">
              <sofa-icon :customClass="'h-[16px]'" :name="'tutor-red'" />
              <sofa-normal-text :color="'text-primaryRed'">End tutor session</sofa-normal-text>
            </a>
            <a class="w-full flex items-center justify-start gap-2" @click="onClickAddTutor" v-else>
              <sofa-icon :customClass="'h-[16px]'" :name="'tutor-green'" />
              <sofa-normal-text :color="'text-primaryGreen'">
                Add a tutor
              </sofa-normal-text>
            </a>

            <a class="w-full flex items-center justify-start gap-2" @click="showDeleteConvo = true">
              <sofa-icon :customClass="'h-[16px]'" :name="'trash'" />
              <sofa-normal-text :color="'text-primaryRed'">
                Delete chat
              </sofa-normal-text>
            </a>
          </div>
        </div>
      </div>
    </sofa-modal>

    <add-tutor v-if="showAddTutor" :conversationId="conversation.id" :close="() => showAddTutor = false" @onSelected="handleRequestSent" />

    <!-- Success prompt for tutor request -->
    <sofa-success-prompt v-if="showTutorRequestSubmited" :title="'Tutor request sent'"
      :subTitle="`You will get notified when the tutor responds`" :close="() => showTutorRequestSubmited = false"
      :button="{ label: 'Done', action: () => showTutorRequestSubmited = false }" />

    <!-- Delete convo -->
    <sofa-delete-prompt v-if="showDeleteConvo" title="Are you sure?"
      subTitle="This action is permanent. All messages in this conversation would be lost"
      :close="() => showDeleteConvo = false" :buttons="[
        {
          label: 'No',
          isClose: true,
          action: () => showDeleteConvo = false
        },
        {
          label: 'Yes, delete',
          isClose: false,
          action: deleteConversation
        },
      ]" />

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

    <!-- End session confirmation modal -->
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

    <!-- Rate and review modal -->
    <rate-and-review-modal v-if="showRateAndReviewTutor" :close="() => showRateAndReviewTutor = false"
      :title="'Session ended, rate tutor'" :tutor="{
        name: conversation.tutor?.bio.name.full,
        photo: conversation.tutor?.bio.photo?.link,
      }" @on-review-submitted="(data) => endSession(data)" />
  </ChatLayout>
</template>

<script lang="ts">
import RateAndReviewModal from "@/components/common/RateAndReviewModal.vue"
import AddTutor from "@/components/conversation/AddTutor.vue"
import ChatContent from "@/components/conversation/ChatContent.vue"
import ChatLayout from "@/components/conversation/ChatLayout.vue"
import ChatList from "@/components/conversation/ChatList.vue"
import ConversationMessages from "@/components/conversation/Messages.vue"
import { useConversation } from '@/composables/conversations/conversations'
import { useCreateMessage } from '@/composables/conversations/messages'
import { Logic } from "sofa-logic"
import {
  SofaAvatar,
  SofaButton,
  SofaDeletePrompt,
  SofaHeaderText,
  SofaIcon,
  SofaModal,
  SofaNormalText,
  SofaSuccessPrompt
} from "sofa-ui-components"
import { computed, defineComponent, ref } from "vue"
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
    SofaButton,
    SofaAvatar,
    SofaHeaderText,
    RateAndReviewModal,
    ConversationMessages,
  },
  middlewares: {
    fetchRules: [
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

    const { conversation, endSession, deleteConversation, addTutor } = useConversation(id as string)
    const { factory, createMessage } = useCreateMessage(id as string)

    const otherUsers = computed(() => {
      if (!conversation.value) return []
      const res: { name: string, photo: string | null }[] = []
      if (conversation.value.user.id !== Logic.Auth.AuthUser?.id) return [{ name: conversation.value.user.bio.name.first, photo: conversation.value.user.bio.photo?.link }]
      if (conversation.value.tutor) res.push({ name: conversation.value.tutor.bio.name.first, photo: conversation.value.tutor.bio.photo?.link })
      res.push({ name: Logic.Users.UserProfile?.ai?.name ?? 'Dr. Sofa', photo: Logic.Users.UserProfile?.ai?.photo?.link ?? '/images/icons/robot.svg' })
      return res
    })

    const showTutorRequestSubmited = ref(false)
    const showDeleteConvo = ref(false)
    const showAddTutor = ref(false)
    const showEndSession = ref(false)
    const showMoreOptions = ref(false)
    const showNeedsSubscription = ref(false)
    const showRateAndReviewTutor = ref(false)

    const handleRequestSent = async (data: { message: string, tutorId: string }) => {
      const res = await addTutor(data)
      if (!res) return
      showAddTutor.value = false
      showTutorRequestSubmited.value = true
      showMoreOptions.value = false
    }

    const onClickAddTutor = () => {
      showMoreOptions.value = false
      if (Logic.Payment.UserWallet?.subscription.data.tutorAidedConversations > 0) showAddTutor.value = true
      else showNeedsSubscription.value = true
    }

    return {
      Logic,
      factory,
      createMessage,
      conversation,
      otherUsers,
      showAddTutor,
      showMoreOptions,
      showDeleteConvo,
      onClickAddTutor,
      showTutorRequestSubmited,
      showNeedsSubscription,
      showEndSession,
      handleRequestSent,
      showRateAndReviewTutor,
      endSession,
      deleteConversation,
    }
  },
})
</script>
