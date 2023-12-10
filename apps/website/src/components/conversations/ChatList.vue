<template>
  <div class="w-full flex flex-col gap-2 mdlg:pt-1 pt-0 border-b border-[#F1F6FA] mdlg:pb-2 pb-4"
    v-if="userType.isTeacher && requests.length">
    <a :class="`w-full flex items-center justify-between ${extraStyle}`" @click="showRequests = !showRequests">
      <sofa-header-text :customClass="'text-left mdlg:!text-base text-sm'" :content="`Requests (${requests.length})`" />
      <sofa-icon :name="showRequests ? 'chevron-up' : 'chevron-down'" :customClass="'h-[7px] cursor-pointer'" />
    </a>
    <div class="w-full flex flex-col gap-3" v-if="showRequests">
      <Chat :customClass="customClass" v-for="request in requests" :key="request.hash" :chat="{
        route: `/chats/requests/${request.id}`,
        title: request.user.bio.name.full,
        lastMessage: request.title,
        lastMessageTime: formatTime(request.createdAt),
        photoUrl: request.user.bio.photo?.link ?? null,
      }" />
    </div>
  </div>
  <Chat :customClass="customClass" v-for="chat in conversations.slice(0, limit)" :key="chat.hash" :chat="{
    route: `/chats/${chat.id}`,
    title: chat.title,
    lastMessage: chat.last?.body ?? 'No message',
    lastMessageTime: formatTime(chat.last?.createdAt ?? Date.now()),
    photoUrl: id === chat.user.id ?
      (chat.tutor ? chat.tutor.bio.photo?.link ?? null : userAi.image) :
      chat.user.bio.photo?.link ?? null
  }" />
</template>

<script lang="ts" setup>
import { formatTime } from '@/common/dates'
import { useAuth } from '@/composables/auth/auth'
import { useConversationsList } from '@/composables/conversations/conversations'
import { SofaHeaderText, SofaIcon } from "sofa-ui-components"
import { defineProps, ref } from "vue"
import Chat from "./Chat.vue"

defineProps({
  customClass: {
    type: String,
    default: "",
  },
  extraStyle: {
    type: String,
    default: "",
  },
  limit: {
    type: Number,
    required: false
  }
})

const { userType, id, userAi } = useAuth()

const showRequests = ref(true)

const { conversations, requests } = useConversationsList()
</script>
