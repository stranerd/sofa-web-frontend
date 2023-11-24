<template>
  <div class="w-full flex flex-col gap-2 mdlg:pt-1 pt-0 border-b border-[#F1F6FA] mdlg:pb-2 pb-4"
    v-if="Logic.Users.getUserType() == 'teacher' && tutorRequestList.length">
    <a :class="`w-full flex items-center justify-between ${extraStyle}`" @click="showRequests = !showRequests">
      <sofa-header-text :customClass="'text-left mdlg:!text-base text-sm'"
        :content="`Requests (${tutorRequestList.length})`" />

      <sofa-icon :name="showRequests ? 'chevron-up' : 'chevron-down'" :customClass="'h-[7px] cursor-pointer'" />
    </a>
    <div class="w-full flex flex-col gap-3" v-if="showRequests">
      <Chat :customClass="customClass" v-for="(chat, index) in tutorRequestList" :key="index"
        @click="selectTutorRequest(chat)" :chat="chat" />
    </div>
  </div>
  <Chat :customClass="customClass" v-for="(chat, index) in chatList" :key="index" @click="selectConversation(chat.id)"
    :chat="chat" />
</template>
<script lang="ts">
import {
  chatList,
  ChatListData,
  itIsNewMessage,
  itIsTutorRequest,
  selectConversation,
  selectedChatData,
  selectedTutorRequestData,
  tutorRequestList,
} from "@/composables/conversation"
import { Logic } from "sofa-logic"
import { SofaHeaderText, SofaIcon } from "sofa-ui-components"
import { defineComponent, ref } from "vue"
import Chat from "./Chat.vue"

export default defineComponent({
  components: {
    SofaHeaderText,
    SofaIcon,
    Chat,
  },
  props: {
    customClass: {
      type: String,
      default: "",
    },
    extraStyle: {
      type: String,
      default: "",
    },
  },
  emits: ["itemSelected"],
  setup (props, context) {
    const showRequests = ref(true)

    const selectTutorRequest = (request: ChatListData) => {
      context.emit("itemSelected", true)
      itIsTutorRequest.value = true
      request.selected = true
      selectedTutorRequestData.value = request
      selectedChatData.value = request
      Logic.Common.GoToRoute(`/chats/empty?requestId=${request.id}`)
    }
    return {
      itIsNewMessage,
      chatList,
      tutorRequestList,
      Logic,
      showRequests,
      selectTutorRequest,
      selectConversation,
    }
  },
})
</script>
