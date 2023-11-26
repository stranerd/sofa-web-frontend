<template>
  <div v-chat-scroll class="w-full flex flex-col overflow-y-auto scrollbar-hide gap-4">
    <template v-for="message in messages" :key="message.hash">
      <div
        class="w-auto min-w-[80px] flex max-w-full md:!max-w-[80%] mdlg:!max-w-[80%] lg:!max-w-[70%] flex-row gap-2 items-end justify-start"
        v-if="message.userId !== id">
        <div class="w-[30px]">
          <sofa-avatar :bgColor="'!bg-[#78828C]'" :photoUrl="users[message.userId]?.photoUrl" :size="'27'">
            <sofa-icon :customClass="'h-[16px]'" :name="'user'" />
          </sofa-avatar>
        </div>
        <div class="p-3 custom-border text-left bg-[#E2F3FD] flex flex-col gap-1 justify-start">
          <sofa-normal-text :customClass="'!font-semibold'" :color="'text-[#3296C8]'">
            {{ users[message.userId]?.name }}
          </sofa-normal-text>
          <sofa-normal-text :customClass="'text-left'" :isHtml="true" :content="message.body"></sofa-normal-text>
        </div>
      </div>

      <div class="min-w-[80px] w-full flex gap-2 items-end justify-end py-4" v-else>
        <div class="flex flex-row items-end gap-2 max-w-full md:!max-w-[80%] mdlg:!max-w-[80%] lg:!max-w-[70%]">
          <div class="p-3 custom-border text-left bg-[#E1E6EB]">
            <sofa-normal-text :customClass="'text-left'" :isHtml="true" :content="message.body">
            </sofa-normal-text>
          </div>
          <div class="w-[30px]">
            <sofa-avatar :bgColor="'!bg-[#78828C]'" :photoUrl="users[message.userId]?.photoUrl" :size="'27'">
              <sofa-icon :customClass="'h-[16px]'" :name="'user'" />
            </sofa-avatar>
          </div>
        </div>
      </div>
    </template>

    <div v-if="messages.length === 0" class="w-full flex items-center justify-center">
      <div class="px-4 py-2 custom-border bg-[#F1F6FA] text-center">
        <sofa-normal-text :color="'text-grayColor'" content="Send a message to get started" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAuth } from '@/composables/auth/auth'
import { useMessages } from '@/composables/conversations/messages'
import { ChatScroll as vChatScroll } from '@/directives/chat-scroll'
import { Conversation } from "sofa-logic"
import { SofaAvatar, SofaIcon, SofaNormalText } from "sofa-ui-components"
import { PropType, defineProps } from "vue"

const props = defineProps({
  conversation: {
    type: Object as PropType<Conversation>,
    required: true
  }
})

const { id } = useAuth()
const { messages, users } = useMessages(props.conversation)
</script>

<style scoped>
.loader span {
  background: #3219af;
  animation: loader 0.8s infinite alternate;
}

.loader span:nth-of-type(2) {
  animation-delay: 0.2s;
}

.loader span:nth-of-type(3) {
  animation-delay: 0.6s;
}

@keyframes loader {
  0% {
    opacity: 0.9;
    transform: scale(0.5);
  }

  100% {
    opacity: 0.1;
    transform: scale(1);
  }
}
</style>
